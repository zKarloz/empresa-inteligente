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
from app.models.tiempo_atencion import TiempoAtencion

from app.schemas.tiempo_atencion import (
    TiempoAtencionCreate,
    TiempoAtencionResponse
)


router = APIRouter(
    prefix="/api/tiempos-atencion",
    tags=["Tiempos de Atención"]
)


# LISTAR TODOS
@router.get(
    "",
    response_model=list[TiempoAtencionResponse]
)
async def listar_tiempos(
    db: AsyncSession = Depends(get_db)
):
    resultado = await db.execute(
        select(TiempoAtencion).order_by(
            TiempoAtencion.id
        )
    )

    tiempos = resultado.scalars().all()

    return tiempos


# OBTENER POR ID
@router.get(
    "/{tiempo_id}",
    response_model=TiempoAtencionResponse
)
async def obtener_tiempo(
    tiempo_id: int,
    db: AsyncSession = Depends(get_db)
):
    resultado = await db.execute(
        select(TiempoAtencion).where(
            TiempoAtencion.id == tiempo_id
        )
    )

    tiempo = resultado.scalar_one_or_none()

    if tiempo is None:
        raise HTTPException(
            status_code=404,
            detail="Registro de tiempo no encontrado"
        )

    return tiempo


# CREAR
@router.post(
    "",
    response_model=TiempoAtencionResponse,
    status_code=status.HTTP_201_CREATED
)
async def crear_tiempo(
    datos: TiempoAtencionCreate,
    db: AsyncSession = Depends(get_db)
):

    # Comprobar cliente
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

    # Comprobar comentario
    if datos.comentario_id is not None:

        resultado_comentario = await db.execute(
            select(Comentario).where(
                Comentario.id == datos.comentario_id
            )
        )

        comentario = (
            resultado_comentario.scalar_one_or_none()
        )

        if comentario is None:
            raise HTTPException(
                status_code=404,
                detail="Comentario no encontrado"
            )

    nuevo_tiempo = TiempoAtencion(
        cliente_id=datos.cliente_id,
        comentario_id=datos.comentario_id,
        tiempo_minutos=datos.tiempo_minutos,
        operador=datos.operador
    )

    db.add(nuevo_tiempo)

    await db.commit()
    await db.refresh(nuevo_tiempo)

    return nuevo_tiempo


# ELIMINAR
@router.delete(
    "/{tiempo_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def eliminar_tiempo(
    tiempo_id: int,
    db: AsyncSession = Depends(get_db)
):
    resultado = await db.execute(
        select(TiempoAtencion).where(
            TiempoAtencion.id == tiempo_id
        )
    )

    tiempo = resultado.scalar_one_or_none()

    if tiempo is None:
        raise HTTPException(
            status_code=404,
            detail="Registro de tiempo no encontrado"
        )

    await db.delete(tiempo)

    await db.commit()

    return None