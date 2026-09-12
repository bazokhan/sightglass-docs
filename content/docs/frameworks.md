---
slug: frameworks
title: Framework adapters
summary: Instrument Express, tsoa, Fastify, NestJS, Next.js Route Handlers, and Prisma.
group: SDKs
order: 30
---

Every adapter depends on `@sightglass/core`. Install only the adapter your application uses.

## Express and tsoa

```ts
import { configureSightglass, observe as sightglass } from "@sightglass/core";
import { observe } from "@sightglass/express";

configureSightglass({ service: "billing-api", endpoint: "http://sightglass:7777" });
app.post("/checkout", observe("checkout"), async (request, response) => {
  sightglass.set({ tenantId: request.user.tenantId });
  response.sendStatus(201);
});
```

The `@Observe()` method decorator from `@sightglass/express` also supports tsoa controllers. Pair it with selected Express middleware when route or response status metadata is needed.

## Fastify

```ts
import { observe, sightglass } from "@sightglass/fastify";

await app.register(sightglass({ service: "billing-api", endpoint: "http://sightglass:7777" }));
app.post("/checkout", {
  handler: observe("checkout", async (_request, reply) => reply.code(201).send()),
});
```

## NestJS

Import `SightglassModule.forRoot(...)`, decorate a controller or method with `@Observe("name")`, and use `@NoObserve()` for exclusions. The module registers the interceptor globally and drains telemetry during application shutdown.

## Next.js

```ts
import { observe } from "@sightglass/next";

export const POST = observe("checkout", async () => Response.json({ ok: true }));
```

Only server Route Handlers are supported. Page rendering, React Server Components, static assets, prefetching, browser activity, and Server Actions are not observed.

## Prisma

```ts
import { withSightglass } from "@sightglass/prisma";
const prisma = withSightglass(new PrismaClient());
```

The extension records model/action timing inside an active operation. It never stores SQL, bind parameters, or results.
