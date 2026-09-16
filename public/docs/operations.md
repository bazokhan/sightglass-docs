# Operating Sightglass

Deploy securely, manage access, receive alerts, back up SQLite, restore safely, and upgrade.

Canonical HTML: https://sightglass-docs.trugraph.io/docs/operations

## One-click Coolify deployment

Create a **Docker Compose Empty** resource in Coolify, paste [`coolify-compose.yml`](https://github.com/bazokhan/sightglass/blob/main/coolify-compose.yml), and deploy it. The template creates the public HTTPS route, a persistent `/data` volume, a stable generated installation secret, and a readiness health check.

Open the deployment logs and follow the one-time administrator setup link. The link expires after 24 hours and can be regenerated from a one-off container:

```bash
node apps/server/dist/cli.js setup-link
```

Keep one replica. SQLite does not support multiple Sightglass containers writing to the same volume.

## Server configuration

| Variable                              | Purpose                                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------ |
| `SIGHTGLASS_PORT`                     | HTTP port; defaults to `7777`.                                                             |
| `SIGHTGLASS_DATABASE_PATH`            | SQLite path; the image uses `/data/sightglass.db`.                                         |
| `SIGHTGLASS_PUBLIC_URL`               | Exact public origin used in setup, invitation, and reset links.                            |
| `SIGHTGLASS_SECRET`                   | Stable secret used to encrypt stored SMTP and S3 credentials.                              |
| `SIGHTGLASS_TRUST_PROXY`              | Set to `true` behind Coolify or another trusted reverse proxy.                             |
| `SIGHTGLASS_INSECURE_HTTP`            | Local development escape hatch for non-secure cookies; never enable on public deployments. |
| `SIGHTGLASS_UPDATE_CHECKS`            | Set to `false` to disable GitHub release checks.                                           |
| `SIGHTGLASS_API_KEY`                  | Optional legacy static ingestion key; named UI-managed keys are preferred.                 |
| `SIGHTGLASS_SUCCESS_RETENTION_DAYS`   | Successful raw occurrence retention; defaults to `7`.                                      |
| `SIGHTGLASS_ERROR_RETENTION_DAYS`     | Failed raw occurrence retention; defaults to `30`.                                         |
| `SIGHTGLASS_AGGREGATE_RETENTION_DAYS` | Aggregate and health retention; defaults to `365`.                                         |

The published container includes the dashboard. `SIGHTGLASS_DASHBOARD_PATH` is only needed when running the server and dashboard separately.

## Access and ingestion keys

The first account created through the setup link is an administrator. Administrators can:

- invite an administrator or user by email;
- create an account with a temporary password;
- change roles or disable accounts without removing audit history;
- configure SMTP and send a test message;
- create and revoke named ingestion keys.

Temporary-password users must change their password after the first login. Invitation and reset links are single-use and expire. Named ingestion keys are displayed once and stored as hashes.

Dashboard sessions use HTTP-only cookies, idle and absolute expiry, and CSRF protection. Terminate TLS at the reverse proxy and set `SIGHTGLASS_PUBLIC_URL` and `SIGHTGLASS_TRUST_PROXY=true` correctly.

## Notifications and alerts

Configure SMTP in **Settings → Email**, then select alert recipients in **Settings → Alerts**. Sightglass can notify administrators or selected users about elevated error rate, high p95 latency, service silence, low disk space, and process restarts. Alerts have a cooldown and send a recovery message when the condition clears.

Sightglass retries a failed SMTP send once. Configuration and delivery failures are recorded without blocking ingestion.

## Backups and recovery

Daily local online backups are enabled by default and written under `/data/backups`. Configure retention, download the newest backup, or run one immediately from **Settings → Backups**. Optional S3-compatible upload supports AWS S3 and providers with a custom endpoint and path-style mode.

Backups are integrity-checked before being marked successful. To verify or restore offline:

```bash
node apps/server/dist/cli.js backup /data/backups/manual.sqlite
node apps/server/dist/cli.js verify-backup /data/backups/manual.sqlite
node apps/server/dist/cli.js restore /data/backups/manual.sqlite
```

Stop the normal Sightglass container before restore. Restore creates a safety copy of the current database and invalidates existing sessions. If `SIGHTGLASS_SECRET` is not supplied explicitly, also protect `/data/.secret`; without it, restored SMTP and S3 credentials cannot be decrypted.

## Upgrades

The administration screen checks the latest [GitHub release](https://github.com/bazokhan/sightglass/releases) and shows the installed container version. Back up first, read the release notes, then let Coolify pull the image from [Docker Hub](https://hub.docker.com/r/bazokhan/sightglass) and recreate the single container with the same `/data` volume. Sightglass deliberately does not control the Docker socket or replace its own container.

Pin a version tag when you require controlled upgrades. Use `latest` when you prefer Coolify's update workflow. Do not downgrade an upgraded database without restoring a matching backup.

## Health and troubleshooting

- `GET /healthz` reports process liveness.
- `GET /readyz` reports whether the server and database are ready for traffic.
- **Setup link is wrong:** set `SIGHTGLASS_PUBLIC_URL` to the exact external origin and regenerate the link.
- **Login loops over HTTP:** use HTTPS, or set `SIGHTGLASS_INSECURE_HTTP=true` only for local development.
- **Ingestion returns 401:** create an active key under **Settings → Keys** and send it as the bearer token.
- **Email does not arrive:** save SMTP settings and use the test-email action before enabling invitations or alerts.
- **Data disappears after recreation:** restore the persistent volume at `/data`; an unmounted container filesystem is ephemeral.
- **Shutdown loses newest telemetry:** stop accepting application work first, then await `shutdownSightglass()` before exiting.
