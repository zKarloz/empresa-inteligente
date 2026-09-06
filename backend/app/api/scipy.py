from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db

from app.models.tiempo_atencion import TiempoAtencion
from app.models.metrica_estadistica import MetricaEstadistica
from app.models.optimizacion import Optimizacion

from app.schemas.metrica import (
    EstadisticasResponse,
    MetricaEstadisticaResponse,
    InterpolacionRequest,
    InterpolacionResponse,
    OptimizacionRequest,
    OptimizacionResponse
)

from app.services.scipy_service import (
    calcular_estadisticas,
    interpolar_valores,
    optimizar_recursos
)


router = APIRouter(
    prefix="/api/scipy",
    tags=["SciPy"]
)


# ============================================
# OBTENER ESTADÍSTICAS
# ============================================

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

    estadisticas = calcular_estadisticas(
        valores
    )

    return estadisticas


# ============================================
# CALCULAR Y GUARDAR ESTADÍSTICAS
# ============================================

@router.post(
    "/estadisticas",
    response_model=MetricaEstadisticaResponse,
    status_code=status.HTTP_201_CREATED
)
async def guardar_estadisticas(
    db: AsyncSession = Depends(get_db)
):
    resultado = await db.execute(
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

    # Ignorar posibles registros antiguos sin fecha
    fechas = [
        registro.fecha
        for registro in registros
        if registro.fecha is not None
    ]

    if not fechas:
        raise HTTPException(
            status_code=400,
            detail="Los registros no tienen fechas válidas"
        )

    estadisticas = calcular_estadisticas(
        valores
    )

    nueva_metrica = MetricaEstadistica(
        fecha_inicio=min(fechas),
        fecha_fin=max(fechas),

        cantidad_registros=estadisticas[
            "cantidad"
        ],

        media=estadisticas[
            "media"
        ],

        mediana=estadisticas[
            "mediana"
        ],

        desviacion_estandar=estadisticas[
            "desviacion_estandar"
        ],

        minimo=estadisticas[
            "minimo"
        ],

        maximo=estadisticas[
            "maximo"
        ],

        percentil_25=estadisticas[
            "percentil_25"
        ],

        percentil_75=estadisticas[
            "percentil_75"
        ]
    )

    db.add(nueva_metrica)

    await db.commit()
    await db.refresh(
        nueva_metrica
    )

    return nueva_metrica


# ============================================
# INTERPOLACIÓN
# ============================================

@router.post(
    "/interpolacion",
    response_model=InterpolacionResponse
)
async def interpolar(
    datos: InterpolacionRequest
):
    try:
        resultados = interpolar_valores(
            datos.x_conocidos,
            datos.y_conocidos,
            datos.x_estimar
        )

        return {
            "resultados": resultados
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error


# ============================================
# OPTIMIZACIÓN
# ============================================

@router.post(
    "/optimizacion",
    response_model=OptimizacionResponse,
    status_code=status.HTTP_201_CREATED
)
async def optimizar(
    datos: OptimizacionRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        resultado = optimizar_recursos(
            datos.recurso_a_inicial,
            datos.recurso_b_inicial,
            datos.capacidad_minima
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error

    parametros = {
        "recurso_a_inicial":
            datos.recurso_a_inicial,

        "recurso_b_inicial":
            datos.recurso_b_inicial,

        "capacidad_minima":
            datos.capacidad_minima
    }

    resultado_guardar = {
        "recurso_a":
            resultado["recurso_a"],

        "recurso_b":
            resultado["recurso_b"],

        "ahorro":
            resultado["ahorro"]
    }

    nueva_optimizacion = Optimizacion(
        nombre=datos.nombre,
        descripcion=datos.descripcion,

        parametros_entrada=parametros,

        resultado=resultado_guardar,

        costo_inicial=resultado[
            "costo_inicial"
        ],

        costo_optimizado=resultado[
            "costo_optimizado"
        ],

        estado="completado"
    )

    db.add(nueva_optimizacion)

    await db.commit()
    await db.refresh(
        nueva_optimizacion
    )

    return nueva_optimizacion