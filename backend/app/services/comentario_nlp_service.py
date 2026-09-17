from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.comentario import Comentario
from app.models.analisis_nlp import AnalisisNLP
from app.services.nltk_service import analizar_texto, clasificar_texto


async def procesar_comentario_nlp(comentario: Comentario, db: AsyncSession) -> AnalisisNLP:
    """Crea o actualiza el análisis del texto original, sin cambiar el comentario."""
    # Serializar análisis del mismo comentario, incluso cuando aún no tienen fila.
    resultado = await db.execute(
        select(Comentario).where(Comentario.id == comentario.id)
        .with_for_update().execution_options(populate_existing=True)
    )
    comentario = resultado.scalar_one()
    resultado = await db.execute(
        select(AnalisisNLP).where(AnalisisNLP.comentario_id == comentario.id)
        .order_by(AnalisisNLP.id.desc()).limit(1)
    )
    analisis = resultado.scalar_one_or_none()
    if analisis is None:
        analisis = AnalisisNLP(comentario_id=comentario.id)
        db.add(analisis)

    texto = analizar_texto(comentario.contenido)
    clasificacion = clasificar_texto(comentario.contenido)
    analisis.idioma = 'es'
    analisis.cantidad_palabras = texto['cantidad_palabras']
    analisis.palabras_limpias = texto['tokens']
    analisis.palabras_frecuentes = texto['palabras_frecuentes']
    analisis.categoria_detectada = clasificacion['categoria']
    analisis.confianza = clasificacion['confianza']
    analisis.sentimiento = clasificacion['sentimiento']
    analisis.prioridad = clasificacion['prioridad']
    analisis.fecha_analisis = datetime.now(timezone.utc)
    comentario.procesado = True

    # El resultado y la marca de procesado se confirman en la misma transacción.
    await db.commit()
    await db.refresh(analisis)
    await db.refresh(comentario)
    return analisis
