# Integrated frontend authentication patch

Merged into the supplied project ZIP:
- frontend-new/src/services/authService.js
- frontend-new/src/services/api.js
- frontend-new/src/components/ProtectedRoute.jsx
- frontend-new/src/pages/Login.jsx

Generated/dependency folders (node_modules, backend/.venv, caches, frontend build output) are excluded to keep the archive portable and smaller. The local backend `.env` is intentionally not included because it may contain database/JWT/SMTP secrets. Keep your existing `.env` file locally; do not replace it with `.env.example`.

## Run locally
1. Extract this archive.
2. In `placement-management-fastapi/frontend-new`, run `npm install`, then `npm run dev`.
3. In `placement-management-fastapi/backend`, activate your existing virtual environment (or install dependencies from the project's dependency file), ensure your local `.env` is present, and start FastAPI as you normally do.

The frontend API defaults to `http://127.0.0.1:8000/api/v1`. If your backend runs elsewhere, set `VITE_API_BASE_URL` in `frontend-new/.env.local` to the correct API base URL and restart Vite.

Important: backend permissions remain authoritative. Selecting a role in the login UI does not grant that role on the server; the account must have the appropriate backend role.
