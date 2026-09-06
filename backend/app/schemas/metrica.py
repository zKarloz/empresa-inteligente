from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class EstadisticasResponse(BaseModel):
    cantidad: int
    media: float
    mediana: float
    desviacion_estandar: float
    minimo: float
    maximo: float
    percentil_25: float
    percentil_75: float


class MetricaEstadisticaResponse(BaseModel):
    id: int

    fecha_inicio: date
    fecha_fin: date

    cantidad_registros: int

    media: float | None = None
    mediana: float | None = None
    desviacion_estandar: float | None = None
    minimo: float | None = None
    maximo: float | None = None
    percentil_25: float | None = None
    percentil_75: float | None = None

    created_at: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )