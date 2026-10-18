

import os

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import get_db
from app.models.identity import Role, User
from app.models.placement import Company, RecruiterCompanyMembership


RECRUITER_EMAIL = os.getenv(
    "RECRUITER_EMAIL", "company@gmail.com"
).strip().lower()

RECRUITER_NAME = os.getenv(
    "RECRUITER_NAME", "ABC Company Recruiter"
).strip()

RECRUITER_PASSWORD = os.getenv(
    "RECRUITER_PASSWORD", "company@123"
).strip()

COMPANY_NAME = os.getenv(
    "RECRUITER_COMPANY_NAME", "ABC Pvt. Limited"
).strip()

COMPANY_ROLE_CODE = "HR_RECRUITER"


def main():
    if not RECRUITER_EMAIL or not RECRUITER_NAME:
        raise ValueError("Recruiter email and name are required.")

    if len(RECRUITER_PASSWORD) < 8:
        raise ValueError("Password must contain at least 8 characters.")

    if len(RECRUITER_PASSWORD) > 72:
        raise ValueError("Password must not exceed 72 characters.")

    generator = get_db()
    db = next(generator)

    try:
        role = db.scalar(
            select(Role).where(
                Role.role_code == COMPANY_ROLE_CODE
            )
        )

        if role is None:
            raise RuntimeError(
                "HR_RECRUITER role was not found in the database."
            )

        # Use the existing company created in the admin portal.
        company = db.scalar(
            select(Company).where(
                (Company.display_name == COMPANY_NAME)
                | (Company.legal_name == COMPANY_NAME)
            )
        )

        if company is None:
            raise RuntimeError(
                f"Company '{COMPANY_NAME}' was not found. "
                "Check its exact name in the admin portal."
            )

        user = db.scalar(
            select(User).where(
                User.email_normalized == RECRUITER_EMAIL
            )
        )

        password_hash = hash_password(RECRUITER_PASSWORD)

        if user is None:
            user = User(
                email_normalized=RECRUITER_EMAIL,
                display_name=RECRUITER_NAME,
                password_hash=password_hash,
                account_status="ACTIVE",
                roles=[role],
            )
            db.add(user)
            db.flush()
        else:
            # Update the existing account's login credentials.
            user.display_name = RECRUITER_NAME
            user.password_hash = password_hash
            user.account_status = "ACTIVE"

            if not any(
                assigned_role.role_code == COMPANY_ROLE_CODE
                for assigned_role in user.roles
            ):
                user.roles.append(role)

        # Ensure the recruiter is linked to this company.
        membership = db.get(
            RecruiterCompanyMembership,
            (user.id, company.id),
        )

        if membership is None:
            membership = RecruiterCompanyMembership(
                recruiter_user_id=user.id,
                company_id=company.id,
                membership_role="OWNER",
                is_active=True,
            )
            db.add(membership)
        else:
            membership.membership_role = "OWNER"
            membership.is_active = True

        db.commit()

        print("\nRecruiter account is ready!")
        print(f"Email: {RECRUITER_EMAIL}")
        print(f"Company: {company.display_name}")
        print(f"Role: {COMPANY_ROLE_CODE}")
        print("Password: configured successfully")
        print("\nYou can now log in through the website.")

    except Exception:
        db.rollback()
        raise
    finally:
        generator.close()


if __name__ == "__main__":
    main()
