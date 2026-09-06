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

class InterpolacionRequest(BaseModel):
    x_conocidos: list[float]
    y_conocidos: list[float]
    x_estimar: list[float]


class ValorInterpolado(BaseModel):
    x: float
    valor_estimado: float


class InterpolacionResponse(BaseModel):
    resultados: list[ValorInterpolado]


class OptimizacionRequest(BaseModel):
    nombre: str = "Optimización de recursos"
    descripcion: str | None = None

    recurso_a_inicial: float = 2
    recurso_b_inicial: float = 4

    capacidad_minima: float = 40


class OptimizacionResponse(BaseModel):
    id: int
    nombre: str
    descripcion: str | None = None

    parametros_entrada: dict
    resultado: dict | None = None

    costo_inicial: float | None = None
    costo_optimizado: float | None = None

    estado: str

    created_at: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )