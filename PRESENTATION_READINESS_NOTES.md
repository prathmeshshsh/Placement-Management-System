# Placement Management System: fix and presentation notes

## Student department update fix

- The frontend previously sent `program` when editing a student but omitted `department_id`, which is the field the backend uses for the student's department.
- The student list previously displayed `program` as the branch, so a department change could save (or appear selected in the form) without changing the branch shown in the table.
- Student reads now load department records and resolve the branch from the department code.
- Student create/update now resolves the selected branch to a department ID and sends that ID to FastAPI.
- The edit dialog now waits for the API result and remains open if the save fails instead of closing as though it succeeded.

## Start the backend (PowerShell)

Open a terminal in `backend`:

```powershell
cd .\backend
```

If `.venv` already exists:

```powershell
.\.venv\Scripts\Activate.ps1
```

If activation reports that the file does not exist, create the environment and install dependencies:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -e .
```

Ensure `backend\.env` has a valid database URL and a `JWT_SECRET` at least 32 bytes long. Then run migrations and start the API:

```powershell
alembic upgrade head
uvicorn app.main:app --reload
```

API health: `http://127.0.0.1:8000/health`
Swagger: `http://127.0.0.1:8000/docs`

## Start the frontend (second terminal)

```powershell
cd .\frontend-new
npm ci
npm run dev
```

Open the Vite URL printed in the terminal, normally `http://localhost:5173`.

## Before presenting

1. Log in using your existing admin account.
2. Open Students, edit a student's branch to IT, and click Update Student.
3. Confirm the modal closes only after the API succeeds, the table shows IT, and the IT count becomes 1.
4. Refresh the browser and confirm IT remains selected and displayed.
5. Test add, view, delete/deactivate, CSV export, Companies, Placements, and Analytics.
6. Use only demo data. Do not expose `.env`, passwords, JWTs, SMTP credentials, or real student data in the presentation.

## Validation note

Backend Python source passed `compileall`. A frontend production build could not be run in this environment because npm dependency installation did not complete, so run `npm ci` and `npm run build` locally before presenting. The app also needs to be smoke-tested against your local MySQL database and `.env`; this archive cannot prove those machine-specific settings are correct.
