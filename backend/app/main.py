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


app = FastAPI(
    title="Centro Inteligente API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(clientes_router)
app.include_router(comentarios_router)
app.include_router(tiempos_router)
app.include_router(scipy_router)
app.include_router(nltk_router)
app.include_router(dashboard_router)

@app.get("/")
async def inicio():
    return {
        "mensaje": "Backend del Centro Inteligente funcionando"
    }


@app.get("/api/test-db")
async def test_database():
    async with engine.connect() as connection:

        resultado = await connection.execute(
            text("SELECT COUNT(*) FROM clientes")
        )

        total_clientes = resultado.scalar_one()

    return {
        "database": "conectada",
        "clientes": total_clientes,
    }