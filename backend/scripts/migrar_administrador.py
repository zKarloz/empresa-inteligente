"""Desde backend: python scripts/migrar_administrador.py.
Copia las credenciales existentes del .env a app_usuarios. No cambia rostros ni contraseñas.
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.core.config import required
from app.database.connection import SessionLocal, engine
from sqlalchemy import text


async def main():
    email = required("ADMIN_EMAIL").strip().lower()
    hashed = required("ADMIN_PASSWORD_HASH")
    # Validar el formato sin pedir ni imprimir la contraseña o el hash.
    import re

    if not re.fullmatch(r"scrypt\$[0-9a-fA-F]{32}\$[0-9a-fA-F]{64}", hashed):
        raise RuntimeError("ADMIN_PASSWORD_HASH no tiene el formato scrypt esperado")
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        raise RuntimeError("ADMIN_EMAIL no es válido")
    async with SessionLocal() as db:
        await db.execute(
            text("""
            INSERT INTO app_usuarios (usuario_email, nombre, password_hash, rol)
            VALUES (:email, 'Administrador', :hash, 'Administrador')
            ON CONFLICT (usuario_email) DO NOTHING
        """),
            {"email": email, "hash": hashed},
        )
        row = (
            (
                await db.execute(
                    text("SELECT rol, activo FROM app_usuarios WHERE usuario_email = :email"),
                    {"email": email},
                )
            )
            .mappings()
            .first()
        )
        if row["rol"] != "Administrador" or not row["activo"]:
            raise RuntimeError(
                "Ese correo ya existe sin permisos de administrador activo; revisa la cuenta"
            )
        await db.commit()
    print("Administrador disponible. Se conservaron su contraseña y sus muestras existentes.")


async def ejecutar():
    try:
        await main()
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(ejecutar())
