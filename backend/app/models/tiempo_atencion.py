from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    BigInteger,
    Date,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    func
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base

# Se usó server_default=func.current_date() y server_default=func.now(),
# porque si no se proporciona la fecha, PostgreSQL/Supabase establecerá automáticamente la fecha actual como valor predeterminado.

class TiempoAtencion(Base):
    __tablename__ = "tiempos_atencion"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True
    )

    cliente_id: Mapped[int | None] = mapped_column(
        BigInteger,
        ForeignKey(
            "clientes.id",
            ondelete="SET NULL"
        ),
        nullable=True
    )

    comentario_id: Mapped[int | None] = mapped_column(
        BigInteger,
        ForeignKey(
            "comentarios.id",
            ondelete="SET NULL"
        ),
        nullable=True
    )

    tiempo_minutos: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )

    fecha: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        server_default=func.current_date()
    )

    operador: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )