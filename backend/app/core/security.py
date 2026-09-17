"""Contraseñas y sesiones opacas: la base de datos guarda solo hashes de tokens."""

import hashlib
import hmac
import secrets

from app.core.config import CHALLENGE_SECONDS, SESSION_SECONDS
from app.database.connection import get_db
from fastapi import Depends, HTTPException, Request
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool


def verify_password(password: str, encoded: str) -> bool:
    # scrypt es deliberadamente costoso para dificultar probar contraseñas en masa.
    try:
        algorithm, salt, expected = encoded.split("$")
        if algorithm != "scrypt":
            return False
        actual = hashlib.scrypt(
            password.encode(), salt=bytes.fromhex(salt), n=16384, r=8, p=1, dklen=32
        ).hex()
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def bearer(request: Request) -> str:
    scheme, _, token = request.headers.get("Authorization", "").partition(" ")
    if scheme.lower() != "bearer" or not token or len(token) > 256:
        raise HTTPException(401, "Inicia sesión nuevamente")
    return token


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.scrypt(password.encode(), salt=salt, n=16384, r=8, p=1, dklen=32)
    return "scrypt$" + salt.hex() + "$" + digest.hex()


# Comprobar también un hash cuando el correo no existe evita una salida inmediata.
DUMMY_PASSWORD_HASH = hash_password(secrets.token_urlsafe(32))


async def consume_attempt(db: AsyncSession, email: str, action: str):
    """Diez solicitudes por cuenta y acción en una ventana de quince minutos."""
    key = action + ":" + token_hash(email)
    await db.execute(
        text("DELETE FROM auth_login_limits WHERE window_start < NOW() - INTERVAL '15 minutes'")
    )
    attempts = (
        await db.execute(
            text("""
        INSERT INTO auth_login_limits (key, attempts, window_start)
        VALUES (:key, 1, NOW()) ON CONFLICT (key) DO UPDATE
        SET attempts = auth_login_limits.attempts + 1 RETURNING attempts
    """),
            {"key": key},
        )
    ).scalar_one()
    await db.commit()  # Contabilizar incluso las contraseñas incorrectas.
    if attempts > 10:
        raise HTTPException(429, "Demasiados intentos. Espera 15 minutos")


async def check_current_password(db: AsyncSession, email: str, password: str, action: str):
    await consume_attempt(db, email, action)
    # Bloquear el usuario hasta terminar el cambio evita carreras con su desactivación.
    row = (
        (
            await db.execute(
                text("""
        SELECT password_hash FROM app_usuarios WHERE usuario_email = :email AND activo = TRUE
        FOR UPDATE
    """),
                {"email": email},
            )
        )
        .mappings()
        .first()
    )
    valid = await run_in_threadpool(
        verify_password, password, row["password_hash"] if row else DUMMY_PASSWORD_HASH
    )
    if not row or not valid:
        raise HTTPException(403, "La contraseña actual no es correcta o la cuenta está desactivada")


async def issue_token(db: AsyncSession, email: str, purpose: str) -> str:
    # La versión impide que una sesión antigua reviva al reactivar una cuenta.
    version = (
        await db.execute(
            text("""
        SELECT session_version FROM app_usuarios WHERE usuario_email = :email AND activo = TRUE
    """),
            {"email": email},
        )
    ).scalar_one_or_none()
    if version is None:
        raise HTTPException(401, "La cuenta no está disponible")
    token = secrets.token_urlsafe(32)
    seconds = SESSION_SECONDS if purpose == "session" else CHALLENGE_SECONDS
    await db.execute(text("DELETE FROM auth_sessions WHERE expires_at <= NOW()"))
    await db.execute(
        text("""
        INSERT INTO auth_sessions (token_hash, usuario_email, purpose, expires_at, usuario_version)
        VALUES (:hash, :email, :purpose, NOW() + :seconds * INTERVAL '1 second', :version)
    """),
        {
            "hash": token_hash(token),
            "email": email,
            "purpose": purpose,
            "seconds": seconds,
            "version": version,
        },
    )
    return token


async def require_user(request: Request, db: AsyncSession = Depends(get_db)) -> dict:
    row = (
        (
            await db.execute(
                text("""
        SELECT u.id, u.usuario_email, u.nombre, u.rol, u.activo
        FROM auth_sessions s JOIN app_usuarios u ON u.usuario_email = s.usuario_email
        WHERE s.token_hash = :hash AND s.purpose = 'session' AND s.expires_at > NOW()
          AND u.activo = TRUE AND s.usuario_version = u.session_version
    """),
                {"hash": token_hash(bearer(request))},
            )
        )
        .mappings()
        .first()
    )
    if not row:
        raise HTTPException(401, "Sesión inválida, vencida o cuenta desactivada")
    return dict(row)


async def require_session(request: Request, db: AsyncSession = Depends(get_db)) -> str:
    # Mantener el contrato usado por los módulos existentes.
    return (await require_user(request, db))["usuario_email"]


async def require_admin(user: dict = Depends(require_user)) -> dict:
    if user["rol"] != "Administrador":
        raise HTTPException(403, "Esta operación requiere una cuenta administradora")
    return user


async def protect_api(request: Request, db: AsyncSession = Depends(get_db)):
    # Lista explícita: solo la landing, login y verificación del reto son públicos.
    # /verificar valida su propio token de reto; este NO autoriza el dashboard.
    public = {
        ("GET", "/"),
        ("POST", "/api/comentarios"),
        ("POST", "/api/auth/login"),
        ("POST", "/api/biometria/verificar"),
    }
    if (request.method, request.url.path.rstrip("/") or "/") not in public:
        await require_session(request, db)
