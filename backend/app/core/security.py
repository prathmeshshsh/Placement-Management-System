from datetime import datetime,timedelta,timezone
import hashlib,secrets,jwt
from pwdlib import PasswordHash
from app.core.config import get_settings
password_hash=PasswordHash.recommended()
def hash_password(value:str)->str:return password_hash.hash(value)
def verify_password(value:str,stored:str)->bool:return password_hash.verify(value,stored)
def opaque_token()->str:return secrets.token_urlsafe(32)
def token_hash(value:str)->bytes:return hashlib.sha256(value.encode()).digest()
def create_access_token(subject:str,roles:list[str]):
 s=get_settings();now=datetime.now(timezone.utc);exp=now+timedelta(minutes=s.access_token_minutes)
 token=jwt.encode({"sub":subject,"roles":roles,"iss":s.jwt_issuer,"aud":s.jwt_audience,"iat":now,"exp":exp,"jti":secrets.token_hex(16)},s.jwt_secret.get_secret_value(),algorithm="HS256")
 return token,int((exp-now).total_seconds())
def decode_access_token(token:str):
 s=get_settings();return jwt.decode(token,s.jwt_secret.get_secret_value(),algorithms=["HS256"],issuer=s.jwt_issuer,audience=s.jwt_audience,options={"require":["sub","exp","iat","iss","aud"]})
