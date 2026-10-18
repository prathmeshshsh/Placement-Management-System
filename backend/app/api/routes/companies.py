from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import current_user, require_roles
from app.core.security import hash_password
from app.db.session import get_db
from app.models.identity import Role, User
from app.models.placement import Company, RecruiterCompanyMembership
from app.api.routes._helpers import serialize, create_row, list_rows, get_row, coerce_fields

router = APIRouter(prefix="/companies", tags=["companies"])
FIELDS = {"legal_name", "display_name", "industry", "website", "package_lpa", "eligibility_cgpa", "positions", "status"}


@router.get("/mine")
def my_company(db: Session = Depends(get_db), user: User = Depends(current_user)):
    memberships = db.scalars(select(RecruiterCompanyMembership).where(
        RecruiterCompanyMembership.recruiter_user_id == user.id,
        RecruiterCompanyMembership.is_active.is_(True),
    )).all()
    if not memberships:
        raise HTTPException(404, "No active company is linked to this recruiter account")
    if len(memberships) > 1:
        return [serialize(get_row(db, Company, m.company_id)) for m in memberships]
    return serialize(get_row(db, Company, memberships[0].company_id))


@router.get("")
def list_companies(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    return list_rows(db, Company, limit, offset)


@router.post("", status_code=201)
def create_company(body: dict, db: Session = Depends(get_db), admin: User = Depends(require_roles("ADMIN"))):
    """Create a company and its recruiter account in one transaction."""
    legal_name = str(body.get("legal_name") or body.get("display_name") or "").strip()
    display_name = str(body.get("display_name") or legal_name).strip()
    recruiter_email = str(body.get("recruiter_email") or "").strip().lower()
    recruiter_name = str(body.get("recruiter_name") or "").strip()
    recruiter_password = str(body.get("recruiter_password") or "")

    if not legal_name or not display_name:
        raise HTTPException(422, "Company name is required")
    if not recruiter_email or not recruiter_name:
        raise HTTPException(422, "Recruiter name and email are required")
    if len(recruiter_password) < 8 or len(recruiter_password) > 72:
        raise HTTPException(422, "Recruiter password must be 8 to 72 characters")
    if db.scalar(select(User).where(User.email_normalized == recruiter_email)):
        raise HTTPException(409, "Recruiter email already exists. Use a different email.")
    recruiter_role = db.scalar(select(Role).where(Role.role_code == "HR_RECRUITER"))
    if recruiter_role is None:
        raise HTTPException(500, "HR_RECRUITER role is not configured")

    try:
        company = Company(**coerce_fields(Company, {
            **body,
            "legal_name": legal_name,
            "display_name": display_name,
            "status": body.get("status") or "ACTIVE",
        }, FIELDS))
        db.add(company)
        db.flush()
        recruiter = User(
            email_normalized=recruiter_email,
            display_name=recruiter_name,
            password_hash=hash_password(recruiter_password),
            account_status="ACTIVE",
            created_by_user_id=admin.id,
            updated_by_user_id=admin.id,
            roles=[recruiter_role],
        )
        db.add(recruiter)
        db.flush()
        db.add(RecruiterCompanyMembership(
            recruiter_user_id=recruiter.id,
            company_id=company.id,
            membership_role="OWNER",
            is_active=True,
        ))
        db.commit()
        db.refresh(company)
        result = serialize(company)
        result["recruiter_email"] = recruiter_email
        result["recruiter_name"] = recruiter_name
        return result
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Company or recruiter conflicts with an existing database record")
    except Exception:
        db.rollback()
        raise


@router.patch("/{company_id}")
def update_company(company_id: UUID, body: dict, db: Session = Depends(get_db), user: User = Depends(require_roles("ADMIN", "HR_RECRUITER"))):
    obj = get_row(db, Company, company_id)
    if not any(role.role_code == "ADMIN" for role in user.roles):
        membership = db.get(RecruiterCompanyMembership, (user.id, company_id))
        if membership is None or not membership.is_active:
            raise HTTPException(403, "You can only edit a company linked to your recruiter account")
    fields = coerce_fields(Company, body, FIELDS)
    for key, value in fields.items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return serialize(obj)


@router.delete("/{company_id}", status_code=204)
def deactivate_company(company_id: UUID, db: Session = Depends(get_db), _user: User = Depends(require_roles("ADMIN"))):
    obj = get_row(db, Company, company_id)
    obj.status = "INACTIVE"
    db.commit()
