from datetime import datetime
from uuid import UUID
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey, JSON, Text, Numeric, UniqueConstraint, BINARY
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base, IdMixin, TimestampMixin
from app.db.types import UUIDBinary
class Department(Base,IdMixin,TimestampMixin):
 __tablename__="departments"
 code:Mapped[str]=mapped_column(String(40),unique=True);name:Mapped[str]=mapped_column(String(160));is_active:Mapped[bool]=mapped_column(Boolean,default=True)
class StudentProfile(Base,TimestampMixin):
 __tablename__="student_profiles"
 user_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("users.id"),primary_key=True);roll_number:Mapped[str]=mapped_column(String(64),unique=True);department_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("departments.id"));program:Mapped[str]=mapped_column(String(120));graduation_year:Mapped[int]=mapped_column(Integer);cgpa:Mapped[float|None]=mapped_column(Numeric(4,2));active_backlogs:Mapped[int]=mapped_column(Integer,default=0);historical_backlogs:Mapped[int]=mapped_column(Integer,default=0);profile_status:Mapped[str]=mapped_column(String(20),default="INCOMPLETE");phone:Mapped[str|None]=mapped_column(String(32));semester:Mapped[int|None]=mapped_column(Integer);tenth_percentage:Mapped[float|None]=mapped_column(Numeric(5,2));twelfth_percentage:Mapped[float|None]=mapped_column(Numeric(5,2));linkedin_url:Mapped[str|None]=mapped_column(String(512));github_url:Mapped[str|None]=mapped_column(String(512));portfolio_url:Mapped[str|None]=mapped_column(String(512));skills:Mapped[list|None]=mapped_column(JSON);projects:Mapped[list|None]=mapped_column(JSON);certifications:Mapped[list|None]=mapped_column(JSON)
class Skill(Base,IdMixin,TimestampMixin):
 __tablename__="skills"
 normalized_name:Mapped[str]=mapped_column(String(120),unique=True);display_name:Mapped[str]=mapped_column(String(120))
class StudentSkill(Base):
 __tablename__="student_skills"
 student_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("student_profiles.user_id"),primary_key=True);skill_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("skills.id"),primary_key=True);proficiency:Mapped[int|None]=mapped_column(Integer);is_verified:Mapped[bool]=mapped_column(Boolean,default=False)
class StudentResume(Base,IdMixin):
 __tablename__="student_resumes"
 student_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("student_profiles.user_id"));object_key:Mapped[str]=mapped_column(String(512),unique=True);original_filename:Mapped[str]=mapped_column(String(255));content_type:Mapped[str]=mapped_column(String(127));byte_size:Mapped[int]=mapped_column(Integer);checksum_sha256:Mapped[bytes]=mapped_column(BINARY(32));is_current:Mapped[bool]=mapped_column(Boolean,default=True);uploaded_at:Mapped[datetime]=mapped_column(DateTime)
class Company(Base,IdMixin,TimestampMixin):
 __tablename__="companies"
 legal_name:Mapped[str]=mapped_column(String(200));display_name:Mapped[str]=mapped_column(String(160));industry:Mapped[str|None]=mapped_column(String(120));website:Mapped[str|None]=mapped_column(String(512));package_lpa:Mapped[float|None]=mapped_column(Numeric(8,2));eligibility_cgpa:Mapped[float|None]=mapped_column(Numeric(4,2));positions:Mapped[int|None]=mapped_column(Integer);status:Mapped[str]=mapped_column(String(20),default="ACTIVE")
class RecruiterCompanyMembership(Base):
 __tablename__="recruiter_company_memberships"
 recruiter_user_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("users.id"),primary_key=True);company_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("companies.id"),primary_key=True);membership_role:Mapped[str]=mapped_column(String(20));is_active:Mapped[bool]=mapped_column(Boolean,default=True)
class PlacementDrive(Base,IdMixin,TimestampMixin):
 __tablename__="placement_drives"
 name:Mapped[str]=mapped_column(String(160));academic_year:Mapped[str]=mapped_column(String(16));starts_at:Mapped[datetime]=mapped_column(DateTime);ends_at:Mapped[datetime]=mapped_column(DateTime);status:Mapped[str]=mapped_column(String(20),default="PLANNED")
class JobPosting(Base,IdMixin,TimestampMixin):
 __tablename__="job_postings"
 company_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("companies.id"));drive_id:Mapped[UUID|None]=mapped_column(UUIDBinary(),ForeignKey("placement_drives.id"));title:Mapped[str]=mapped_column(String(200));description:Mapped[str|None]=mapped_column(Text);openings:Mapped[int]=mapped_column(Integer);package_lpa:Mapped[float|None]=mapped_column(Numeric(8,2));min_cgpa:Mapped[float|None]=mapped_column(Numeric(4,2));max_active_backlogs:Mapped[int|None]=mapped_column(Integer);max_historical_backlogs:Mapped[int|None]=mapped_column(Integer);all_departments_allowed:Mapped[bool]=mapped_column(Boolean,default=True);application_open_at:Mapped[datetime]=mapped_column(DateTime);application_deadline:Mapped[datetime]=mapped_column(DateTime);status:Mapped[str]=mapped_column(String(20),default="DRAFT");criteria_version:Mapped[int]=mapped_column(Integer,default=1)
class JobDepartment(Base):
 __tablename__="job_departments"
 job_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("job_postings.id"),primary_key=True);department_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("departments.id"),primary_key=True)
class JobSkill(Base):
 __tablename__="job_skills"
 job_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("job_postings.id"),primary_key=True);skill_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("skills.id"),primary_key=True);is_required:Mapped[bool]=mapped_column(Boolean,default=True);minimum_proficiency:Mapped[int|None]=mapped_column(Integer)
class Application(Base,IdMixin,TimestampMixin):
 __tablename__="applications"
 student_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("student_profiles.user_id"));job_posting_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("job_postings.id"));resume_id:Mapped[UUID|None]=mapped_column(UUIDBinary(),ForeignKey("student_resumes.id"));current_status:Mapped[str]=mapped_column(String(32),default="APPLIED");eligibility_passed:Mapped[bool]=mapped_column(Boolean);eligibility_snapshot:Mapped[dict]=mapped_column(JSON);criteria_version:Mapped[int]=mapped_column(Integer);applied_at:Mapped[datetime]=mapped_column(DateTime);__table_args__=(UniqueConstraint("student_id","job_posting_id"),)
class InterviewSlot(Base,IdMixin,TimestampMixin):
 __tablename__="interview_slots"
 job_posting_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("job_postings.id"));starts_at:Mapped[datetime]=mapped_column(DateTime);ends_at:Mapped[datetime]=mapped_column(DateTime);capacity:Mapped[int]=mapped_column(Integer,default=1);status:Mapped[str]=mapped_column(String(20),default="OPEN")
class Interview(Base,IdMixin,TimestampMixin):
 __tablename__="interviews"
 application_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("applications.id"));slot_id:Mapped[UUID|None]=mapped_column(UUIDBinary(),ForeignKey("interview_slots.id"));round_number:Mapped[int]=mapped_column(Integer);attempt_number:Mapped[int]=mapped_column(Integer,default=1);starts_at:Mapped[datetime]=mapped_column(DateTime);ends_at:Mapped[datetime]=mapped_column(DateTime);status:Mapped[str]=mapped_column(String(20),default="SCHEDULED");__table_args__=(UniqueConstraint("application_id","round_number","attempt_number"),)
class InterviewResult(Base):
 __tablename__="interview_results"
 interview_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("interviews.id"),primary_key=True);outcome:Mapped[str]=mapped_column(String(20));internal_feedback:Mapped[str|None]=mapped_column(Text);student_feedback:Mapped[str|None]=mapped_column(Text);published_at:Mapped[datetime|None]=mapped_column(DateTime)
class ApplicationDecision(Base):
 __tablename__="application_decisions"
 application_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("applications.id"),primary_key=True);decision:Mapped[str]=mapped_column(String(20));waitlist_rank:Mapped[int|None]=mapped_column(Integer);internal_note:Mapped[str|None]=mapped_column(Text);student_message:Mapped[str|None]=mapped_column(Text);published_at:Mapped[datetime|None]=mapped_column(DateTime)

class JobRevision(Base,IdMixin):
 __tablename__="job_posting_revisions"
 job_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("job_postings.id"));revision_no:Mapped[int]=mapped_column(Integer);revision_type:Mapped[str]=mapped_column(String(32));snapshot:Mapped[dict]=mapped_column(JSON);created_at:Mapped[datetime]=mapped_column(DateTime);__table_args__=(UniqueConstraint("job_id","revision_no"),)
class ApplicationStatusHistory(Base,IdMixin):
 __tablename__="application_status_history"
 application_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("applications.id"));from_status:Mapped[str|None]=mapped_column(String(32));to_status:Mapped[str]=mapped_column(String(32));actor_user_id:Mapped[UUID|None]=mapped_column(UUIDBinary(),ForeignKey("users.id"));reason:Mapped[str|None]=mapped_column(String(1000));changed_at:Mapped[datetime]=mapped_column(DateTime)
class InterviewParticipant(Base):
 __tablename__="interview_participants"
 interview_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("interviews.id"),primary_key=True);user_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("users.id"),primary_key=True);participant_role:Mapped[str]=mapped_column(String(20),default="INTERVIEWER")
class InterviewHistory(Base,IdMixin):
 __tablename__="interview_history"
 interview_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("interviews.id"));event_type:Mapped[str]=mapped_column(String(32));old_start:Mapped[datetime|None]=mapped_column(DateTime);new_start:Mapped[datetime|None]=mapped_column(DateTime);reason:Mapped[str|None]=mapped_column(String(1000));actor_user_id:Mapped[UUID|None]=mapped_column(UUIDBinary(),ForeignKey("users.id"));occurred_at:Mapped[datetime]=mapped_column(DateTime)
class ApplicationDecisionHistory(Base,IdMixin):
 __tablename__="application_decision_history"
 application_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("applications.id"));action_type:Mapped[str]=mapped_column(String(20));decision:Mapped[str]=mapped_column(String(20));waitlist_rank:Mapped[int|None]=mapped_column(Integer);actor_user_id:Mapped[UUID|None]=mapped_column(UUIDBinary(),ForeignKey("users.id"));occurred_at:Mapped[datetime]=mapped_column(DateTime)
class ReportExport(Base,IdMixin,TimestampMixin):
 __tablename__="report_exports"
 requester_user_id:Mapped[UUID]=mapped_column(UUIDBinary(),ForeignKey("users.id"));report_type:Mapped[str]=mapped_column(String(30));filters:Mapped[dict]=mapped_column(JSON);status:Mapped[str]=mapped_column(String(20),default="QUEUED");object_key:Mapped[str|None]=mapped_column(String(512));expires_at:Mapped[datetime|None]=mapped_column(DateTime)
class AuditEvent(Base,IdMixin):
 __tablename__="audit_events"
 actor_user_id:Mapped[UUID|None]=mapped_column(UUIDBinary(),ForeignKey("users.id"));action_code:Mapped[str]=mapped_column(String(80));entity_type:Mapped[str]=mapped_column(String(80));entity_id:Mapped[UUID|None]=mapped_column(UUIDBinary());metadata_json:Mapped[dict|None]=mapped_column(JSON);occurred_at:Mapped[datetime]=mapped_column(DateTime)
