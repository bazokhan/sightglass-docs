# HTTP API

Reference the versioned ingestion, dashboard, trace, usage, and health endpoints.

Canonical HTML: https://sightglass-docs.trugraph.io/docs/api

All timestamps are ISO 8601. Range endpoints accept optional `from` and `to` values and default to the last 24 hours. `service` and `environment` filters have the same meaning everywhere.

## Ingestion

`POST /api/v1/ingest` accepts protocol v1 envelopes and returns HTTP 202 with accepted item counts. Send a named ingestion key from **Settings → Keys** as `Authorization: Bearer <key>`. The legacy `SIGHTGLASS_API_KEY` environment variable is also accepted for migration.

## Read and export endpoints

- `GET /healthz` (public liveness)
- `GET /readyz` (public readiness)
- `GET /api/v1/services`
- `GET /api/v1/summary`
- `GET /api/v1/trend`
- `GET /api/v1/occurrences`
- `GET /api/v1/occurrences/:id`
- `GET /api/v1/traces/:traceId`
- `GET /api/v1/database`
- `GET /api/v1/dependencies`
- `GET /api/v1/usage`
- `GET /api/v1/usage/trend`
- `GET /api/v1/usage/export`
- `GET /api/v1/health`

Occurrence lists accept `operation`, `status`, `limit`, and `offset`; `limit` is capped at 200. Usage accepts `tenantId`. Export returns CSV by default and JSON with `format=json`.

Dashboard, read, trace, and export endpoints require a signed-in Sightglass session. State-changing browser requests also require the session's CSRF token. Administration endpoints under `/api/v1/admin` additionally require the `admin` role.

Authentication endpoints cover initial setup, login, logout, invitations, password reset, and password changes. Treat these as application endpoints rather than a stable public integration API; the versioned ingestion protocol is the supported machine-to-machine boundary.
