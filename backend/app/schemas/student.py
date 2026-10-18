
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class StudentCreate(BaseModel):
    email: EmailStr
    display_name: str = Field(min_length=1, max_length=160)
    roll_number: str = Field(min_length=1, max_length=64)
    department_id: UUID
    program: str = Field(min_length=1, max_length=120)
    graduation_year: int = Field(ge=2000, le=2100)
    cgpa: float | None = Field(default=None, ge=0, le=10)
    active_backlogs: int = Field(default=0, ge=0)
    historical_backlogs: int = Field(default=0, ge=0)
    initial_password: str = Field(min_length=8, max_length=72)
    phone: str | None = Field(default=None, max_length=32)


class StudentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: UUID
    email: EmailStr
    display_name: str
    roll_number: str
    department_id: UUID
    program: str
    graduation_year: int
    cgpa: float | None
    active_backlogs: int
    historical_backlogs: int
    profile_status: str
    phone: str | None = None
    semester: int | None = None
    tenth_percentage: float | None = None
    twelfth_percentage: float | None = None
    linkedin_url: str | None = None
    github_url: str | None = None
    portfolio_url: str | None = None
    skills: list | None = None
    projects: list | None = None
    certifications: list | None = None
