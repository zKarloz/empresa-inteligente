from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    BigInteger,
    Date,
    DateTime,
    Integer,
    Numeric,
    func
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class MetricaEstadistica(Base):
    __tablename__ = "metricas_estadisticas"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True
    )

    fecha_inicio: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    fecha_fin: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    cantidad_registros: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    media: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 4)
    )

    mediana: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 4)
    )

    desviacion_estandar: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 4)
    )

    minimo: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 4)
    )

    maximo: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 4)
    )

    percentil_25: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 4)
    )

    percentil_75: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 4)
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )