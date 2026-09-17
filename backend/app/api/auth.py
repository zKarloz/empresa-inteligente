"""Cuentas individuales. Solo el administrador crea y desactiva trabajadores."""

import re

from app.core.security import (
    DUMMY_PASSWORD_HASH,
    bearer,
    check_current_password,
    consume_attempt,
    hash_password,
    issue_token,
    require_admin,
    require_session,
    require_user,
    token_hash,
    verify_password,
)
from app.database.connection import get_db
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, ConfigDict, Field, field_validator
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])


class DatosCorreo(BaseModel):
    model_config = ConfigDict(extra="forbid")
    email: str = Field(min_length=3, max_length=254)

    @field_validator("email")
    @classmethod
    def normalizar_email(cls, value: str) -> str:
        value = value.strip().lower()
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value):
            raise ValueError("Escribe un correo válido")
        return value


class LoginRequest(DatosCorreo):
    password: str = Field(min_length=1, max_length=256)
    facial: bool = False


class CrearUsuario(DatosCorreo):
    nombre: str = Field(min_length=1, max_length=150)
    password: str = Field(min_length=15, max_length=256)

    @field_validator("nombre")
    @classmethod
    def nombre_no_vacio(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("El nombre es obligatorio")
        return value.strip()


class EstadoUsuario(BaseModel):
    model_config = ConfigDict(extra="forbid")
    activo: bool


class CambioPassword(BaseModel):
    model_config = ConfigDict(extra="forbid")
    password_actual: str = Field(min_length=1, max_length=256)
    password_nueva: str = Field(min_length=15, max_length=256)


@router.post("/login")
async def login(datos: LoginRequest, db: AsyncSession = Depends(get_db)):
    await consume_attempt(db, datos.email, "login")
    # El bloqueo serializa login y cambios de contraseña/estado sobre esta cuenta.
    user = (
        (
            await db.execute(
                text("""
        SELECT usuario_email, password_hash, activo FROM app_usuarios
        WHERE usuario_email = :email FOR UPDATE
    """),
                {"email": datos.email},
            )
        )
        .mappings()
        .first()
    )
    valid = await run_in_threadpool(
        verify_password, datos.password, user["password_hash"] if user else DUMMY_PASSWORD_HASH
    )
    if not user or not valid or not user["activo"]:
        raise HTTPException(401, "Correo o contraseña incorrectos, o cuenta no disponible")
    purpose = "face_challenge" if datos.facial else "session"
    token = await issue_token(db, user["usuario_email"], purpose)
    await db.commit()
    return {
        "token": token,
        "facial_pendiente": datos.facial,
        "usuario_email": user["usuario_email"],
    }


@router.get("/me")
async def me(user: dict = Depends(require_user)):
    return user


@router.post("/logout", status_code=204)
async def logout(
    request: Request, db: AsyncSession = Depends(get_db), email: str = Depends(require_session)
):
    await db.execute(
        text("DELETE FROM auth_sessions WHERE token_hash = :hash"),
        {"hash": token_hash(bearer(request))},
    )
    await db.commit()


@router.get("/usuarios")
async def usuarios(db: AsyncSession = Depends(get_db), admin: dict = Depends(require_admin)):
    # Selección explícita: nunca devolver hashes ni descriptores biométricos.
    rows = await db.execute(
        text("""
        SELECT u.id, u.usuario_email, u.nombre, u.rol, u.activo,
               COALESCE(b.activo, FALSE) AS rostro_registrado
        FROM app_usuarios u LEFT JOIN biometria_facial b ON b.usuario_email = u.usuario_email
        ORDER BY u.id
    """)
    )
    return [dict(row) for row in rows.mappings().all()]


@router.post("/usuarios", status_code=201)
async def crear_usuario(
    datos: CrearUsuario, db: AsyncSession = Depends(get_db), admin: dict = Depends(require_admin)
):
    hashed = await run_in_threadpool(hash_password, datos.password)
    try:
        row = (
            (
                await db.execute(
                    text("""
            INSERT INTO app_usuarios (usuario_email, nombre, password_hash, rol)
            VALUES (:email, :nombre, :hash, 'Trabajador')
            RETURNING id, usuario_email, nombre, rol, activo
        """),
                    {"email": datos.email, "nombre": datos.nombre, "hash": hashed},
                )
            )
            .mappings()
            .first()
        )
        # Una cuenta nueva no hereda biometría huérfana de un registro antiguo.
        await db.execute(
            text("UPDATE biometria_facial SET activo = FALSE WHERE usuario_email = :email"),
            {"email": datos.email},
        )
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(409, "Ya existe una cuenta con ese correo")
    return dict(row)


@router.patch("/usuarios/{usuario_id}/estado")
async def cambiar_estado(
    usuario_id: int,
    datos: EstadoUsuario,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    user = (
        (
            await db.execute(
                text("SELECT * FROM app_usuarios WHERE id = :id FOR UPDATE"), {"id": usuario_id}
            )
        )
        .mappings()
        .first()
    )
    if not user:
        raise HTTPException(404, "Usuario no encontrado")
    # Conservar siempre la cuenta administradora. No hay promoción de roles por esta API.
    if user["rol"] == "Administrador" or user["id"] == admin["id"]:
        raise HTTPException(403, "No se puede desactivar la cuenta administradora")
    if user["activo"] != datos.activo:
        await db.execute(
            text("""
            UPDATE app_usuarios SET activo = :activo, session_version = session_version + 1,
                                    updated_at = NOW() WHERE id = :id
        """),
            {"activo": datos.activo, "id": usuario_id},
        )
        await db.execute(
            text("DELETE FROM auth_sessions WHERE usuario_email = :email"),
            {"email": user["usuario_email"]},
        )
    await db.commit()
    return {"id": usuario_id, "activo": datos.activo}


@router.post("/password")
async def cambiar_password(
    datos: CambioPassword, db: AsyncSession = Depends(get_db), email: str = Depends(require_session)
):
    await check_current_password(db, email, datos.password_actual, "password")
    hashed = await run_in_threadpool(hash_password, datos.password_nueva)
    await db.execute(
        text("""
        UPDATE app_usuarios SET password_hash = :hash, session_version = session_version + 1,
                                updated_at = NOW() WHERE usuario_email = :email
    """),
        {"hash": hashed, "email": email},
    )
    await db.execute(
        text("DELETE FROM auth_sessions WHERE usuario_email = :email"), {"email": email}
    )
    token = await issue_token(db, email, "session")
    await db.commit()
    return {"token": token}
