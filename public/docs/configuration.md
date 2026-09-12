# SDK configuration

Configure delivery, bounds, durability, fetch enrichment, health samples, and diagnostics.

Canonical HTML: https://sightglass-docs.vercel.app/docs/configuration

`configureSightglass()` accepts these options:

| Option                         | Purpose                                             |
| ------------------------------ | --------------------------------------------------- |
| `service`                      | Required service name attached to telemetry.        |
| `endpoint`                     | Sightglass server origin.                           |
| `environment`                  | Deployment environment label.                       |
| `apiKey`                       | Bearer credential for ingestion.                    |
| `batchSize`                    | Maximum records sent per batch.                     |
| `flushIntervalMs`              | Maximum ordinary batching delay.                    |
| `maxQueueSize`                 | In-memory occurrence queue bound.                   |
| `requestTimeoutMs`             | Delivery request deadline.                          |
| `retryBaseMs` and `retryMaxMs` | Exponential retry bounds.                           |
| `meterSpoolDirectory`          | Durable meter spool path, or `false` to opt out.    |
| `meters`                       | Declared meter units.                               |
| `fetchInstrumentation`         | Native fetch attribution inside active operations.  |
| `healthIntervalMs`             | Process and host health sampling interval.          |
| `onTelemetryError`             | Isolated diagnostic callback for delivery failures. |

Context and event attributes accept at most 32 entries. Keys are limited to 64 characters, strings to 512 characters, and event or step names to 128 characters. Request bodies, headers, cookies, SQL, bind values, and query results are never captured automatically.
