from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.models.cliente import Cliente
from app.schemas.cliente import ClienteCreate, ClienteUpdate, ClienteResponse


router = APIRouter(
    prefix="/api/clientes",
    tags=["Clientes"]
)


# LISTAR TODOS
@router.get(
    "",
    response_model=list[ClienteResponse]
)
async def listar_clientes(
    db: AsyncSession = Depends(get_db)
):
    resultado = await db.execute(
        # Es como hacer SELECT * FROM clientes ORDER BY id
        select(Cliente).order_by(Cliente.id)
    )

    # Obtiene todos los clientes encontrados
    clientes = resultado.scalars().all()

    return clientes


# OBTENER CLIENTE POR ID
@router.get(
    "/{cliente_id}",
    response_model=ClienteResponse
)
async def obtener_cliente(
    cliente_id: int,
    db: AsyncSession = Depends(get_db)
):
    resultado = await db.execute(
        # Es como hacer SELECT * FROM clientes WHERE id = cliente_id
        select(Cliente).where(Cliente.id == cliente_id)
    )

    # Obtiene el primer cliente encontrado o None si no existe
    cliente = resultado.scalar_one_or_none()

    if cliente is None:
        raise HTTPException(
            status_code=404,
            detail="Cliente no encontrado"
        )

    return cliente


# CREAR CLIENTE
@router.post(
    "",
    response_model=ClienteResponse,
    status_code=status.HTTP_201_CREATED
)
async def crear_cliente(
    datos: ClienteCreate,
    db: AsyncSession = Depends(get_db)
):
    nuevo_cliente = Cliente(
        nombre=datos.nombre,
        email=datos.email,
        telefono=datos.telefono,
        empresa=datos.empresa,
        activo=datos.activo
    )

    db.add(nuevo_cliente)

    await db.commit()
    await db.refresh(nuevo_cliente)

    return nuevo_cliente


# ACTUALIZAR CLIENTE
@router.put(
    "/{cliente_id}",
    response_model=ClienteResponse
)
async def actualizar_cliente(
    cliente_id: int,
    datos: ClienteUpdate,
    db: AsyncSession = Depends(get_db)
):
    resultado = await db.execute(
        select(Cliente).where(Cliente.id == cliente_id)
    )

    cliente = resultado.scalar_one_or_none()

    if cliente is None:
        raise HTTPException(
            status_code=404,
            detail="Cliente no encontrado"
        )

    datos_actualizados = datos.model_dump(
        exclude_unset=True
    )

    for campo, valor in datos_actualizados.items():
        setattr(cliente, campo, valor)

    await db.commit()
    await db.refresh(cliente)

    return cliente


# ELIMINAR CLIENTE
@router.delete(
    "/{cliente_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def eliminar_cliente(
    cliente_id: int,
    db: AsyncSession = Depends(get_db)
):
    resultado = await db.execute(
        select(Cliente).where(Cliente.id == cliente_id)
    )

    cliente = resultado.scalar_one_or_none()

    if cliente is None:
        raise HTTPException(
            status_code=404,
            detail="Cliente no encontrado"
        )

    await db.delete(cliente)
    await db.commit()

    return None