from datetime import datetime

from pydantic import BaseModel, ConfigDict

# Como queremos devolver el cliente por JSON

class ClienteCreate(BaseModel):
    nombre: str
    email: str | None = None
    telefono: str | None = None
    empresa: str | None = None
    activo: bool = True

class ClienteUpdate(BaseModel):
    nombre: str | None = None
    email: str | None = None
    telefono: str | None = None
    empresa: str | None = None
    activo: bool | None = None

class ClienteResponse(BaseModel):
    id: int
    nombre: str
    email: str | None = None
    telefono: str | None = None
    empresa: str | None = None
    activo: bool
    created_at: datetime | None = None
    updated_at: datetime | None = None

    # ConfigDict(from_attributes=True) permite que Pydantic convierta el objeto SQLAlchemy Cliente en una respuesta JSON
    model_config = ConfigDict(from_attributes=True)

# No se necesita un esquema para eliminar un cliente, ya que sería innecesario devolver algo como "cliente eliminado"
# Si sale bien, devolveremos un código de estado 204 (No Content) y por eso no habrá contenido en la respuesta.