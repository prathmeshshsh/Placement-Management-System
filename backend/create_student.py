"""Create/update a local demo student with a real StudentProfile.

Development helper only. The admin UI is the preferred way to create student records.
"""
from sqlalchemy import select
from app.db.session import get_db
from app.core.security import hash_password
from app.models.identity import User, Role
from app.models.placement import Department, StudentProfile

STUDENT_EMAIL = "student@gmail.com"
STUDENT_NAME = "Demo Student"
STUDENT_PASSWORD = "student@123"
STUDENT_ROLL_NUMBER = "DEMO-STU-001"
STUDENT_PROGRAM = "Computer Science"
STUDENT_GRADUATION_YEAR = 2027
STUDENT_DEPARTMENT_CODE = "CSE"


def main():
    generator = get_db()
    db = next(generator)
    try:
        role = db.scalar(select(Role).where(Role.role_code == "STUDENT"))
        if role is None:
            raise RuntimeError("STUDENT role not found in roles table")
        department = db.scalar(select(Department).where(Department.code == STUDENT_DEPARTMENT_CODE))
        if department is None:
            department = Department(code=STUDENT_DEPARTMENT_CODE, name="Computer Science", is_active=True)
            db.add(department)
            db.flush()

        user = db.scalar(select(User).where(User.email_normalized == STUDENT_EMAIL.lower()))
        if user is None:
            user = User(email_normalized=STUDENT_EMAIL.lower(), display_name=STUDENT_NAME,
                        password_hash=hash_password(STUDENT_PASSWORD), account_status="ACTIVE", roles=[role])
            db.add(user)
            db.flush()
        else:
            user.display_name = STUDENT_NAME
            user.password_hash = hash_password(STUDENT_PASSWORD)
            user.account_status = "ACTIVE"
            if not any(r.role_code == "STUDENT" for r in user.roles):
                user.roles.append(role)

        profile = db.get(StudentProfile, user.id)
        if profile is None:
            existing_roll = db.scalar(select(StudentProfile).where(StudentProfile.roll_number == STUDENT_ROLL_NUMBER))
            if existing_roll and existing_roll.user_id != user.id:
                raise RuntimeError(f"Roll number {STUDENT_ROLL_NUMBER} is already assigned to another student")
            profile = StudentProfile(user_id=user.id, roll_number=STUDENT_ROLL_NUMBER,
                department_id=department.id, program=STUDENT_PROGRAM,
                graduation_year=STUDENT_GRADUATION_YEAR, cgpa=None,
                active_backlogs=0, historical_backlogs=0, profile_status="INCOMPLETE")
            db.add(profile)
        db.commit()
        print("Student account and profile are ready.")
        print(f"Email: {STUDENT_EMAIL}\nRole: STUDENT\nStatus: ACTIVE")
        print("Password is the value configured in STUDENT_PASSWORD.")
    except Exception:
        db.rollback()
        raise
    finally:
        generator.close()


if __name__ == "__main__":
    main()
