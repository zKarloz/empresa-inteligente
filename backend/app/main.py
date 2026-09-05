from fastapi import FastAPI
from sqlalchemy import text

from app.api.clientes import router as clientes_router
from app.api.comentarios import router as comentarios_router

from app.database.connection import engine


app = FastAPI(
    title="Centro Inteligente API",
    version="1.0.0",
)


app.include_router(clientes_router)
app.include_router(comentarios_router)


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