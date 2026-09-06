from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    BigInteger,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    func
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class AnalisisNLP(Base):
    __tablename__ = "analisis_nlp"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True
    )

    comentario_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey(
            "comentarios.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    idioma: Mapped[str] = mapped_column(
        String(20),
        default="es"
    )

    cantidad_palabras: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    palabras_limpias: Mapped[list | None] = mapped_column(
        JSONB,
        nullable=True
    )

    palabras_frecuentes: Mapped[list | None] = mapped_column(
        JSONB,
        nullable=True
    )

    categoria_detectada: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    confianza: Mapped[Decimal | None] = mapped_column(
        Numeric(5, 4),
        nullable=True
    )

    fecha_analisis: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )