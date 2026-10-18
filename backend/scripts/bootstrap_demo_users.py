"""Create local-only active identities used by the frontend's hardcoded demo login.

Only use with APP_ENV=development. These accounts intentionally have no password;
the X-Demo-Role header is accepted only in development mode. Never deploy this mode.
"""
from sqlalchemy import select
from app.core.config import get_settings
from app.db.session import SessionLocal
from app.models.identity import Role, User
from app.models.placement import Department, StudentProfile

settings=get_settings()
if settings.app_env.lower() != "development":
    raise SystemExit("Refusing to seed demo users unless APP_ENV=development")
accounts=[("demo-admin@localhost.invalid","Demo Administrator","ADMIN"),("demo-student@localhost.invalid","Demo Student","STUDENT"),("demo-company@localhost.invalid","Demo Recruiter","HR_RECRUITER")]
with SessionLocal() as db:
    for email,name,code in accounts:
        role=db.scalar(select(Role).where(Role.role_code==code))
        if not role: raise SystemExit(f"Missing role {code}; run alembic upgrade head first")
        user=db.scalar(select(User).where(User.email_normalized==email))
        if not user:
            user=User(email_normalized=email,display_name=name,account_status="ACTIVE",password_hash=None,roles=[role])
            db.add(user)
        else:
            user.account_status="ACTIVE"
            if role not in user.roles: user.roles.append(role)
    db.flush()
    student=db.scalar(select(User).where(User.email_normalized=="demo-student@localhost.invalid"))
    department=db.scalar(select(Department).where(Department.code=="DEMO"))
    if not department:
        department=Department(code="DEMO",name="Demo Department",is_active=True);db.add(department);db.flush()
    profile=db.get(StudentProfile,student.id) if student else None
    if student and not profile:
        db.add(StudentProfile(user_id=student.id,roll_number="DEMO-001",department_id=department.id,program="Computer Science",graduation_year=2026,active_backlogs=0,historical_backlogs=0,profile_status="COMPLETE"))
    db.commit()
print("Development demo identities and student profile are ready. Do not use APP_ENV=development in production.")
