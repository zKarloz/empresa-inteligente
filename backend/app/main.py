import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.clientes import router as clientes_router
from app.api.comentarios import router as comentarios_router
from app.api.tiempos_atencion import router as tiempos_router
from app.api.scipy import router as scipy_router
from app.api.nltk import router as nltk_router
from app.api.dashboard import router as dashboard_router

from app.database.connection import engine


# ============================================
# VARIABLES DE ENTORNO
# ============================================

BASE_DIR = Path(__file__).resolve().parents[1]
ENV_PATH = BASE_DIR / ".env"

load_dotenv(ENV_PATH)


FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
).rstrip("/")


# ============================================
# APLICACIÓN
# ============================================

app = FastAPI(
    title="Centro Inteligente API",
    version="1.0.0",
    description=(
        "API empresarial para gestión de clientes, "
        "atención, análisis NLP y procesamiento "
        "científico con SciPy."
    )
)


# ============================================
# CORS
# ============================================

origins = [
    FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Evitar orígenes duplicados
origins = list(dict.fromkeys(origins))


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# ROUTERS
# ============================================

app.include_router(clientes_router)
app.include_router(comentarios_router)
app.include_router(tiempos_router)
app.include_router(nltk_router)
app.include_router(scipy_router)
app.include_router(dashboard_router)


# ============================================
# RUTA PRINCIPAL
# ============================================

@app.get("/")
async def inicio():
    return {
        "message": "Centro Inteligente API",
        "status": "online"
    }


# ============================================
# TEST DE BASE DE DATOS
# TEMPORAL: eliminar antes del deploy final
# ============================================

@app.get("/api/test-db")
async def test_database():
    async with engine.connect() as conexion:
        resultado = await conexion.execute(
            text("SELECT COUNT(*) FROM clientes")
        )

        cantidad_clientes = resultado.scalar_one()

    return {
        "database": "conectada",
        "clientes": cantidad_clientes
    }