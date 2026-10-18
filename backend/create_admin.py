
from sqlalchemy import select

from app.db.session import get_db
from app.core.security import hash_password
from app.models.identity import User, Role


# Demo credentials: change these before running if you prefer.
ADMIN_EMAIL = "admin@gmail.com"
ADMIN_NAME = "Placement Administrator"
ADMIN_PASSWORD = "admin@123"


def main():
    db_generator = get_db()
    db = next(db_generator)

    try:
        # Find the existing ADMIN role.
        admin_role = db.scalar(
            select(Role).where(Role.role_code == "ADMIN")
        )

        if admin_role is None:
            raise RuntimeError(
                "ADMIN role not found. Check the roles table first."
            )

        # Find an existing account or create one.
        user = db.scalar(
            select(User).where(
                User.email_normalized == ADMIN_EMAIL.lower()
            )
        )

        if user is None:
            user = User(
                email_normalized=ADMIN_EMAIL.lower(),
                display_name=ADMIN_NAME,
                password_hash=hash_password(ADMIN_PASSWORD),
                account_status="ACTIVE",
                roles=[admin_role],
            )
            db.add(user)
            print("Creating new admin account...")
        else:
            user.display_name = ADMIN_NAME
            user.password_hash = hash_password(ADMIN_PASSWORD)
            user.account_status = "ACTIVE"

            if not any(
                role.role_code == "ADMIN"
                for role in user.roles
            ):
                user.roles.append(admin_role)

            print("Updating existing admin account...")

        db.commit()

        print("\nAdmin account is ready.")
        print(f"Email: {ADMIN_EMAIL}")
        print("Status: ACTIVE")
        print("Role: ADMIN")
        print("Password: the value configured in ADMIN_PASSWORD")

    except Exception:
        db.rollback()
        raise

    finally:
        db_generator.close()


if __name__ == "__main__":
    main()
