from getpass import getpass
from sqlalchemy import select
from app.db.session import SessionLocal
from app.core.security import hash_password
from app.models.identity import User,Role

def main():
 email=input("Initial Admin email: ").strip().lower()
 password=getpass("Initial Admin password (12+ characters): ")
 if len(password)<12: raise SystemExit("Password must be at least 12 characters")
 with SessionLocal.begin() as db:
  if db.scalar(select(User.id).where(User.email_normalized==email)): raise SystemExit("User already exists")
  role=db.scalar(select(Role).where(Role.role_code=="ADMIN"))
  if role is None: raise SystemExit("Role seed missing; run alembic upgrade head")
  user=User(email_normalized=email,display_name="Placement Administrator",account_status="ACTIVE",roles=[role])
  user.password_hash=hash_password(password);db.add(user)
 print("Initial administrator created. Remove bootstrap credentials from the environment.")
if __name__=="__main__": main()
