from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from app.services.comentario_nlp_service import (
    procesar_comentario_nlp,
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

    comentario = (
        resultado.scalar_one_or_none()
    )


    if comentario is None:

        raise HTTPException(
            status_code=404,
            detail="Comentario no encontrado"
        )


    # Comprobar si ya fue analizado
    resultado_analisis = await db.execute(
        select(AnalisisNLP).where(
            AnalisisNLP.comentario_id
            == comentario_id
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


    return await procesar_comentario_nlp(
        comentario,
        db
    )

@router.get(
    "/analisis",
    response_model=list[AnalisisNLPResponse]
)
async def obtener_analisis_nlp(
    db: AsyncSession = Depends(get_db)
):
    resultado = await db.execute(
        select(AnalisisNLP)
        .order_by(AnalisisNLP.id.desc())
    )

    return resultado.scalars().all()