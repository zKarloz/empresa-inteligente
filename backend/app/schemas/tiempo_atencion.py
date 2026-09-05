from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class TiempoAtencionCreate(BaseModel):
    cliente_id: int | None = None
    comentario_id: int | None = None

    tiempo_minutos: Decimal = Field(
        gt=0
    )

    operador: str | None = None


class TiempoAtencionResponse(BaseModel):
    id: int
    cliente_id: int | None = None
    comentario_id: int | None = None

    tiempo_minutos: Decimal

    fecha: date | None = None
    operador: str | None = None
    created_at: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )