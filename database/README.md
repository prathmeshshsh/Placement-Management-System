# Database setup and cloning

1. Back up any existing database first.
2. Run `setup.sql` in MySQL Workbench as an administrator after replacing the password placeholder.
3. Configure `backend/.env` with a matching `DATABASE_URL` and a generated `JWT_SECRET`.
4. From `backend`, run `python -m alembic upgrade head`. Migrations create tables and initial role records.
5. Create local users with the backend scripts after reviewing their configured demo credentials.

The schema source of truth is `backend/app/models/` plus `backend/alembic/versions/`. Do not maintain a second hand-written copy of every table definition in this SQL file, because it will drift from migrations. For transferring existing records to another PC, export a MySQL Workbench data dump separately and never include real secrets or sensitive student data in a public repository.
