# Operating Sightglass

Deploy securely, retain data, back up SQLite, restore safely, and upgrade.

Canonical HTML: https://sightglass-docs.vercel.app/docs/operations

## Server configuration

```env
SIGHTGLASS_PORT=7777
SIGHTGLASS_DATABASE_PATH=/data/sightglass.db
SIGHTGLASS_API_KEY=replace-me
SIGHTGLASS_SUCCESS_RETENTION_DAYS=7
SIGHTGLASS_ERROR_RETENTION_DAYS=30
SIGHTGLASS_AGGREGATE_RETENTION_DAYS=365
```

`SIGHTGLASS_DASHBOARD_PATH` is available when the server and dashboard are deployed separately. The published container already includes the dashboard, so most deployments should leave it unset.

## Docker Compose

```yaml
services:
  sightglass:
    image: bazokhan/sightglass:0.1.0
    restart: unless-stopped
    ports:
      - "127.0.0.1:7777:7777"
    environment:
      SIGHTGLASS_API_KEY: ${SIGHTGLASS_API_KEY}
    volumes:
      - sightglass-data:/data

volumes:
  sightglass-data:
```

After startup, `GET http://127.0.0.1:7777/healthz` should return `{"status":"ok"}`.

## Security boundary

The API key authenticates ingestion only. Bind Sightglass to a trusted private network or put it behind a reverse proxy that authenticates all dashboard and read API requests. Terminate TLS at that boundary.

## Upgrades

Back up the database before changing image versions. Pin a versioned image tag in production, read the release notes, pull the new image, and recreate the container with the same `/data` volume. Upgrade the SDK packages together so core and adapters stay on the same release line.

## Troubleshooting

- **The dashboard does not load:** request `/healthz`; if it fails, inspect the container logs and confirm port `7777` is published.
- **The dashboard loads but has no data:** run an observed operation, verify the configured endpoint is reachable from the application, and make sure the application key matches the server key.
- **Ingestion returns 401:** the `Authorization` bearer value does not match `SIGHTGLASS_API_KEY`.
- **Data disappears after recreation:** mount a persistent volume at `/data`; an unmounted container filesystem is ephemeral.
- **Shutdown loses the newest telemetry:** stop accepting application work first, then await `shutdownSightglass()` before exiting.
- **Dashboard reads need login:** Sightglass does not authenticate reads; enforce authentication and TLS at a reverse proxy or private-network boundary.

## Persistence and recovery

SQLite runs in WAL mode at `/data/sightglass.db`. Use SQLite's online backup operation while the service is running, or stop the container before copying the database plus its `-wal` and `-shm` companions. Never copy only the main database while writes continue.

Restore while Sightglass is stopped, then start the same or a newer image. Ordered schema migrations run transactionally at startup. Back up before upgrading, and do not downgrade an upgraded database without restoring a matching backup.

Successful raw occurrences default to 7 days, errors to 30 days, and ordinary aggregates and health samples to 365 days. Exact meter rows and compact meter totals are retained indefinitely.
