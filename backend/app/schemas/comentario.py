from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ComentarioCreate(BaseModel):
    cliente_id: int | None = None
    contenido: str
    canal: str = "web"
    estado: str = "pendiente"
    categoria: str | None = None


class ComentarioResponse(BaseModel):
    id: int
    cliente_id: int | None = None
    contenido: str
    canal: str
    estado: str
    categoria: str | None = None
    fecha: datetime | None = None
    procesado: bool

    model_config = ConfigDict(from_attributes=True)