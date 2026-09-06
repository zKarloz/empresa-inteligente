from datetime import date

from pydantic import BaseModel


class CategoriaNLP(BaseModel):
    categoria: str
    cantidad: int
    porcentaje: float


class PalabraFrecuenteDashboard(BaseModel):
    palabra: str
    frecuencia: int


class TiempoAtencionDashboard(BaseModel):
    fecha: date
    promedio: float
    cantidad: int


class DashboardResponse(BaseModel):
    clientes: int
    comentarios: int
    promedio_atencion: float
    porcentaje_procesados: float

    categorias_nlp: list[CategoriaNLP]
    palabras_frecuentes: list[PalabraFrecuenteDashboard]
    tiempos_atencion: list[TiempoAtencionDashboard]