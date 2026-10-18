
from fastapi import APIRouter

from app.api.routes import (
    auth,
    admin_users,
    departments,
    students,
    companies,
    placements,
    applications,
    interviews,
)

router = APIRouter(prefix="/api/v1")

route_modules = (
    auth,
    admin_users,
    departments,
    students,
    companies,
    placements,
    applications,
    interviews,
)

for module in route_modules:
    router.include_router(module.router)
