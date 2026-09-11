from sqlalchemy.ext.asyncio import AsyncSession

from app.models.comentario import Comentario
from app.models.analisis_nlp import AnalisisNLP

from app.services.nltk_service import (
    analizar_texto,
    clasificar_texto,
)


async def procesar_comentario_nlp(
    comentario: Comentario,
    db: AsyncSession
) -> AnalisisNLP:
    """
    Analiza un comentario guardado, registra el resultado
    en analisis_nlp y marca el comentario como procesado.
    """

    resultado_texto = analizar_texto(
        comentario.contenido
    )

    resultado_clasificacion = clasificar_texto(
        comentario.contenido
    )

    nuevo_analisis = AnalisisNLP(
        comentario_id=comentario.id,
        idioma="es",
        cantidad_palabras=resultado_texto[
            "cantidad_palabras"
        ],
        palabras_limpias=resultado_texto[
            "tokens"
        ],
        palabras_frecuentes=resultado_texto[
            "palabras_frecuentes"
        ],
        categoria_detectada=resultado_clasificacion[
            "categoria"
        ],
        confianza=resultado_clasificacion[
            "confianza"
        ]
    )

    db.add(nuevo_analisis)

    comentario.procesado = True

    await db.commit()

    await db.refresh(nuevo_analisis)
    await db.refresh(comentario)

    return nuevo_analisis