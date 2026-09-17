from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, FiniteFloat, model_validator


class EstadisticasResponse(BaseModel):
    cantidad: int
    media: float
    mediana: float
    desviacion_estandar: float | None
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
    model_config = ConfigDict(extra="forbid")
    x_conocidos: list[FiniteFloat] = Field(min_length=2, max_length=1000)
    y_conocidos: list[FiniteFloat] = Field(min_length=2, max_length=1000)
    x_estimar: list[FiniteFloat] = Field(min_length=1, max_length=1000)

    @model_validator(mode="after")
    def comprobar_puntos(self):
        if len(self.x_conocidos) != len(self.y_conocidos):
            raise ValueError("X e Y deben tener la misma cantidad de puntos")
        if len(set(self.x_conocidos)) != len(self.x_conocidos):
            raise ValueError("Los X conocidos no pueden repetirse")
        if len(set(self.x_estimar)) != len(self.x_estimar):
            raise ValueError("Los X a estimar no pueden repetirse")
        if any(x < min(self.x_conocidos) or x > max(self.x_conocidos) for x in self.x_estimar):
            raise ValueError("Los puntos a estimar deben estar dentro del intervalo conocido")
        return self


class ValorInterpolado(BaseModel):
    x: float
    valor_estimado: float


class InterpolacionResponse(BaseModel):
    resultados: list[ValorInterpolado]


class OptimizacionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True, validate_default=True)
    nombre: str = Field(default="Optimización de recursos", min_length=1, max_length=150)
    descripcion: str | None = Field(default=None, max_length=2000)

    recurso_a_inicial: FiniteFloat = Field(default=2, ge=0, le=10)
    recurso_b_inicial: FiniteFloat = Field(default=4, ge=0, le=10)

    capacidad_minima: FiniteFloat = Field(default=40, gt=0, le=150)


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