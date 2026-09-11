from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    ForeignKey,
    String,
    Text,
    func
)

from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Comentario(Base):
    __tablename__ = "comentarios"

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

    # CAMBIO DE TAREA 04
    nombre_cliente: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    apellido_cliente: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    empresa_cliente: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True
    )

    telefono_cliente: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True
    )

    correo_cliente: Mapped[str | None] = mapped_column(
        String(254),
        nullable=True
    )

    contenido: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    canal: Mapped[str] = mapped_column(
        String(30),
        default="web"
    )

    estado: Mapped[str] = mapped_column(
        String(30),
        default="pendiente"
    )

    categoria: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    fecha: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    procesado: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )