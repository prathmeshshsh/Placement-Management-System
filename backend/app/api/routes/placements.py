from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import require_roles
from app.db.session import get_db
from app.models.placement import PlacementDrive, JobPosting, RecruiterCompanyMembership
from app.api.routes._helpers import serialize, create_row, list_rows, get_row, coerce_fields
from sqlalchemy import select
router=APIRouter(prefix="/placements",tags=["placements"])
DRIVE_FIELDS={"name","academic_year","starts_at","ends_at","status"}
JOB_FIELDS={"company_id","drive_id","title","description","openings","package_lpa","min_cgpa","max_active_backlogs","max_historical_backlogs","all_departments_allowed","application_open_at","application_deadline","status","criteria_version"}
@router.get("")
def list_placements(limit:int=50,offset:int=0,db:Session=Depends(get_db)): return list_rows(db,JobPosting,limit,offset)
@router.post("",status_code=201)
def create_placement(body:dict,db:Session=Depends(get_db),_user=Depends(require_roles("ADMIN","HR_RECRUITER"))):
 required=("company_id","title","openings","application_open_at","application_deadline")
 missing=[x for x in required if body.get(x) is None]
 if missing: raise HTTPException(422,"Missing required fields: "+", ".join(missing))
 if not any(r.role_code == "ADMIN" for r in _user.roles):
  membership=db.scalar(select(RecruiterCompanyMembership).where(RecruiterCompanyMembership.recruiter_user_id==_user.id,RecruiterCompanyMembership.company_id==body.get("company_id"),RecruiterCompanyMembership.is_active.is_(True)))
  if not membership: raise HTTPException(403,"You may only create jobs for a company linked to your account")
 return create_row(db,JobPosting,body,JOB_FIELDS,{"status":"DRAFT","criteria_version":1,"all_departments_allowed":True})
@router.patch("/{job_id}")
def update_placement(job_id:UUID,body:dict,db:Session=Depends(get_db),_user=Depends(require_roles("ADMIN","HR_RECRUITER"))):
 obj=get_row(db,JobPosting,job_id)
 if not any(r.role_code == "ADMIN" for r in _user.roles):
  membership=db.scalar(select(RecruiterCompanyMembership).where(RecruiterCompanyMembership.recruiter_user_id==_user.id,RecruiterCompanyMembership.company_id==obj.company_id,RecruiterCompanyMembership.is_active.is_(True)))
  if not membership: raise HTTPException(403,"You may only update jobs for a linked company")
 for k,v in coerce_fields(JobPosting,body,JOB_FIELDS).items(): setattr(obj,k,v)
 obj.criteria_version=(obj.criteria_version or 1)+1;db.commit();db.refresh(obj);return serialize(obj)
@router.delete("/{job_id}",status_code=204)
def close_placement(job_id:UUID,db:Session=Depends(get_db),_user=Depends(require_roles("ADMIN","HR_RECRUITER"))):
 obj=get_row(db,JobPosting,job_id)
 if not any(r.role_code == "ADMIN" for r in _user.roles):
  membership=db.scalar(select(RecruiterCompanyMembership).where(RecruiterCompanyMembership.recruiter_user_id==_user.id,RecruiterCompanyMembership.company_id==obj.company_id,RecruiterCompanyMembership.is_active.is_(True)))
  if not membership: raise HTTPException(403,"You may only close jobs for a linked company")
 obj.status="CLOSED";db.commit()
@router.get("/drives")
def list_drives(limit:int=50,offset:int=0,db:Session=Depends(get_db)): return list_rows(db,PlacementDrive,limit,offset)
@router.post("/drives",status_code=201)
def create_drive(body:dict,db:Session=Depends(get_db),_user=Depends(require_roles("ADMIN"))):
 missing=[x for x in ("name","academic_year","starts_at","ends_at") if body.get(x) is None]
 if missing: raise HTTPException(422,"Missing required fields: "+", ".join(missing))
 return create_row(db,PlacementDrive,body,DRIVE_FIELDS,{"status":"PLANNED"})
