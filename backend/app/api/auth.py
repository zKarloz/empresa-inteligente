"""Inicio de sesión del administrador actual; no implementa aún gestión multiusuario."""

from app.core.config import ADMIN_EMAIL, ADMIN_PASSWORD_HASH
from app.core.security import (
    bearer,
    issue_token,
    require_session,
    token_hash,
    verify_password,
)
from app.database.connection import get_db
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])


class LoginRequest(BaseModel):
    email: str = Field(min_length=1, max_length=254)
    password: str = Field(min_length=1, max_length=256)
    facial: bool = False


@router.post("/login")
async def login(datos: LoginRequest, db: AsyncSession = Depends(get_db)):
    # Límite compartido entre procesos: 10 intentos por ventana de 15 minutos.
    result = await db.execute(
        text("""
        INSERT INTO auth_login_limits (key, attempts, window_start)
        VALUES ('admin', 1, NOW()) ON CONFLICT (key) DO UPDATE SET
        attempts = CASE WHEN auth_login_limits.window_start < NOW() - INTERVAL '15 minutes'
                        THEN 1 ELSE auth_login_limits.attempts + 1 END,
        window_start = CASE WHEN auth_login_limits.window_start < NOW() - INTERVAL '15 minutes'
                            THEN NOW() ELSE auth_login_limits.window_start END
        RETURNING attempts
    """)
    )
    attempts = result.scalar_one()
    await db.commit()  # Los intentos fallidos también deben quedar guardados.
    if attempts > 10:
        raise HTTPException(429, "Demasiados intentos. Espera 15 minutos")
    valid = await run_in_threadpool(verify_password, datos.password, ADMIN_PASSWORD_HASH)
    if datos.email.strip().lower() != ADMIN_EMAIL or not valid:
        raise HTTPException(401, "Correo o contraseña incorrectos")

    # El modo facial recibe un permiso de dos minutos, no una sesión del dashboard.
    purpose = "face_challenge" if datos.facial else "session"
    token = await issue_token(db, ADMIN_EMAIL, purpose)
    await db.commit()
    return {"token": token, "facial_pendiente": datos.facial, "usuario_email": ADMIN_EMAIL}


@router.get("/me")
async def me(email: str = Depends(require_session)):
    return {"usuario_email": email, "nombre": "Administrador", "rol": "Administrador"}


@router.post("/logout", status_code=204)
async def logout(
    request: Request, db: AsyncSession = Depends(get_db), email: str = Depends(require_session)
):
    await db.execute(
        text("DELETE FROM auth_sessions WHERE token_hash = :hash"),
        {"hash": token_hash(bearer(request))},
    )
    await db.commit()
