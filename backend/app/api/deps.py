from uuid import UUID
from app.models.identity import User
import jwt
from fastapi import Depends,HTTPException,Header
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import decode_access_token
from app.repositories.users import UserRepository
security=HTTPBearer(auto_error=False)
def current_user(creds:HTTPAuthorizationCredentials|None=Depends(security),db:Session=Depends(get_db)):
 if not creds:
  raise HTTPException(401,"Authentication required. Sign in through the login endpoint.")
 try:claims=decode_access_token(creds.credentials);uid=UUID(claims["sub"])
 except (jwt.PyJWTError,ValueError,KeyError):raise HTTPException(401,"Invalid access token")
 u=UserRepository(db).by_id(uid)
 if not u or u.account_status!="ACTIVE":raise HTTPException(401,"Account inactive")
 return u
def require_roles(*allowed):
 def check(user=Depends(current_user)):
  if not {r.role_code for r in user.roles}.intersection(allowed):raise HTTPException(403,"Insufficient role")
  return user
 return check
