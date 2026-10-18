"""Safely add company columns expected by the current ORM to an existing local DB.

This script is idempotent and preserves existing records. Run from backend/ after
configuring .env. It only adds missing nullable columns; it does not drop or alter data.
"""
from sqlalchemy import inspect, text
from app.db.session import engine


def main():
    with engine.begin() as connection:
        inspector = inspect(connection)
        if "companies" not in inspector.get_table_names():
            raise SystemExit(
                "The companies table does not exist. Run 'alembic upgrade head' first."
            )
        existing = {column["name"] for column in inspector.get_columns("companies")}
        statements = {
            "eligibility_cgpa": "ALTER TABLE companies ADD COLUMN eligibility_cgpa DECIMAL(4,2) NULL",
            "positions": "ALTER TABLE companies ADD COLUMN positions INT NULL",
        }
        added = []
        for column, statement in statements.items():
            if column not in existing:
                connection.execute(text(statement))
                added.append(column)
        if added:
            print("Added missing columns:", ", ".join(added))
        else:
            print("Company schema already contains all expected columns.")


if __name__ == "__main__":
    main()
