from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.models.cliente import Cliente
from app.schemas.cliente import ClienteResponse


router = APIRouter(
    prefix="/api/clientes",
    tags=["Clientes"]
)


@router.get(
    "",
    response_model=list[ClienteResponse]
)
async def listar_clientes(
    db: AsyncSession = Depends(get_db)
):
    resultado = await db.execute(
        # Es como hacer SELECT * FROM clientes ORDER BY id
        select(Cliente).order_by(Cliente.id)
    )

    # Obtiene todos los clientes encontrados
    clientes = resultado.scalars().all()

    return clientes