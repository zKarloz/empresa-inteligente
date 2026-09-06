from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db

from app.models.comentario import Comentario
from app.models.analisis_nlp import AnalisisNLP

from app.schemas.nlp import (
    AnalisisTextoRequest,
    AnalisisTextoResponse,
    AnalisisNLPResponse,
    ClasificacionRequest,
    ClasificacionResponse
)

from app.services.nltk_service import analizar_texto, clasificar_texto


router = APIRouter(
    prefix="/api/nltk",
    tags=["NLTK"]
)


# ANALIZAR TEXTO LIBRE
@router.post(
    "/analizar",
    response_model=AnalisisTextoResponse
)
async def analizar_comentario(
    datos: AnalisisTextoRequest
):
    resultado = analizar_texto(
        datos.texto
    )

    return resultado


@router.post(
    "/clasificar",
    response_model=ClasificacionResponse
)
async def clasificar_comentario(
    datos: ClasificacionRequest
):
    resultado = clasificar_texto(
        datos.texto
    )

    return resultado


# ANALIZAR COMENTARIO GUARDADO
@router.post(
    "/comentarios/{comentario_id}/analizar",
    response_model=AnalisisNLPResponse,
    status_code=201
)
async def analizar_comentario_guardado(
    comentario_id: int,
    db: AsyncSession = Depends(get_db)
):
    # Buscar comentario
    resultado = await db.execute(
        select(Comentario).where(
            Comentario.id == comentario_id
        )
    )

    comentario = resultado.scalar_one_or_none()

    if comentario is None:
        raise HTTPException(
            status_code=404,
            detail="Comentario no encontrado"
        )

    # Evitar analizar dos veces el mismo comentario
    resultado_analisis = await db.execute(
        select(AnalisisNLP).where(
            AnalisisNLP.comentario_id == comentario_id
        )
    )

    analisis_existente = (
        resultado_analisis.scalar_one_or_none()
    )

    if analisis_existente is not None:
        raise HTTPException(
            status_code=409,
            detail="El comentario ya fue analizado"
        )

    # Procesar texto con NLTK
    resultado_nlp = analizar_texto(
        comentario.contenido
    )

    # Clasificar texto con NLTK
    clasificacion = clasificar_texto(
    comentario.contenido
    )

    # Crear análisis
    nuevo_analisis = AnalisisNLP(
        comentario_id=comentario.id,
        
        idioma="es",

        cantidad_palabras=resultado_nlp[
            "cantidad_palabras"
        ],

        palabras_limpias=resultado_nlp[
            "tokens"
        ],

        palabras_frecuentes=resultado_nlp[
            "palabras_frecuentes"
        ],

        categoria_detectada=clasificacion[
            "categoria"
        ],

        confianza=clasificacion[
            "confianza"
        ]
    )

    db.add(nuevo_analisis)

    # Marcar comentario como procesado
    comentario.procesado = True

    await db.commit()
    await db.refresh(nuevo_analisis)

    return nuevo_analisis