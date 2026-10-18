from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Table,
    Column,
    BINARY,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, IdMixin, TimestampMixin
from app.db.types import UUIDBinary


user_roles = Table(
    "user_roles",
    Base.metadata,
    Column(
        "user_id",
        UUIDBinary(),
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "role_id",
        UUIDBinary(),
        ForeignKey("roles.id", ondelete="RESTRICT"),
        primary_key=True,
    ),
    Column(
        "is_active",
        Boolean,
        nullable=False,
        server_default="1",
    ),
    Column(
        "granted_by_user_id",
        UUIDBinary(),
        ForeignKey("users.id", ondelete="SET NULL"),
    ),
    Column(
        "granted_at",
        DateTime,
        nullable=False,
        server_default=func.now(),
    ),
)


class Role(Base, IdMixin):
    __tablename__ = "roles"

    role_code: Mapped[str] = mapped_column(
        String(40),
        unique=True,
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
    )


class User(Base, IdMixin, TimestampMixin):
    __tablename__ = "users"

    email_normalized: Mapped[str] = mapped_column(
        String(254),
        unique=True,
        index=True,
        nullable=False,
    )

    password_hash: Mapped[str | None] = mapped_column(
        String(255)
    )

    display_name: Mapped[str] = mapped_column(
        String(160),
        nullable=False,
    )

    account_status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="INVITED",
    )

    last_login_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    created_by_user_id: Mapped[UUID | None] = mapped_column(
        UUIDBinary(),
        ForeignKey("users.id", ondelete="SET NULL"),
    )

    updated_by_user_id: Mapped[UUID | None] = mapped_column(
        UUIDBinary(),
        ForeignKey("users.id", ondelete="SET NULL"),
    )

    roles: Mapped[list["Role"]] = relationship(
        secondary=user_roles,
        primaryjoin=lambda: User.id == user_roles.c.user_id,
        secondaryjoin=lambda: Role.id == user_roles.c.role_id,
        foreign_keys=[
            user_roles.c.user_id,
            user_roles.c.role_id,
        ],
        lazy="selectin",
    )


class RefreshSession(Base, IdMixin, TimestampMixin):
    __tablename__ = "refresh_sessions"

    user_id: Mapped[UUID] = mapped_column(
        UUIDBinary(),
        ForeignKey("users.id"),
        index=True,
    )

    token_hash: Mapped[bytes] = mapped_column(
        BINARY(32),
        unique=True,
        nullable=False,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    revoked_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    replaced_by_session_id: Mapped[UUID | None] = mapped_column(
        UUIDBinary(),
        ForeignKey("refresh_sessions.id"),
    )

    user_agent: Mapped[str | None] = mapped_column(
        String(512)
    )

    ip_address: Mapped[str | None] = mapped_column(
        String(45)
    )


class UserInvitation(Base, IdMixin):
    __tablename__ = "user_invitations"

    user_id: Mapped[UUID] = mapped_column(
        UUIDBinary(),
        ForeignKey("users.id"),
        index=True,
    )

    token_hash: Mapped[bytes] = mapped_column(
        BINARY(32),
        unique=True,
        nullable=False,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    redeemed_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    created_by_user_id: Mapped[UUID | None] = mapped_column(
        UUIDBinary(),
        ForeignKey("users.id"),
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
    )