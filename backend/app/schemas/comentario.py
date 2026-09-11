from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ComentarioCreate(BaseModel):
    cliente_id: int | None = None

    nombre_cliente: str | None = Field(
        default=None, max_length=150
    )
    apellido_cliente: str | None = Field(
        default=None, max_length=150
    )
    empresa_cliente: str | None = Field(
        default=None, max_length=200
    )
    telefono_cliente: str | None = Field(
        default=None, max_length=30
    )
    correo_cliente: str | None = Field(
        default=None, max_length=254
    )

    contenido: str
    canal: str = "web"
    estado: str = "pendiente"
    categoria: str | None = None


class ComentarioResponse(BaseModel):
    id: int
    cliente_id: int | None = None

    nombre_cliente: str | None = None
    apellido_cliente: str | None = None
    empresa_cliente: str | None = None
    telefono_cliente: str | None = None
    correo_cliente: str | None = None

    contenido: str
    canal: str
    estado: str
    categoria: str | None = None
    fecha: datetime | None = None
    procesado: bool

    model_config = ConfigDict(from_attributes=True)