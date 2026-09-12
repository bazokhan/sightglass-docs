# HTTP API

Reference the versioned ingestion, dashboard, trace, usage, and health endpoints.

Canonical HTML: https://sightglass-docs.vercel.app/docs/api

All timestamps are ISO 8601. Range endpoints accept optional `from` and `to` values and default to the last 24 hours. `service` and `environment` filters have the same meaning everywhere.

## Ingestion

`POST /api/v1/ingest` accepts protocol v1 envelopes and returns HTTP 202 with accepted item counts. When `SIGHTGLASS_API_KEY` is configured, send `Authorization: Bearer <key>`.

## Read and export endpoints

- `GET /healthz`
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

Read endpoints are intentionally unauthenticated inside Sightglass. Keep the server private or place an authenticating reverse proxy in front of every read and dashboard request.
