from datetime import datetime
from email.message import EmailMessage
import smtplib,ssl
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.api.deps import require_roles
from app.core.config import get_settings
from app.db.session import get_db
from app.models.identity import User
from app.schemas.auth import UserCreate,UserOut
from app.services.auth import invite_user
router=APIRouter(prefix="/admin/users",tags=["admin-users"])
def deliver(email,token,expires):
 s=get_settings()
 if not s.smtp_host:raise HTTPException(503,"SMTP invitation delivery is not configured")
 msg=EmailMessage();msg["From"]=s.smtp_from;msg["To"]=email;msg["Subject"]="Placement portal invitation";msg.set_content(f"Register at {s.invitation_base_url}?token={token}. Expires {expires.isoformat()}.")
 with smtplib.SMTP(s.smtp_host,s.smtp_port,timeout=10) as mail:
  mail.starttls(context=ssl.create_default_context())
  if s.smtp_username:mail.login(s.smtp_username,s.smtp_password.get_secret_value())
  mail.send_message(msg)
@router.post("",response_model=UserOut,status_code=201)
def create_user(body:UserCreate,db:Session=Depends(get_db),actor:User=Depends(require_roles("ADMIN"))):
 try:user,_=invite_user(db,str(body.email),body.display_name,body.roles,actor.id,deliver);db.commit();db.refresh(user);return user
 except Exception:db.rollback();raise
