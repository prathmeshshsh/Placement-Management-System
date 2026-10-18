from uuid import UUID
from fastapi import APIRouter,Depends,Response
from sqlalchemy.orm import Session
from app.api.deps import require_roles
from app.db.session import get_db
from app.models.placement import Department
from app.schemas.department import DepartmentCreate,DepartmentOut
from app.services.crud import CRUDService
router=APIRouter(prefix="/departments",tags=["departments"]);service=CRUDService(Department)
@router.get("",response_model=list[DepartmentOut])
def list_departments(limit:int=50,offset:int=0,db:Session=Depends(get_db)):return service.list(db,limit,offset)
@router.post("",response_model=DepartmentOut,status_code=201)
def create_department(body:DepartmentCreate,db:Session=Depends(get_db),_user=Depends(require_roles("ADMIN"))):
 obj=service.create(db,code=body.code.strip().upper(),name=body.name.strip(),is_active=True);db.commit();db.refresh(obj);return obj
@router.get("/{department_id}",response_model=DepartmentOut)
def get_department(department_id:UUID,db:Session=Depends(get_db)):return service.get(db,department_id)
@router.delete("/{department_id}",status_code=204)
def deactivate_department(department_id:UUID,db:Session=Depends(get_db),_user=Depends(require_roles("ADMIN"))):
 obj=service.get(db,department_id);obj.is_active=False;db.commit();return Response(status_code=204)
