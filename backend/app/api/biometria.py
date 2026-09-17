"""Registro autenticado y comparación facial posterior a la contraseña."""

from app.core.config import FACE_THRESHOLD, MAX_FACE_ATTEMPTS
from app.core.security import (
    bearer,
    check_current_password,
    issue_token,
    require_session,
    token_hash,
)
from app.database.connection import get_db
from app.schemas.biometria import BiometriaRegistro, BiometriaVerificacion
from app.services.biometria_service import (
    cifrar_embeddings,
    comparar_muestras,
    descifrar_embeddings,
)
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/api/biometria", tags=["Biometría facial"])


@router.post("/registrar")
async def registrar(
    datos: BiometriaRegistro,
    db: AsyncSession = Depends(get_db),
    email: str = Depends(require_session),
):
    # La identidad viene de la sesión, nunca de un correo elegido por el navegador.
    await check_current_password(db, email, datos.password_actual, "registro-facial")
    try:
        contenido = cifrar_embeddings(datos.embeddings)
    except (ValueError, RuntimeError):
        raise HTTPException(
            503, "El servidor no tiene una clave biométrica válida. Contacta al administrador"
        )
    await db.execute(
        text("""
        INSERT INTO biometria_facial
            (usuario_email, embeddings_encrypted, cantidad_muestras, activo, created_at, updated_at)
        VALUES (:email, :contenido, 5, TRUE, NOW(), NOW())
        ON CONFLICT (usuario_email) DO UPDATE SET
            embeddings_encrypted = EXCLUDED.embeddings_encrypted,
            cantidad_muestras = 5, activo = TRUE, updated_at = NOW()
    """),
        {"email": email, "contenido": contenido},
    )
    await db.commit()
    return {"registrado": True, "cantidad_muestras": 5, "usuario_email": email}


@router.get("/estado")
async def estado(db: AsyncSession = Depends(get_db), email: str = Depends(require_session)):
    row = (
        (
            await db.execute(
                text("""
        SELECT activo, cantidad_muestras FROM biometria_facial WHERE usuario_email = :email
    """),
                {"email": email},
            )
        )
        .mappings()
        .first()
    )
    return {
        "registrado": bool(row and row["activo"]),
        "usuario_email": email,
        "cantidad_muestras": row["cantidad_muestras"] if row else 0,
    }


@router.post("/verificar")
async def verificar(
    datos: BiometriaVerificacion, request: Request, db: AsyncSession = Depends(get_db)
):
    hashed = token_hash(bearer(request))
    # Primero bloquear la cuenta, igual que al cambiar contraseña o desactivarla.
    email = (
        await db.execute(
            text("""
        SELECT u.usuario_email FROM app_usuarios u
        JOIN auth_sessions s ON s.usuario_email = u.usuario_email
        WHERE s.token_hash = :hash AND s.purpose = 'face_challenge' AND s.expires_at > NOW()
          AND u.activo = TRUE AND s.usuario_version = u.session_version
        FOR UPDATE OF u
    """),
            {"hash": hashed},
        )
    ).scalar_one_or_none()
    if not email:
        raise HTTPException(401, "El permiso facial venció o la cuenta no está disponible")
    # Consumir el reto una sola vez, incluso si llegan dos peticiones juntas.
    challenge = (
        (
            await db.execute(
                text("""
        SELECT usuario_email, attempts FROM auth_sessions
        WHERE token_hash = :hash AND purpose = 'face_challenge' AND expires_at > NOW()
        FOR UPDATE
    """),
                {"hash": hashed},
            )
        )
        .mappings()
        .first()
    )
    if not challenge:
        raise HTTPException(401, "Vuelve a ingresar tu contraseña")
    if challenge["attempts"] >= MAX_FACE_ATTEMPTS:
        raise HTTPException(429, "Se agotaron los intentos. Vuelve a ingresar tu contraseña")
    await db.execute(
        text("UPDATE auth_sessions SET attempts = attempts + 1 WHERE token_hash = :hash"),
        {"hash": hashed},
    )
    row = (
        (
            await db.execute(
                text("""
        SELECT embeddings_encrypted FROM biometria_facial
        WHERE usuario_email = :email AND activo = TRUE
    """),
                {"email": email},
            )
        )
        .mappings()
        .first()
    )
    if not row:
        await db.commit()
        raise HTTPException(409, "Entra con contraseña y registra tu rostro en Configuración")
    try:
        verified, score, matches = comparar_muestras(
            datos.embedding, descifrar_embeddings(row["embeddings_encrypted"]), FACE_THRESHOLD
        )
    except (ValueError, TypeError, RuntimeError, OverflowError):
        await db.commit()
        raise HTTPException(409, "No se pudo procesar la biometría. Revisa o repite el registro")
    token = None
    if verified:
        # Solo ahora se emite una sesión; el reto se elimina para impedir su reutilización.
        await db.execute(
            text("DELETE FROM auth_sessions WHERE token_hash = :hash"), {"hash": hashed}
        )
        token = await issue_token(db, email, "session")
    await db.commit()
    return {
        "verificado": verified,
        "similitud": score,
        "coincidencias": matches,
        "token": token,
        "usuario_email": email,
    }
