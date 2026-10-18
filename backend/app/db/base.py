from datetime import datetime
from uuid import UUID
from sqlalchemy import DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from app.db.types import UUIDBinary
class Base(DeclarativeBase): pass
class IdMixin:
    id: Mapped[UUID] = mapped_column(UUIDBinary(), primary_key=True, default=__import__("uuid").uuid4)
class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
