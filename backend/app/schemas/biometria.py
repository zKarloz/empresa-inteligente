"""Validar la forma de los datos NO demuestra que provengan de una cámara real."""

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, FiniteFloat

Embedding = Annotated[list[FiniteFloat], Field(min_length=1024, max_length=1024)]


class BiometriaRegistro(BaseModel):
    model_config = ConfigDict(extra="forbid")
    password_actual: str = Field(min_length=1, max_length=256)
    embeddings: Annotated[list[Embedding], Field(min_length=5, max_length=5)]


class BiometriaVerificacion(BaseModel):
    model_config = ConfigDict(extra="forbid")
    embedding: Embedding
