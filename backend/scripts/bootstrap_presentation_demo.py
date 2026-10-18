"""Create/reset local presentation accounts for the Placement Management System.

Development-only helper. Do not run with production settings.
Accounts:
  admin@gmail.com   / admin@123
  student@gmail.com / student@123
  company@gmail.com / company@123
"""
from sqlalchemy import select

from app.core.config import get_settings
from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.identity import Role, User
from app.models.placement import Department, StudentProfile

ACCOUNTS = [
    ("admin@gmail.com", "Demo Administrator", "ADMIN", "admin@123"),
    ("student@gmail.com", "Demo Student", "STUDENT", "student@123"),
    ("company@gmail.com", "Demo Company Recruiter", "HR_RECRUITER", "company@123"),
]


def main():
    if get_settings().app_env.lower() != "development":
        raise SystemExit("Refusing to create demo accounts unless APP_ENV=development.")

    with SessionLocal.begin() as db:
        roles = {
            role.role_code: role
            for role in db.scalars(select(Role)).all()
        }
        for _, _, code, _ in ACCOUNTS:
            if code not in roles:
                raise SystemExit(
                    f"Missing role {code}. Run 'alembic upgrade head' first."
                )

        users = {}
        for email, name, code, password in ACCOUNTS:
            user = db.scalar(select(User).where(User.email_normalized == email))
            if user is None:
                user = User(
                    email_normalized=email,
                    display_name=name,
                    account_status="ACTIVE",
                    password_hash=hash_password(password),
                    roles=[roles[code]],
                )
                db.add(user)
            else:
                user.display_name = name
                user.account_status = "ACTIVE"
                user.password_hash = hash_password(password)
                if not any(role.role_code == code for role in user.roles):
                    user.roles.append(roles[code])
            users[code] = user

        db.flush()
        department = db.scalar(select(Department).where(Department.code == "DEMO"))
        if department is None:
            department = Department(code="DEMO", name="Demo Department", is_active=True)
            db.add(department)
            db.flush()

        student = users["STUDENT"]
        profile = db.get(StudentProfile, student.id)
        if profile is None:
            db.add(
                StudentProfile(
                    user_id=student.id,
                    roll_number="DEMO-001",
                    department_id=department.id,
                    program="Computer Science",
                    graduation_year=2027,
                    cgpa=8.5,
                    active_backlogs=0,
                    historical_backlogs=0,
                    profile_status="COMPLETE",
                )
            )

    print("Presentation accounts are ready (development only):")
    for email, _, _, password in ACCOUNTS:
        print(f"  {email} / {password}")
    print("Change these passwords before using any non-demo environment.")


if __name__ == "__main__":
    main()
