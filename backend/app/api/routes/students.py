
from uuid import UUID
from pathlib import Path
from datetime import datetime
import hashlib
import re

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import current_user, require_roles
from app.core.security import hash_password
from app.db.session import get_db
from app.models.identity import Role, User
from app.models.placement import Department, StudentProfile, StudentResume
from app.schemas.student import StudentCreate, StudentOut

router = APIRouter(prefix="/students", tags=["students"])


def _student_out(user: User, profile: StudentProfile) -> StudentOut:
    return StudentOut(
        user_id=user.id,
        email=user.email_normalized,
        display_name=user.display_name,
        roll_number=profile.roll_number,
        department_id=profile.department_id,
        program=profile.program,
        graduation_year=profile.graduation_year,
        cgpa=profile.cgpa,
        active_backlogs=profile.active_backlogs,
        historical_backlogs=profile.historical_backlogs,
        profile_status=profile.profile_status,
        phone=profile.phone, semester=profile.semester,
        tenth_percentage=profile.tenth_percentage, twelfth_percentage=profile.twelfth_percentage,
        linkedin_url=profile.linkedin_url, github_url=profile.github_url, portfolio_url=profile.portfolio_url,
        skills=profile.skills or [], projects=profile.projects or [], certifications=profile.certifications or [],
    )


@router.post("", response_model=StudentOut, status_code=status.HTTP_201_CREATED)
def create_student(
    body: StudentCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_roles("ADMIN")),
):
    email = str(body.email).strip().lower()
    roll_number = body.roll_number.strip()

    if not roll_number:
        raise HTTPException(
            status_code=422,
            detail="Roll number is required",
        )

    if not body.initial_password:
        raise HTTPException(
            status_code=422,
            detail="An initial password is required to create a login-ready student",
        )

    department = db.get(Department, body.department_id)
    if department is None or not department.is_active:
        raise HTTPException(
            status_code=422,
            detail="Department not found or inactive",
        )

    existing_user = db.scalar(
        select(User).where(User.email_normalized == email)
    )
    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email already exists. Use a different email address.",
        )

    existing_student = db.scalar(
        select(StudentProfile).where(
            StudentProfile.roll_number == roll_number
        )
    )
    if existing_student:
        raise HTTPException(
            status_code=409,
            detail="Roll number already exists. Use a different roll number.",
        )

    student_role = db.scalar(
        select(Role).where(Role.role_code == "STUDENT")
    )
    if student_role is None:
        raise HTTPException(
            status_code=500,
            detail="STUDENT role is not configured",
        )

    try:
        user = User(
            email_normalized=email,
            display_name=body.display_name.strip(),
            account_status="ACTIVE",
            password_hash=hash_password(body.initial_password),
            created_by_user_id=_admin.id,
            updated_by_user_id=_admin.id,
        )
        user.roles = [student_role]

        db.add(user)
        db.flush()

        profile = StudentProfile(
            user_id=user.id,
            roll_number=roll_number,
            department_id=body.department_id,
            program=body.program.strip(),
            graduation_year=body.graduation_year,
            cgpa=body.cgpa,
            active_backlogs=body.active_backlogs,
            historical_backlogs=body.historical_backlogs,
            profile_status="INCOMPLETE",
            phone=body.phone,
        )

        db.add(profile)
        db.commit()
        db.refresh(user)
        db.refresh(profile)

        return _student_out(user, profile)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Student conflicts with an existing database record",
        )


@router.get("/me", response_model=StudentOut)
def get_my_student_profile(
    db: Session = Depends(get_db),
    user: User = Depends(current_user),
):
    if not any(role.role_code == "STUDENT" for role in user.roles):
        raise HTTPException(status_code=403, detail="Student role required")

    profile = db.get(StudentProfile, user.id)
    if profile is None:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found",
        )

    return _student_out(user, profile)


@router.patch("/me", response_model=StudentOut)
def update_my_student_profile(
    body: dict,
    db: Session = Depends(get_db),
    user: User = Depends(current_user),
):
    if not any(role.role_code == "STUDENT" for role in user.roles):
        raise HTTPException(status_code=403, detail="Student role required")
    profile = db.get(StudentProfile, user.id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Student profile not found")

    if "email" in body:
        email = str(body["email"]).strip().lower()
        existing = db.scalar(select(User).where(User.email_normalized == email, User.id != user.id))
        if existing:
            raise HTTPException(status_code=409, detail="Email already exists")
        user.email_normalized = email
    if "roll_number" in body:
        roll = str(body["roll_number"]).strip()
        duplicate = db.scalar(select(StudentProfile).where(StudentProfile.roll_number == roll, StudentProfile.user_id != user.id))
        if duplicate:
            raise HTTPException(status_code=409, detail="Roll number already exists")
        profile.roll_number = roll
    if "department_id" in body:
        department = db.get(Department, UUID(str(body["department_id"])))
        if department is None or not department.is_active:
            raise HTTPException(status_code=422, detail="Department not found or inactive")
        profile.department_id = department.id
    if "display_name" in body:
        user.display_name = str(body["display_name"]).strip()

    allowed = {
        "program", "graduation_year", "cgpa", "active_backlogs", "historical_backlogs",
        "phone", "semester", "tenth_percentage", "twelfth_percentage",
        "linkedin_url", "github_url", "portfolio_url", "skills", "projects", "certifications",
    }
    for key in allowed:
        if key in body:
            setattr(profile, key, body[key])
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Profile conflicts with an existing record")
    db.refresh(profile)
    db.refresh(user)
    return _student_out(user, profile)


@router.post("/me/resume", status_code=201)
def upload_my_resume(file: UploadFile = File(...), db: Session = Depends(get_db), user: User = Depends(current_user)):
    if not any(role.role_code == "STUDENT" for role in user.roles):
        raise HTTPException(status_code=403, detail="Student role required")
    if not file.filename or Path(file.filename).suffix.lower() != ".pdf" or file.content_type not in {"application/pdf", "application/octet-stream"}:
        raise HTTPException(status_code=422, detail="Please upload a PDF file")
    data = file.file.read(5 * 1024 * 1024 + 1)
    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Resume must be 5 MB or smaller")
    if not data.startswith(b"%PDF-"):
        raise HTTPException(status_code=422, detail="Uploaded file is not a valid PDF")
    folder = Path(__file__).resolve().parents[3] / "uploads" / "resumes"
    folder.mkdir(parents=True, exist_ok=True)
    filename = f"{user.id}_{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}.pdf"
    target = folder / filename
    target.write_bytes(data)
    db.query(StudentResume).filter(StudentResume.student_id == user.id).update({"is_current": False})
    resume = StudentResume(student_id=user.id, object_key=str(target), original_filename=Path(file.filename).name[:255], content_type="application/pdf", byte_size=len(data), checksum_sha256=hashlib.sha256(data).digest(), is_current=True, uploaded_at=datetime.utcnow())
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return {"id": str(resume.id), "filename": resume.original_filename, "byte_size": resume.byte_size, "uploaded_at": resume.uploaded_at.isoformat()}


@router.get("", response_model=list[StudentOut])
def list_students(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_roles("ADMIN", "HR_RECRUITER")),
):
    limit = min(max(limit, 1), 100)
    offset = max(offset, 0)

    query = (
        select(StudentProfile, User)
        .join(User, User.id == StudentProfile.user_id)
        .where(User.account_status == "ACTIVE")
        .order_by(StudentProfile.created_at.desc())
    )

    # Recruiters must only see students whose accounts are active.
    # The active-account filter above also applies to admins so that
    # deactivated students do not reappear in the admin list.
    if (
        any(role.role_code == "HR_RECRUITER" for role in _admin.roles)
        and not any(role.role_code == "ADMIN" for role in _admin.roles)
    ):
        query = query.where(User.account_status == "ACTIVE")

    rows = db.execute(query.limit(limit).offset(offset)).all()

    return [
        _student_out(user, profile)
        for profile, user in rows
    ]


@router.patch("/{student_id}")
def update_student(
    student_id: UUID,
    body: dict,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_roles("ADMIN")),
):
    profile = db.get(StudentProfile, student_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Student not found")

    user = db.get(User, student_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Student account not found")

    if user.account_status != "ACTIVE":
        raise HTTPException(
            status_code=409,
            detail="Cannot update a deactivated student account",
        )

    for key in (
        "roll_number",
        "department_id",
        "program",
        "graduation_year",
        "cgpa",
        "active_backlogs",
        "historical_backlogs",
        "profile_status",
        "phone", "semester", "tenth_percentage", "twelfth_percentage",
        "linkedin_url", "github_url", "portfolio_url", "skills", "projects", "certifications",
    ):
        if key in body:
            setattr(profile, key, body[key])

    if "display_name" in body:
        user.display_name = str(body["display_name"]).strip()

    db.commit()
    db.refresh(profile)
    db.refresh(user)

    return _student_out(user, profile)


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_student(
    student_id: UUID,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_roles("ADMIN")),
):
    user = db.get(User, student_id)

    if user is None:
        raise HTTPException(status_code=404, detail="Student not found")

    profile = db.get(StudentProfile, student_id)
    if profile is None:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found",
        )

    if not any(role.role_code == "STUDENT" for role in user.roles):
        raise HTTPException(
            status_code=409,
            detail="This user does not have a student role",
        )

    user.account_status = "DISABLED"
    user.updated_by_user_id = _admin.id

    db.commit()
    return None
