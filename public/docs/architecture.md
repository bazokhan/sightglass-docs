# Architecture

See how explicit application instrumentation reaches the single-process SQLite server.

Canonical HTML: https://sightglass-docs.trugraph.io/docs/architecture

Sightglass has three runtime layers:

1. A framework adapter or `@bazokhan/sightglass-core` opens an explicit operation context with `AsyncLocalStorage`.
2. The SDK bounds and batches ordinary occurrences while durable meter events are first written to the local spool.
3. One Node.js server authenticates users and ingestion keys, validates protocol v1, writes SQLite in WAL mode, computes aggregates, and serves the React dashboard on port 7777.

There is no collector, host daemon, external queue, metrics database, dashboard builder, or query language. Database and native fetch attribution activate only within an observed operation.

The deployment boundary is one process, one port, one SQLite file, one persistent volume, and one container. SMTP and S3-compatible storage are optional outbound integrations configured by an administrator; neither is required for normal ingestion or dashboard use.
