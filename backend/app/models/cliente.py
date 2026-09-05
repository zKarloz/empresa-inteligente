from datetime import datetime

from sqlalchemy import BigInteger, Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base

# Le dice a SQLAlchemy que la tabla clientes que ya existe en Supabase tiene esta estructura

class Cliente(Base):
    __tablename__ = "clientes"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True
    )

    nombre: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    email: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True
    )

    telefono: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    empresa: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True
    )

    activo: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )

    created_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )

    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )