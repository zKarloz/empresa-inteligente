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

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

app = FastAPI(
    title="Centro Inteligente API",
    description="API REST para la gestión de atenciones con modelos SciPy y NLTK",
    version="1.0.0"
)

# ============================================
# Configuración CORS
# ============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# Inclusión de Rutas
# ============================================
app.include_router(clientes_router)
app.include_router(comentarios_router)
app.include_router(tiempos_router)
app.include_router(nltk_router)
app.include_router(scipy_router)
app.include_router(dashboard_router)


@app.get("/")
async def inicio():
    return {"message": "Centro Inteligente API", "status": "online"}


@app.get("/api/test-db")
async def test_database():
    try:
        async with engine.connect() as conexion:
            resultado = await conexion.execute(text("SELECT COUNT(*) FROM clientes"))
            cantidad = resultado.scalar_one()
        return {"database": "conectada", "clientes": cantidad}
    except Exception as e:
        return {"database": "error", "detalle": str(e)}