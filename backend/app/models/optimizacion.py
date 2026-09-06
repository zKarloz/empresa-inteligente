from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    BigInteger,
    DateTime,
    Numeric,
    String,
    Text,
    func
)

from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Optimizacion(Base):
    __tablename__ = "optimizaciones"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True
    )

    nombre: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    descripcion: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    parametros_entrada: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False
    )

    resultado: Mapped[dict | None] = mapped_column(
        JSONB,
        nullable=True
    )

    costo_inicial: Mapped[Decimal | None] = mapped_column(
        Numeric(14, 4)
    )

    costo_optimizado: Mapped[Decimal | None] = mapped_column(
        Numeric(14, 4)
    )

    estado: Mapped[str] = mapped_column(
        String(30),
        default="pendiente"
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )