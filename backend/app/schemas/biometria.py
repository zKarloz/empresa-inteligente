from pydantic import BaseModel


class BiometriaRegistro(BaseModel):
    usuario_email: str
    embeddings: list[list[float]]


class BiometriaRegistroResponse(BaseModel):
    id: int
    usuario_email: str
    cantidad_muestras: int
    registrado: bool
    mensaje: str


class BiometriaEstadoResponse(BaseModel):
    usuario_email: str
    registrado: bool
    cantidad_muestras: int
    activo: bool


# =========================================================
# VERIFICACIÓN
# =========================================================

class BiometriaVerificacion(BaseModel):
    usuario_email: str
    embedding: list[float]


class BiometriaVerificacionResponse(BaseModel):
    verificado: bool
    usuario_email: str
    similitud: float
    muestra_coincidente: int | None
    mensaje: str