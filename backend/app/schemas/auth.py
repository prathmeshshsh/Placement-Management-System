from pydantic import BaseModel,ConfigDict,EmailStr,Field,SecretStr,field_validator
from uuid import UUID
from datetime import datetime
class LoginRequest(BaseModel): email:EmailStr;password:SecretStr
class RegisterRequest(BaseModel): invitation_token:str=Field(min_length=32,max_length=512);password:SecretStr=Field(min_length=12,max_length=72)
class UserCreate(BaseModel): email:EmailStr;display_name:str=Field(min_length=1,max_length=160);roles:set[str]=Field(min_length=1)
class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    email_normalized: EmailStr
    display_name: str
    account_status: str
    roles: list[str] = Field(default_factory=list)

    @field_validator("roles", mode="before")
    @classmethod
    def normalize_roles(cls, value):
        if value is None:
            return []
        return [item if isinstance(item, str) else item.role_code for item in value]
class TokenOut(BaseModel): access_token:str;token_type:str="Bearer";expires_in:int;user:UserOut|None=None
class InvitationOut(BaseModel): user:UserOut;expires_at:datetime
