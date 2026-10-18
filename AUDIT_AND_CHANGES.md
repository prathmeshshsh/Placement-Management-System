# Integration audit and changes

## Completed in this working copy

- Removed the unused `frontend-new/src/data` demo/mock data modules after replacing all page imports that referenced them.
- Student dashboard, profile, edit profile, applications, jobs (existing API-backed page), and interviews now use FastAPI data. Resume and notification pages explicitly disclose that persistent backend support is not implemented instead of inventing uploaded files or notifications.
- Company dashboard, job/drive listing, applications, interviews, company profile, student directory, and student profile now request API/database records. Messaging and notifications explicitly disclose missing backend persistence instead of rendering fake records.
- Admin-created students can be assigned an initial password. The backend hashes it and activates the account; without an initial password the account remains invited. The admin student form asks for a password on creation.
- Added authenticated `/api/v1/students/me` GET/PATCH endpoints for the logged-in student's own persisted academic profile.
- Added `/api/v1/companies/mine` and updated the local company bootstrap script to ensure an HR recruiter is linked to a company through `recruiter_company_memberships`.
- Company application/interview reads and application status/interview changes are scoped to the recruiter’s active company membership. Job creation/update/close checks the same membership.
- Removed the development `X-Demo-Role` authentication bypass; protected API routes require real JWT login.
- Added a database setup folder and updated setup documentation. `.env`, logs, `.venv`, and `node_modules` are excluded from the delivery archive.

## Deliberate limitations (not represented as working features)

- Resume upload/download is not implemented end-to-end. Models contain resume metadata, but the backend does not currently provide an upload/download storage service.
- Notifications and messaging do not have persistent models/routes in this starter backend, so the pages show honest empty/unavailable states.
- The current student model only persists the fields in `StudentProfile` plus the user identity. Skills, projects, personal phone, 10th/12th marks, and LinkedIn/GitHub need schema and API work before they can be saved or displayed as database-backed information.
- A recruiter account needs an active company membership. Run `python create_company.py` to create/link the local demo recruiter and company; production account provisioning should be done through a secure admin workflow.

## Validation

- Python source compilation (`python -m compileall`) passed for backend modules and helper scripts.
- A frontend production build could not be completed in this Linux environment because the ZIP's existing `node_modules` lacks the platform-specific Rolldown native binding. The package lock is retained; run `npm ci` on the target Windows machine and then `npm run build` to validate with the correct native optional dependency.
- No database migration was run against the user's database. Back up the database before applying project migrations.
