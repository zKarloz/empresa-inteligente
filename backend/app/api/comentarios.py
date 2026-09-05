from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

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
        contenido=datos.contenido,
        canal=datos.canal,
        estado=datos.estado,
        categoria=datos.categoria,
        procesado=False
    )

    db.add(nuevo_comentario)

    await db.commit()
    await db.refresh(nuevo_comentario)

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