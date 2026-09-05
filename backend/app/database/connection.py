import os
from pathlib import Path
from urllib.parse import urlsplit

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession,
)


# Ruta de la carpeta backend
BASE_DIR = Path(__file__).resolve().parents[2]

# Ruta exacta del archivo .env
ENV_PATH = BASE_DIR / ".env"

# Cargar variables de entorno
load_dotenv(ENV_PATH)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        f"No se encontró DATABASE_URL en el archivo: {ENV_PATH}"
    )


# Prueba temporal para comprobar qué conexión está leyendo
url = urlsplit(DATABASE_URL)

print("ENV:", ENV_PATH)
print("HOST:", url.hostname)
print("PORT:", url.port)
print("USER:", url.username)


engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
)


SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db():
    async with SessionLocal() as session:
        yield session