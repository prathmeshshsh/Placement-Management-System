"""Repair company columns missing from older local MySQL databases.

Revision ID: 0002_repair_company_columns
Revises: 0001_bootstrap
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = "0002_repair_company_columns"
down_revision = "0001_bootstrap"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = inspect(bind)
    if "companies" not in inspector.get_table_names():
        return
    existing = {column["name"] for column in inspector.get_columns("companies")}
    if "eligibility_cgpa" not in existing:
        op.add_column("companies", sa.Column("eligibility_cgpa", sa.Numeric(4, 2), nullable=True))
    if "positions" not in existing:
        op.add_column("companies", sa.Column("positions", sa.Integer(), nullable=True))


def downgrade():
    bind = op.get_bind()
    inspector = inspect(bind)
    if "companies" not in inspector.get_table_names():
        return
    existing = {column["name"] for column in inspector.get_columns("companies")}
    # Do not drop columns automatically: they may contain data added after upgrade.
