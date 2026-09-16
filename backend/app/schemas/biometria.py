"""Validar la forma de los datos NO demuestra que provengan de una cámara real."""

from typing import Annotated

from pydantic import BaseModel, Field, FiniteFloat

Embedding = Annotated[list[FiniteFloat], Field(min_length=1024, max_length=1024)]


class BiometriaRegistro(BaseModel):
    embeddings: Annotated[list[Embedding], Field(min_length=5, max_length=5)]


class BiometriaVerificacion(BaseModel):
    embedding: Embedding
