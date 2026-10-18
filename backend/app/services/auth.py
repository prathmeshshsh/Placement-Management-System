from datetime import datetime,timedelta
import secrets
from sqlalchemy import select
from sqlalchemy.orm import Session,selectinload
from fastapi import HTTPException
from app.core.config import get_settings
from app.core.security import hash_password,verify_password,opaque_token,token_hash,create_access_token
from app.models.identity import User,Role,RefreshSession,UserInvitation
from app.repositories.users import UserRepository
def login(db:Session,email,password,agent,ip):
 user=UserRepository(db).by_email(email)
 if not user or not user.password_hash or not verify_password(password,user.password_hash) or user.account_status!="ACTIVE":raise HTTPException(401,"Invalid credentials")
 user.last_login_at=datetime.utcnow();return issue(db,user,agent,ip)
def issue(db,user,agent,ip):
 raw=opaque_token();expires=datetime.utcnow()+timedelta(days=get_settings().refresh_token_days)
 session=RefreshSession(user_id=user.id,token_hash=token_hash(raw),expires_at=expires,user_agent=agent,ip_address=ip);db.add(session);db.flush()
 access,ttl=create_access_token(str(user.id),[r.role_code for r in user.roles])
 return {"access_token":access,"expires_in":ttl,"refresh_token":raw,"refresh_expires_at":expires,"user":user}
def refresh(db:Session,raw,agent,ip):
 old=db.scalar(select(RefreshSession).where(RefreshSession.token_hash==token_hash(raw)).with_for_update());now=datetime.utcnow()
 if not old or old.revoked_at or old.expires_at<=now:raise HTTPException(401,"Refresh session invalid or expired")
 user=UserRepository(db).by_id(old.user_id)
 if not user or user.account_status!="ACTIVE":raise HTTPException(403,"Account inactive")
 old.revoked_at=now;data=issue(db,user,agent,ip);db.flush();new=db.scalar(select(RefreshSession).where(RefreshSession.token_hash==token_hash(data["refresh_token"])));old.replaced_by_session_id=new.id;return data
def register_invited(db:Session,raw,password):
 inv=db.scalar(select(UserInvitation).where(UserInvitation.token_hash==token_hash(raw)).with_for_update());now=datetime.utcnow()
 if not inv or inv.redeemed_at or inv.expires_at<=now:raise HTTPException(400,"Invitation invalid or expired")
 user=db.get(User,inv.user_id)
 if not user or user.account_status!="INVITED":raise HTTPException(409,"Invitation account is not registrable")
 user.password_hash=hash_password(password);user.account_status="ACTIVE";inv.redeemed_at=now
def invite_user(db:Session,email,name,role_codes,actor_id,deliver):
 email=email.strip().lower()
 if UserRepository(db).by_email(email):raise HTTPException(409,"Email already exists")
 roles=list(db.scalars(select(Role).where(Role.role_code.in_(role_codes))).all())
 if {r.role_code for r in roles}!=role_codes:raise HTTPException(422,"Unknown role")
 user=User(email_normalized=email,display_name=name.strip(),account_status="INVITED",created_by_user_id=actor_id,updated_by_user_id=actor_id,roles=roles);db.add(user);db.flush()
 raw=opaque_token();expires=datetime.utcnow()+timedelta(hours=24);db.add(UserInvitation(user_id=user.id,token_hash=token_hash(raw),expires_at=expires,created_by_user_id=actor_id));db.flush();deliver(email,raw,expires);return user,expires
