from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AnalisisTextoRequest(BaseModel):
    texto: str = Field(
        min_length=1
    )


class PalabraFrecuente(BaseModel):
    palabra: str
    frecuencia: int


class AnalisisTextoResponse(BaseModel):
    cantidad_palabras: int
    tokens: list[str]
    palabras_frecuentes: list[PalabraFrecuente]


class ClasificacionRequest(BaseModel):
    texto: str = Field(
        min_length=1
    )


class ClasificacionResponse(BaseModel):
    categoria: str
    confianza: float


class AnalisisNLPResponse(BaseModel):
    id: int
    comentario_id: int

    idioma: str
    cantidad_palabras: int

    palabras_limpias: list[str] | None = None
    palabras_frecuentes: list[PalabraFrecuente] | None = None

    categoria_detectada: str | None = None
    confianza: float | None = None

    fecha_analisis: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )