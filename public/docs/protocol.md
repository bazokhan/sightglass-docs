# Ingestion protocol

Understand protocol v1 envelopes, validation, limits, and trace correlation.

Canonical HTML: https://sightglass-docs.vercel.app/docs/protocol

The SDK sends protocol v1 envelopes containing `occurrences`, `meters`, and `health` arrays. The body limit is 1 MiB. A batch accepts at most 100 occurrences, 500 meter events, and 100 health samples.

Invalid envelopes are rejected atomically with HTTP 400. Successful ingestion returns HTTP 202. Meter IDs are idempotency keys, so retries do not double-count exact usage.

Occurrences carry W3C-compatible trace, span, and optional parent identifiers. Sightglass reconstructs distributed operation trees from correlated occurrences and includes database and outbound dependency children in the detail view.
