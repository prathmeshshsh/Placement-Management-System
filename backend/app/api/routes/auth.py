from datetime import datetime,timezone,timedelta
from fastapi import APIRouter,Depends,HTTPException,Request,Response
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import current_user
from app.core.config import get_settings
from app.core.security import token_hash
from app.models.identity import RefreshSession,User
from app.schemas.auth import LoginRequest,RegisterRequest,TokenOut,UserOut
from app.services.auth import login,refresh,register_invited
router=APIRouter(prefix="/auth",tags=["auth"])
def set_refresh_cookie(response,raw,expires):
 s=get_settings();max_age=max(0,int((expires-datetime.utcnow()).total_seconds()));response.set_cookie("placement_refresh",raw,max_age=max_age,httponly=True,secure=s.cookie_secure,samesite=s.cookie_samesite,path="/api/v1/auth")
def pack(data):
 u=data["user"];return TokenOut(
        access_token=data["access_token"],
        expires_in=data["expires_in"],
        user=UserOut(
            id=u.id,
            email_normalized=u.email_normalized,
            display_name=u.display_name,
            account_status=u.account_status,
            roles=[role.role_code for role in u.roles],
        ),
    )
@router.post("/login",response_model=TokenOut)
def login_route(body:LoginRequest,request:Request,response:Response,db:Session=Depends(get_db)):
 data=login(db,str(body.email).lower(),body.password.get_secret_value(),request.headers.get("user-agent"),request.client.host if request.client else None);set_refresh_cookie(response,data["refresh_token"],data["refresh_expires_at"]);db.commit();return pack(data)
@router.post("/refresh",response_model=TokenOut)
def refresh_route(request:Request,response:Response,db:Session=Depends(get_db)):
 s=get_settings();raw=request.cookies.get("placement_refresh")
 if request.headers.get("origin") not in s.allowed_origins:raise HTTPException(403,"Origin not allowed")
 if not raw:raise HTTPException(401,"Refresh cookie required")
 data=refresh(db,raw,request.headers.get("user-agent"),request.client.host if request.client else None);set_refresh_cookie(response,data["refresh_token"],data["refresh_expires_at"]);db.commit();return pack(data)
@router.post("/logout",status_code=204)
def logout_route(request:Request,response:Response,db:Session=Depends(get_db)):
 s=get_settings();raw=request.cookies.get("placement_refresh")
 if raw and request.headers.get("origin") not in s.allowed_origins:raise HTTPException(403,"Origin not allowed")
 if raw:
  obj=db.scalar(select(RefreshSession).where(RefreshSession.token_hash==token_hash(raw)).with_for_update())
  if obj and not obj.revoked_at:obj.revoked_at=datetime.utcnow()
 db.commit();response.delete_cookie("placement_refresh",path="/api/v1/auth",secure=s.cookie_secure,httponly=True,samesite=s.cookie_samesite);return None
@router.post("/register",status_code=201)
def register_route(body:RegisterRequest,db:Session=Depends(get_db)):
 register_invited(db,body.invitation_token,body.password.get_secret_value());db.commit();return {"status":"registered"}
@router.get("/me",response_model=UserOut)
def me(user:User=Depends(current_user)):return user
