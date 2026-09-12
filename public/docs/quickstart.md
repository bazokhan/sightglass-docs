# Quickstart

Run Sightglass and observe one important operation in a few minutes.

Canonical HTML: https://sightglass-docs.vercel.app/docs/quickstart

Sightglass is one container plus the SDK packages your application needs. Installing an SDK is silent until you explicitly wrap an operation.

![Sightglass operations dashboard with sample execution, latency, and error data](/product/operations.svg)

## Run the server

```bash
docker run -d --name sightglass \
  -p 7777:7777 \
  -v sightglass-data:/data \
  -e SIGHTGLASS_API_KEY=replace-me \
  bazokhan/sightglass:0.1.0
```

Open `http://localhost:7777`. Keep this port on a trusted network because the API key protects ingestion, not dashboard reads.

## Install the SDK

For plain Node.js, install core:

```bash
npm install @bazokhan/sightglass-core
```

For a framework, install core and the adapter, for example:

```bash
npm install @bazokhan/sightglass-core @bazokhan/sightglass-express
```

## Configure once

```ts
import { configureSightglass } from "@bazokhan/sightglass-core";

configureSightglass({
  service: "billing-api",
  environment: "production",
  endpoint: "http://sightglass:7777",
  apiKey: process.env.SIGHTGLASS_API_KEY,
});
```

## Observe one operation

```ts
import { observe } from "@bazokhan/sightglass-core";

const checkout = observe("checkout", async () => {
  observe.set({ tenantId: "tenant-42", plan: "pro" });
  const order = await observe.step("create-order", createOrder);
  observe.event("order.created", { orderId: order.id });
  return order;
});

const result = await checkout();
```

Unwrapped work stays invisible. Before process exit, stop accepting work and call `await shutdownSightglass()` to drain buffered telemetry.
