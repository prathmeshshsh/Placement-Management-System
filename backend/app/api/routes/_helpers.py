from datetime import date, datetime
from decimal import Decimal
from uuid import UUID
from fastapi import HTTPException
from sqlalchemy import select, DateTime, Numeric
from app.db.types import UUIDBinary

def serialize(obj):
    result = {}
    for col in obj.__table__.columns:
        value = getattr(obj, col.name)
        if isinstance(value, (UUID, datetime, date)): value = str(value)
        elif isinstance(value, Decimal): value = float(value)
        elif isinstance(value, bytes): value = value.hex()
        result[col.name] = value
    return result

def coerce_fields(model, payload, allowed):
    fields = {}
    for key, value in payload.items():
        if key not in allowed or key not in model.__table__.columns or key in {c.name for c in model.__table__.primary_key} or value is None:
            continue
        column = model.__table__.columns[key]
        if isinstance(column.type, DateTime) and isinstance(value, str):
            value = datetime.fromisoformat(value.replace("Z", "+00:00"))
            if value.tzinfo is not None: value = value.astimezone().replace(tzinfo=None)
        elif isinstance(column.type, Numeric):
            value = Decimal(str(value))
        elif isinstance(column.type, UUIDBinary) and not isinstance(value, UUID):
            value = UUID(str(value))
        fields[key] = value
    return fields

def create_row(db, model, payload, allowed, defaults=None):
    fields = coerce_fields(model, payload, allowed)
    for key, value in (defaults or {}).items():
        fields.setdefault(key, value)
    try:
        obj = model(**fields); db.add(obj); db.commit(); db.refresh(obj); return serialize(obj)
    except Exception:
        db.rollback(); raise

def list_rows(db, model, limit=50, offset=0):
    limit = min(max(limit, 1), 100); offset = max(offset, 0)
    return [serialize(x) for x in db.scalars(select(model).limit(limit).offset(offset)).all()]

def get_row(db, model, key):
    obj=db.get(model,key)
    if obj is None: raise HTTPException(404, "Resource not found")
    return obj
