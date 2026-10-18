from sqlalchemy import select
from sqlalchemy.orm import Session,selectinload
from app.models.identity import User
class UserRepository:
 def __init__(self,db:Session):self.db=db
 def by_email(self,email):return self.db.scalar(select(User).options(selectinload(User.roles)).where(User.email_normalized==email.lower()))
 def by_id(self,user_id):return self.db.scalar(select(User).options(selectinload(User.roles)).where(User.id==user_id))
