from collections import Counter

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db

from app.models.cliente import Cliente
from app.models.comentario import Comentario
from app.models.analisis_nlp import AnalisisNLP
from app.models.tiempo_atencion import TiempoAtencion

from app.schemas.dashboard import DashboardResponse


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get(
    "",
    response_model=DashboardResponse
)
async def obtener_dashboard(
    db: AsyncSession = Depends(get_db)
):
    # ============================================
    # CLIENTES
    # ============================================

    resultado_clientes = await db.execute(
        select(
            func.count(Cliente.id)
        )
    )

    cantidad_clientes = (
        resultado_clientes.scalar_one()
    )


    # ============================================
    # COMENTARIOS
    # ============================================

    resultado_comentarios = await db.execute(
        select(
            func.count(Comentario.id)
        )
    )

    cantidad_comentarios = (
        resultado_comentarios.scalar_one()
    )


    # ============================================
    # COMENTARIOS PROCESADOS
    # ============================================

    resultado_procesados = await db.execute(
        select(
            func.count(Comentario.id)
        ).where(
            Comentario.procesado.is_(True)
        )
    )

    cantidad_procesados = (
        resultado_procesados.scalar_one()
    )

    if cantidad_comentarios > 0:
        porcentaje_procesados = (
            cantidad_procesados
            / cantidad_comentarios
        ) * 100
    else:
        porcentaje_procesados = 0


    # ============================================
    # PROMEDIO DE ATENCIÓN
    # ============================================

    resultado_promedio = await db.execute(
        select(
            func.avg(
                TiempoAtencion.tiempo_minutos
            )
        )
    )

    promedio = resultado_promedio.scalar_one()

    promedio_atencion = (
        float(promedio)
        if promedio is not None
        else 0.0
    )


    # ============================================
    # CATEGORÍAS NLP
    # ============================================

    resultado_categorias = await db.execute(
        select(
            AnalisisNLP.categoria_detectada,
            func.count(AnalisisNLP.id)
        )
        .where(
            AnalisisNLP.categoria_detectada.is_not(
                None
            )
        )
        .group_by(
            AnalisisNLP.categoria_detectada
        )
    )

    registros_categorias = (
        resultado_categorias.all()
    )

    total_categorias = sum(
        cantidad
        for _, cantidad
        in registros_categorias
    )

    categorias_nlp = []

    for categoria, cantidad in registros_categorias:

        porcentaje = (
            cantidad / total_categorias * 100
            if total_categorias > 0
            else 0
        )

        categorias_nlp.append({
            "categoria": categoria,
            "cantidad": cantidad,
            "porcentaje": round(
                porcentaje,
                2
            )
        })


    # ============================================
    # PALABRAS FRECUENTES NLP
    # ============================================

    resultado_palabras = await db.execute(
        select(
            AnalisisNLP.palabras_frecuentes
        )
    )

    registros_palabras = (
        resultado_palabras.scalars().all()
    )

    contador_palabras = Counter()

    for lista_palabras in registros_palabras:

        if not lista_palabras:
            continue

        for elemento in lista_palabras:

            palabra = elemento.get(
                "palabra"
            )

            frecuencia = elemento.get(
                "frecuencia",
                0
            )

            if palabra:
                contador_palabras[
                    palabra
                ] += frecuencia

    palabras_frecuentes = [
        {
            "palabra": palabra,
            "frecuencia": frecuencia
        }
        for palabra, frecuencia
        in contador_palabras.most_common(10)
    ]


    # ============================================
    # EVOLUCIÓN DE TIEMPOS DE ATENCIÓN
    # ============================================

    resultado_tiempos = await db.execute(
        select(
            TiempoAtencion.fecha,
            func.avg(
                TiempoAtencion.tiempo_minutos
            ),
            func.count(
                TiempoAtencion.id
            )
        )
        .where(
            TiempoAtencion.fecha.is_not(
                None
            )
        )
        .group_by(
            TiempoAtencion.fecha
        )
        .order_by(
            TiempoAtencion.fecha
        )
    )

    registros_tiempos = (
        resultado_tiempos.all()
    )

    tiempos_atencion = [
        {
            "fecha": fecha,
            "promedio": round(
                float(promedio_dia),
                2
            ),
            "cantidad": cantidad
        }
        for fecha, promedio_dia, cantidad
        in registros_tiempos[-7:]
    ]


    # ============================================
    # RESPUESTA
    # ============================================

    return {
        "clientes":
            cantidad_clientes,

        "comentarios":
            cantidad_comentarios,

        "promedio_atencion":
            round(
                promedio_atencion,
                2
            ),

        "porcentaje_procesados":
            round(
                porcentaje_procesados,
                2
            ),

        "categorias_nlp":
            categorias_nlp,

        "palabras_frecuentes":
            palabras_frecuentes,

        "tiempos_atencion":
            tiempos_atencion
    }