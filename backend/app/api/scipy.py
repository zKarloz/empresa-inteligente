from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.models.tiempo_atencion import TiempoAtencion
from app.schemas.metrica import EstadisticasResponse, MetricaEstadisticaResponse
from app.services.scipy_service import calcular_estadisticas
from app.models.metrica_estadistica import MetricaEstadistica


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


@router.post(
    "/estadisticas",
    response_model=MetricaEstadisticaResponse,
    status_code=201
)
async def guardar_estadisticas(
    db: AsyncSession = Depends(get_db)
):
    resultado = await db.execute(
        # Recupera tanto el tiempo de atención como la fecha para poder establecer el rango de fechas de los registros
        select(
            TiempoAtencion.tiempo_minutos,
            TiempoAtencion.fecha
        )
    )

    registros = resultado.all()

    if not registros:
        raise HTTPException(
            status_code=404,
            detail="No existen tiempos de atención registrados"
        )

    valores = [
        float(registro.tiempo_minutos)
        for registro in registros
    ]

    fechas = [
        registro.fecha
        for registro in registros
    ]

    # Calcular las estadísticas usando la función del servicio SciPy
    estadisticas = calcular_estadisticas(valores)

    nueva_metrica = MetricaEstadistica(
        # Determinar el rango real de los datos utilizados
        fecha_inicio=min(fechas),
        fecha_fin=max(fechas),

        cantidad_registros=estadisticas["cantidad"],

        media=estadisticas["media"],
        mediana=estadisticas["mediana"],
        desviacion_estandar=estadisticas[
            "desviacion_estandar"
        ],

        minimo=estadisticas["minimo"],
        maximo=estadisticas["maximo"],

        percentil_25=estadisticas["percentil_25"],
        percentil_75=estadisticas["percentil_75"]
    )

    db.add(nueva_metrica)

    await db.commit()
    await db.refresh(nueva_metrica)

    return nueva_metrica