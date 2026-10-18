from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.api.deps import require_roles, current_user
from app.db.session import get_db
from app.models.placement import Interview, Application, JobPosting, RecruiterCompanyMembership
from app.models.identity import User
from app.api.routes._helpers import serialize, list_rows, coerce_fields
router=APIRouter(prefix="/interviews",tags=["interviews"])
@router.get("")
def list_interviews(limit:int=50,offset:int=0,db:Session=Depends(get_db),_user=Depends(require_roles("ADMIN","HR_RECRUITER"))):
 if any(r.role_code == "ADMIN" for r in _user.roles): return list_rows(db,Interview,limit,offset)
 company_ids=select(RecruiterCompanyMembership.company_id).where(RecruiterCompanyMembership.recruiter_user_id==_user.id,RecruiterCompanyMembership.is_active.is_(True))
 app_ids=select(Application.id).join(JobPosting,JobPosting.id==Application.job_posting_id).where(JobPosting.company_id.in_(company_ids))
 return [serialize(x) for x in db.scalars(select(Interview).where(Interview.application_id.in_(app_ids)).limit(min(max(limit,1),100)).offset(max(offset,0))).all()]
@router.get("/my")
def my_interviews(db:Session=Depends(get_db),user:User=Depends(current_user)):
 app_ids=select(Application.id).where(Application.student_id==user.id)
 return [serialize(x) for x in db.scalars(select(Interview).where(Interview.application_id.in_(app_ids))).all()]
@router.post("",status_code=201)
def create_interview(body:dict,db:Session=Depends(get_db),user:User=Depends(require_roles("ADMIN","HR_RECRUITER"))):
 required=("application_id","round_number","starts_at","ends_at")
 missing=[x for x in required if body.get(x) is None]
 if missing: raise HTTPException(422,"Missing required fields: "+", ".join(missing))
 if datetime.fromisoformat(str(body["ends_at"])) <= datetime.fromisoformat(str(body["starts_at"])): raise HTTPException(422,"ends_at must be after starts_at")
 app=db.get(Application,body["application_id"])
 if not app: raise HTTPException(404,"Application not found")
 if not any(r.role_code == "ADMIN" for r in user.roles):
  job=db.get(JobPosting,app.job_posting_id)
  membership=db.scalar(select(RecruiterCompanyMembership).where(RecruiterCompanyMembership.recruiter_user_id==user.id,RecruiterCompanyMembership.company_id==job.company_id,RecruiterCompanyMembership.is_active.is_(True))) if job else None
  if not membership: raise HTTPException(403,"You cannot schedule interviews for another company")
 fields=coerce_fields(Interview,body,{"application_id","slot_id","round_number","starts_at","ends_at"})
 obj=Interview(**fields,attempt_number=1,status="SCHEDULED");db.add(obj);db.commit();db.refresh(obj);return serialize(obj)
