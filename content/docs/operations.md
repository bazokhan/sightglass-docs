---
slug: operations
title: Operating Sightglass
summary: Deploy securely, retain data, back up SQLite, restore safely, and upgrade.
group: Operating
order: 70
---

## Server configuration

```env
SIGHTGLASS_PORT=7777
SIGHTGLASS_DATABASE_PATH=/data/sightglass.db
SIGHTGLASS_API_KEY=replace-me
SIGHTGLASS_SUCCESS_RETENTION_DAYS=7
SIGHTGLASS_ERROR_RETENTION_DAYS=30
SIGHTGLASS_AGGREGATE_RETENTION_DAYS=365
```

## Security boundary

The API key authenticates ingestion only. Bind Sightglass to a trusted private network or put it behind a reverse proxy that authenticates all dashboard and read API requests. Terminate TLS at that boundary.

## Persistence and recovery

SQLite runs in WAL mode at `/data/sightglass.db`. Use SQLite's online backup operation while the service is running, or stop the container before copying the database plus its `-wal` and `-shm` companions. Never copy only the main database while writes continue.

Restore while Sightglass is stopped, then start the same or a newer image. Ordered schema migrations run transactionally at startup. Back up before upgrading, and do not downgrade an upgraded database without restoring a matching backup.

Successful raw occurrences default to 7 days, errors to 30 days, and ordinary aggregates and health samples to 365 days. Exact meter rows and compact meter totals are retained indefinitely.
