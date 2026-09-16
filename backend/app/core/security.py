"""Contraseñas y sesiones opacas: la base de datos guarda solo hashes de tokens."""

import hashlib
import hmac
import secrets

from app.core.config import ADMIN_EMAIL, CHALLENGE_SECONDS, SESSION_SECONDS
from app.database.connection import get_db
from fastapi import Depends, HTTPException, Request
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


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


async def issue_token(db: AsyncSession, email: str, purpose: str) -> str:
    # El token completo sale una sola vez hacia el navegador; nunca se registra en logs.
    token = secrets.token_urlsafe(32)
    seconds = SESSION_SECONDS if purpose == "session" else CHALLENGE_SECONDS
    await db.execute(text("DELETE FROM auth_sessions WHERE expires_at <= NOW()"))
    await db.execute(
        text("""
        INSERT INTO auth_sessions (token_hash, usuario_email, purpose, expires_at)
        VALUES (:hash, :email, :purpose, NOW() + :seconds * INTERVAL '1 second')
    """),
        {"hash": token_hash(token), "email": email, "purpose": purpose, "seconds": seconds},
    )
    return token


async def require_session(request: Request, db: AsyncSession = Depends(get_db)) -> str:
    result = await db.execute(
        text("""
        SELECT usuario_email FROM auth_sessions
        WHERE token_hash = :hash AND purpose = 'session' AND expires_at > NOW()
    """),
        {"hash": token_hash(bearer(request))},
    )
    email = result.scalar_one_or_none()
    if email != ADMIN_EMAIL:
        raise HTTPException(401, "Sesión inválida o vencida")
    return email


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
