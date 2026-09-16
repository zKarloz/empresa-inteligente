"""Ejecutar: python scripts/generar_password_hash.py (la contraseña no se muestra)."""

import getpass
import hashlib
import secrets

if __name__ == "__main__":
    password = getpass.getpass("Nueva contraseña del administrador (mínimo 15 caracteres): ")
    if len(password) < 15 or len(password) > 256:
        raise SystemExit("Usa entre 15 y 256 caracteres")
    if password != getpass.getpass("Repite la contraseña: "):
        raise SystemExit("Las contraseñas no coinciden")
    salt = secrets.token_bytes(16)
    digest = hashlib.scrypt(password.encode(), salt=salt, n=16384, r=8, p=1, dklen=32)
    print("ADMIN_PASSWORD_HASH=scrypt$" + salt.hex() + "$" + digest.hex())
