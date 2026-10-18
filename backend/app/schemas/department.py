from uuid import UUID
from pydantic import BaseModel,ConfigDict,Field
class DepartmentCreate(BaseModel): code:str=Field(min_length=2,max_length=40);name:str=Field(min_length=1,max_length=160)
class DepartmentOut(BaseModel): model_config=ConfigDict(from_attributes=True);id:UUID;code:str;name:str;is_active:bool
