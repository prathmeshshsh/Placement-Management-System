# Architecture and route map

Monorepo: backend/app/core (settings/security), db (engine/base/types), models, schemas, repositories, services, api/v1 routers; backend/alembic; frontend/src/app, features, components and lib/api. Frontend is a React/TypeScript/Tailwind integration shell; backend owns authorization and business truth.

Request flow: FastAPI router -> dependency/auth context -> Pydantic validation -> service transaction -> repository/SQLAlchemy Session -> MySQL. Services own eligibility/state-transition/scheduling rules. Repositories own queries. Responses use schemas, never raw ORM objects.

Route families for implementation: /api/v1/auth; /admin/users; /students; /companies; /drives; /jobs; /applications; /interviews; /results; /reports; /dashboards. Current executable routes: auth login/register/refresh/logout/me, admin invited user creation, and reference department list/create/get/deactivate. Other placement routes are listed as planned architecture, not stubbed as fake successes.

Auth decisions: short-lived HS256 JWT with issuer/audience; Argon2 password hashing; single-use invitation hashes; opaque rotating refresh tokens hashed in MySQL; strict CORS allow-list; same-site HttpOnly cookie and origin check on refresh/logout. Production should use TLS, rate limiting, a transactional email outbox, and reviewed static migrations.
