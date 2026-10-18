# Presentation recovery notes

## Important
This bundle excludes virtual environments and actual `.env` files. Configure `backend/.env` locally from `.env.example`. Do not share the real `.env` or commit credentials.

## Repair an existing MySQL database
From PowerShell in `backend/`, activate your environment and install dependencies if needed. Then run:

```powershell
python scripts/repair_local_schema.py
```

This safely adds the missing nullable `companies.eligibility_cgpa` and `companies.positions` columns if absent. It does not delete data. A matching Alembic migration (`0002_repair_company_columns.py`) is also included for databases already stamped at `0001_bootstrap`.

## Prepare local presentation login accounts
Only use with `APP_ENV=development` in `backend/.env`. After confirming the database and tables exist, run:

```powershell
python scripts/bootstrap_presentation_demo.py
```

It creates or resets these local-only demo accounts:

| Account type | Email | Password |
|---|---|---|
| Admin | `admin@gmail.com` | `admin@123` |
| Student | `student@gmail.com` | `student@123` |
| Company | `company@gmail.com` | `company@123` |

The script refuses to run unless `APP_ENV=development`. These passwords are for a local classroom demo only, never production. The selected account type is now checked against roles returned by the API.

## Start the backend
Use Python 3.12 (recommended by `pyproject.toml`) in a fresh virtual environment:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -e .
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

If your environment already has the dependencies installed, skip the install commands. Keep this terminal running.

## Start the frontend
Open a second terminal in `frontend-new/`:

```powershell
npm install
npm run dev
```

Open the localhost URL printed by Vite, normally `http://localhost:5173`.

## Verify
1. `http://127.0.0.1:8000/health` should return `{"status":"ok"}`.
2. `http://127.0.0.1:8000/docs` should load.
3. Open the companies page or `http://127.0.0.1:8000/api/v1/companies`.
4. Sign in with one of the local demo accounts above.

The frontend still includes presentation-only sections that are not all backed by APIs. Test the actual workflows you intend to demonstrate before presenting.
