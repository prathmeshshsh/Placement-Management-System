# Backend setup

See the repository root `README.md` for the current full setup instructions. This backend uses real JWT authentication; frontend role selection does not grant access by itself. Use `python -m alembic upgrade head` to create/update schema. Do not commit `.env` or use demo credentials in production.
