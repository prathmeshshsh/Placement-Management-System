from datetime import datetime
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel,ConfigDict,Field
class StudentProfileCreate(BaseModel): roll_number:str=Field(min_length=1,max_length=64);department_id:UUID;program:str=Field(max_length=120);graduation_year:int=Field(ge=2000,le=2200);cgpa:Decimal|None=Field(default=None,ge=0,le=10);active_backlogs:int=Field(default=0,ge=0);historical_backlogs:int=Field(default=0,ge=0)
class CompanyCreate(BaseModel): legal_name:str=Field(min_length=1,max_length=200);display_name:str=Field(min_length=1,max_length=160);industry:str|None=None;website:str|None=None
class JobCreate(BaseModel): company_id:UUID;drive_id:UUID|None=None;title:str=Field(min_length=1,max_length=200);openings:int=Field(ge=1);min_cgpa:Decimal|None=Field(default=None,ge=0,le=10);application_open_at:datetime;application_deadline:datetime
class ApplicationOut(BaseModel): model_config=ConfigDict(from_attributes=True);id:UUID;student_id:UUID;job_posting_id:UUID;current_status:str;applied_at:datetime
class InterviewCreate(BaseModel): application_id:UUID;slot_id:UUID|None=None;round_number:int=Field(ge=1);starts_at:datetime;ends_at:datetime
class DecisionWrite(BaseModel): decision:str=Field(pattern="^(SELECTED|REJECTED|WAITLISTED)$");waitlist_rank:int|None=Field(default=None,ge=1);student_message:str|None=None
class PageMeta(BaseModel): page:int=Field(ge=0);page_size:int=Field(ge=1,le=100);total:int=Field(ge=0)
