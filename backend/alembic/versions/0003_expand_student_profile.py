"""Add persistent contact and extended student profile fields.

Revision ID: 0003_expand_student_profile
Revises: 0002_repair_company_columns
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = "0003_expand_student_profile"
down_revision = "0002_repair_company_columns"
branch_labels = None
depends_on = None

def upgrade():
    bind = op.get_bind()
    inspector = inspect(bind)
    if "student_profiles" not in inspector.get_table_names():
        return
    existing = {c["name"] for c in inspector.get_columns("student_profiles")}
    columns = [
        sa.Column("phone", sa.String(32), nullable=True),
        sa.Column("semester", sa.Integer(), nullable=True),
        sa.Column("tenth_percentage", sa.Numeric(5, 2), nullable=True),
        sa.Column("twelfth_percentage", sa.Numeric(5, 2), nullable=True),
        sa.Column("linkedin_url", sa.String(512), nullable=True),
        sa.Column("github_url", sa.String(512), nullable=True),
        sa.Column("portfolio_url", sa.String(512), nullable=True),
        sa.Column("skills", sa.JSON(), nullable=True),
        sa.Column("projects", sa.JSON(), nullable=True),
        sa.Column("certifications", sa.JSON(), nullable=True),
    ]
    for column in columns:
        if column.name not in existing:
            op.add_column("student_profiles", column)

def downgrade():
    # Intentionally preserve data during downgrade.
    pass
