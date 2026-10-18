# API endpoint inventory

Run the backend and open `http://127.0.0.1:8000/docs`. The groups below are registered in the FastAPI application.

| Group | Method | Path | Purpose |
|---|---|---|---|
| health | GET | `/health` | Health check |
| auth | POST | `/api/v1/auth/login` | JWT login |
| auth | POST | `/api/v1/auth/refresh` | Refresh session |
| auth | POST | `/api/v1/auth/logout` | Revoke refresh session |
| auth | POST | `/api/v1/auth/register` | Redeem invitation |
| auth | GET | `/api/v1/auth/me` | Current user |
| admin-users | POST | `/api/v1/admin/users` | Invite/create account |
| departments | GET | `/api/v1/departments` | List departments |
| departments | POST | `/api/v1/departments` | Create department |
| departments | GET | `/api/v1/departments/{department_id}` | Get department |
| departments | DELETE | `/api/v1/departments/{department_id}` | Deactivate department |
| students | GET | `/api/v1/students` | List student profiles |
| students | POST | `/api/v1/students` | Create student profile and account |
| students | PATCH | `/api/v1/students/{student_id}` | Update student profile |
| students | DELETE | `/api/v1/students/{student_id}` | Disable student account |
| companies | GET | `/api/v1/companies` | List companies |
| companies | POST | `/api/v1/companies` | Create company |
| companies | PATCH | `/api/v1/companies/{company_id}` | Update company |
| companies | DELETE | `/api/v1/companies/{company_id}` | Deactivate company |
| placements | GET | `/api/v1/placements` | List job postings |
| placements | POST | `/api/v1/placements` | Create job posting |
| placements | PATCH | `/api/v1/placements/{job_id}` | Update job posting |
| placements | DELETE | `/api/v1/placements/{job_id}` | Close job posting |
| placements | GET | `/api/v1/placements/drives` | List placement drives |
| placements | POST | `/api/v1/placements/drives` | Create placement drive |
| applications | GET | `/api/v1/applications` | List applications (admin/recruiter) |
| applications | POST | `/api/v1/applications/apply` | Apply to job (student) |
| applications | GET | `/api/v1/applications/my` | Current student's applications |
| applications | PATCH | `/api/v1/applications/{application_id}/status` | Update application status |
| interviews | GET | `/api/v1/interviews` | List interviews (admin/recruiter) |
| interviews | GET | `/api/v1/interviews/my` | Current student's interviews |
| interviews | POST | `/api/v1/interviews` | Schedule interview |

The UI's hardcoded login is separate from `/auth/login`. The development-only `X-Demo-Role` bridge maps the selected frontend role to a seeded active database identity. Disable this bridge and use JWT auth for any deployment beyond a local demo.
