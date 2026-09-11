from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.comentario_nlp_service import (
    procesar_comentario_nlp,
)

from app.database.connection import get_db

from app.models.cliente import Cliente
from app.models.comentario import Comentario

from app.schemas.comentario import (
    ComentarioCreate,
    ComentarioResponse
)


router = APIRouter(
    prefix="/api/comentarios",
    tags=["Comentarios"]
)


# LISTAR TODOS LOS COMENTARIOS
@router.get(
    "",
    response_model=list[ComentarioResponse]
)
async def listar_comentarios(
    db: AsyncSession = Depends(get_db)
):
    resultado = await db.execute(
        select(Comentario).order_by(Comentario.id)
    )

    comentarios = resultado.scalars().all()

    return comentarios


# OBTENER COMENTARIO POR ID
@router.get(
    "/{comentario_id}",
    response_model=ComentarioResponse
)
async def obtener_comentario(
    comentario_id: int,
    db: AsyncSession = Depends(get_db)
):
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

    return comentario


# CREAR COMENTARIO
@router.post(
    "",
    response_model=ComentarioResponse,
    status_code=status.HTTP_201_CREATED
)
async def crear_comentario(
    datos: ComentarioCreate,
    db: AsyncSession = Depends(get_db)
):

    # Si se proporciona cliente_id,
    # comprobamos que el cliente realmente exista.
    if datos.cliente_id is not None:

        resultado_cliente = await db.execute(
            select(Cliente).where(
                Cliente.id == datos.cliente_id
            )
        )

        cliente = resultado_cliente.scalar_one_or_none()

        if cliente is None:
            raise HTTPException(
                status_code=404,
                detail="Cliente no encontrado"
            )

    nuevo_comentario = Comentario(
        cliente_id=datos.cliente_id,
        nombre_cliente=datos.nombre_cliente,
        apellido_cliente=datos.apellido_cliente,
        empresa_cliente=datos.empresa_cliente,
        telefono_cliente=datos.telefono_cliente,
        correo_cliente=datos.correo_cliente,
        contenido=datos.contenido,
        canal=datos.canal,
        estado=datos.estado,
        categoria=datos.categoria,
        procesado=False
    )

    db.add(nuevo_comentario)

    # Primero se guarda el comentario.
    # Así no se pierde si posteriormente falla NLTK.
    await db.commit()
    await db.refresh(nuevo_comentario)

    comentario_id = nuevo_comentario.id

    # ============================================
    # ANALIZAR AUTOMÁTICAMENTE CON NLTK
    # ============================================

    try:
        await procesar_comentario_nlp(
            nuevo_comentario,
            db
        )

    except Exception as error:
        # Deshacer únicamente la operación fallida
        # relacionada con el análisis NLP.
        await db.rollback()

        print(
            "Error al procesar comentario con NLTK:",
            error
        )

        # Después de rollback, recuperamos nuevamente
        # el comentario que ya se guardó anteriormente.
        resultado_comentario = await db.execute(
            select(Comentario).where(
                Comentario.id == comentario_id
            )
        )

        nuevo_comentario = (
            resultado_comentario.scalar_one()
        )

    return nuevo_comentario


# ELIMINAR COMENTARIO
@router.delete(
    "/{comentario_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def eliminar_comentario(
    comentario_id: int,
    db: AsyncSession = Depends(get_db)
):
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

    await db.delete(comentario)

    await db.commit()

    return None