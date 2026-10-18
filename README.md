# Placement Management System

This repository contains the React/Vite frontend and FastAPI/MySQL backend. The Admin, Student, and Company portals use the same API/database; frontend demo-data modules have been removed from the active UI and the unused `src/data` folder has been removed.

## Requirements
- Python 3.12 recommended
- Node.js LTS and npm
- MySQL 8.x

## 1. Database and backend

Run `database/setup.sql` in MySQL Workbench as a MySQL administrator. Then open PowerShell in `backend`:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -e .
Copy-Item .env.example .env
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Put the generated secret into `JWT_SECRET` in `.env`, and update `DATABASE_URL` to match the MySQL user/password you configured. Do not commit `.env`.

Create/update the schema and initial role records:

```powershell
python -m alembic upgrade head
```

Create a local administrator using the existing script after reviewing its configured credentials:

```powershell
python create_admin.py
```

Run FastAPI:

```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Verify `http://127.0.0.1:8000/health` and `http://127.0.0.1:8000/docs`.

## 2. Frontend

In a second terminal:

```powershell
cd frontend-new
npm ci
npm run dev
```

Configure `VITE_API_BASE_URL` only if the API is not at `http://127.0.0.1:8000/api/v1`.

## Student creation/login

Admin → Students → Add Student now includes an initial password. Creating a student with that password creates an active account and hashes the password in the backend. If the password is not supplied by another API client, the account remains invited and cannot log in until registration is completed.

## Company login

A recruiter needs an active `HR_RECRUITER` role and an active row in `recruiter_company_memberships` linking that user to a company. `python create_company.py` creates/updates a local demo recruiter and links it to a `Demo Company`; review/change the demo credentials before use. Company application/interview reads and changes are scoped to linked company memberships.

## Honest feature status

The student and company dashboards, profiles, jobs, applications, interviews, and company student directory now load live API data. Notifications, messaging, and resume file upload are intentionally shown as unavailable/empty because this backend does not yet implement persistent notification/message endpoints or a file-storage upload/download API. They do not show fabricated demo records.

## Existing databases

Back up your database before applying migrations or schema changes. Never run `alembic downgrade base` on a database containing records. Migrations are intended to update the schema; do not drop the database to repair an error.

## Updates in this version

- Admin company creation now creates the linked recruiter login in the same transaction. Recruiter name, unique email, and an initial password of 8–72 characters are required.
- Student phone numbers and extended profile data are persisted in MySQL.
- Student profile editing includes academic details, skills, projects, certifications, professional links, and PDF resume upload.
- Company recruiters can edit only companies linked to their active recruiter membership.
- The company student-directory route now matches the registered detail route.
- Sidebar active states and red logout buttons are consistent across portals.

### Apply the database migration

From `backend` with the virtual environment activated and `.env` configured:

```powershell
alembic upgrade head
```

This adds nullable columns to `student_profiles` and preserves existing student rows. Back up the database before applying migrations to important data.
