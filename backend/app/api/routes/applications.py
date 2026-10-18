from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.api.deps import require_roles, current_user
from app.db.session import get_db
from app.models.placement import Application, JobPosting, StudentProfile, ApplicationStatusHistory, RecruiterCompanyMembership
from app.models.identity import User
from app.api.routes._helpers import serialize, list_rows, get_row
router=APIRouter(prefix="/applications",tags=["applications"])
@router.get("")
def list_applications(limit:int=50,offset:int=0,db:Session=Depends(get_db),_user=Depends(require_roles("ADMIN","HR_RECRUITER"))):
 if any(r.role_code == "ADMIN" for r in _user.roles):
  return list_rows(db,Application,limit,offset)
 company_ids = select(RecruiterCompanyMembership.company_id).where(RecruiterCompanyMembership.recruiter_user_id == _user.id, RecruiterCompanyMembership.is_active.is_(True))
 job_ids = select(JobPosting.id).where(JobPosting.company_id.in_(company_ids))
 return [serialize(x) for x in db.scalars(select(Application).where(Application.job_posting_id.in_(job_ids)).order_by(Application.applied_at.desc()).limit(min(max(limit,1),100)).offset(max(offset,0))).all()]
@router.post("/apply",status_code=201)
def apply(body:dict,db:Session=Depends(get_db),user:User=Depends(current_user)):
 if not any(r.role_code == "STUDENT" for r in user.roles): raise HTTPException(403,"Student role required to apply")
 job_id=body.get("job_posting_id")
 if not job_id: raise HTTPException(422,"job_posting_id is required")
 student=db.get(StudentProfile,user.id)
 if not student: raise HTTPException(409,"A student profile is required before applying")
 job=db.get(JobPosting,job_id)
 if not job or job.status not in ("OPEN","PUBLISHED"): raise HTTPException(404,"Open job posting not found")
 existing=db.scalar(select(Application).where(Application.student_id==user.id,Application.job_posting_id==job.id))
 if existing: raise HTTPException(409,"Already applied to this job")
 obj=Application(student_id=user.id,job_posting_id=job.id,resume_id=None,current_status="APPLIED",eligibility_passed=True,eligibility_snapshot={"checked":"basic"},criteria_version=job.criteria_version,applied_at=datetime.utcnow())
 db.add(obj);db.flush();db.add(ApplicationStatusHistory(application_id=obj.id,from_status=None,to_status="APPLIED",actor_user_id=user.id,reason="Student applied",changed_at=datetime.utcnow()));db.commit();db.refresh(obj);return serialize(obj)
@router.get("/my")
def my_applications(db:Session=Depends(get_db),user:User=Depends(current_user)):
 if not any(r.role_code == "STUDENT" for r in user.roles): raise HTTPException(403,"Student role required")
 return [serialize(x) for x in db.scalars(select(Application).where(Application.student_id==user.id)).all()]
@router.patch("/{application_id}/status")
def update_status(application_id:UUID,body:dict,db:Session=Depends(get_db),user:User=Depends(require_roles("ADMIN","HR_RECRUITER"))):
 status=body.get("status") or body.get("current_status")
 if status not in {"APPLIED","UNDER_REVIEW","SHORTLISTED","REJECTED","SELECTED","WITHDRAWN","OFFERED"}: raise HTTPException(422,"Unsupported application status")
 obj=get_row(db,Application,application_id)
 if not any(r.role_code == "ADMIN" for r in user.roles):
  job=db.get(JobPosting,obj.job_posting_id)
  membership=db.scalar(select(RecruiterCompanyMembership).where(RecruiterCompanyMembership.recruiter_user_id==user.id,RecruiterCompanyMembership.company_id==job.company_id,RecruiterCompanyMembership.is_active.is_(True))) if job else None
  if not membership: raise HTTPException(403,"You cannot update applications for another company")
 old=obj.current_status;obj.current_status=status
 db.add(ApplicationStatusHistory(application_id=obj.id,from_status=old,to_status=status,actor_user_id=user.id,reason=body.get("reason"),changed_at=datetime.utcnow()));db.commit();db.refresh(obj);return serialize(obj)
