from uuid import UUID
from sqlalchemy.dialects.mysql import BINARY
from sqlalchemy.types import TypeDecorator

class UUIDBinary(TypeDecorator[UUID]):
    impl = BINARY(16)
    cache_ok = True
    def process_bind_param(self, value, dialect):
        if value is None: return None
        return value.bytes if isinstance(value, UUID) else UUID(str(value)).bytes
    def process_result_value(self, value, dialect):
        if value is None: return None
        return value if isinstance(value, UUID) else UUID(bytes=value)
