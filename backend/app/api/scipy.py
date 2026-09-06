from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.models.tiempo_atencion import TiempoAtencion
from app.schemas.metrica import EstadisticasResponse
from app.services.scipy_service import calcular_estadisticas


router = APIRouter(
    prefix="/api/scipy",
    tags=["SciPy"]
)


@router.get(
    "/estadisticas",
    response_model=EstadisticasResponse
)
async def obtener_estadisticas(
    db: AsyncSession = Depends(get_db)
):
    resultado = await db.execute(
        select(TiempoAtencion.tiempo_minutos)
    )

    registros = resultado.scalars().all()

    if not registros:
        raise HTTPException(
            status_code=404,
            detail="No existen tiempos de atención registrados"
        )

    valores = [
        float(valor)
        for valor in registros
    ]

    estadisticas = calcular_estadisticas(valores)

    return estadisticas