import { B } from "@/lib/brand";

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "note"; text: string }
  | { type: "code"; filename?: string; code: string };

export interface DocPage {
  slug: string;
  title: string;
  summary: string;
  group: string;
  blocks: Block[];
}

export const docGroups = ["Getting started", "Frameworks", "Concepts", "Operating"];

export const docs: DocPage[] = [
  {
    slug: "quickstart",
    title: "Quickstart",
    group: "Getting started",
    summary: `Run ${B.name} and instrument your first operation in about five minutes.`,
    blocks: [
      {
        type: "p",
        text: `${B.name} is one container and one SDK. It stores data in a single embedded database file. There is no collector, no agent sidecar, and no sampling pipeline to reason about.`,
      },
      { type: "h", text: "1. Run the server" },
      {
        type: "code",
        filename: "docker-compose.yml",
        code: `services:
  intent:
    image: ${B.dockerImage}:latest
    ports:
      - "${B.port}:${B.port}"
    environment:
      INTENT_TOKEN: dev-token
      INTENT_RETENTION_DAYS: 14
    volumes:
      - intent-data:/data

volumes:
  intent-data:`,
      },
      {
        type: "p",
        text: `The dashboard is served on http://localhost:${B.port}. The same process receives ingest and serves the UI.`,
      },
      { type: "h", text: "2. Install the SDK" },
      {
        type: "code",
        filename: "shell",
        code: `npm install ${B.npmPackage}`,
      },
      { type: "h", text: "3. Initialise once at startup" },
      {
        type: "code",
        filename: "src/intent.ts",
        code: `import { init } from "${B.npmPackage}";

init({
  endpoint: process.env.INTENT_ENDPOINT ?? "http://localhost:${B.port}",
  token: process.env.INTENT_TOKEN!,
  service: "billing-api",
  environment: process.env.NODE_ENV === "production" ? "production" : "staging",
});`,
      },
      { type: "h", text: "4. Mark one operation" },
      {
        type: "code",
        filename: "src/billing.controller.ts",
        code: `import { observe, attr, meter } from "${B.npmPackage}";

export const checkout = observe("checkout", async (req) => {
  attr({ cartValue: req.body.total, itemCount: req.body.items.length });

  const order = await createOrder(req.body);
  meter("orders.created", 1);

  return order;
});`,
      },
      {
        type: "note",
        text: "Nothing else in your app is recorded. Until you mark a second operation, the dashboard shows exactly one.",
      },
      { type: "h", text: "What you get immediately" },
      {
        type: "list",
        items: [
          "Call count, error rate and p50/p95/p99 for the operation",
          "A time breakdown of the steps inside it, including database time",
          "Every failed occurrence with its attributes, events and stack location",
          "The `orders.created` meter, per tenant, if you set a tenant context",
        ],
      },
    ],
  },
  {
    slug: "concepts",
    title: "Core concepts",
    group: "Getting started",
    summary: "Operations, occurrences, attributes, events and meters — five ideas, nothing else.",
    blocks: [
      { type: "h", text: "Operation" },
      {
        type: "p",
        text: "A named unit of work you explicitly marked: a route handler, a job, a scheduled task, a use case. Operations are the only thing aggregated. If it is not marked, it does not exist.",
      },
      { type: "h", text: "Occurrence" },
      {
        type: "p",
        text: "One execution of an operation. It carries a duration, a status, the attributes you attached, the events you emitted, database calls and outbound dependency calls.",
      },
      { type: "h", text: "Attribute" },
      {
        type: "p",
        text: "A business-meaningful key/value attached to the current occurrence. Attributes make occurrences searchable in your own language: plan, tenant, cartValue, region.",
      },
      { type: "h", text: "Event" },
      {
        type: "p",
        text: "A timestamped moment inside an occurrence: payment.declined, retry.scheduled, cache.miss. Events give a failure its narrative.",
      },
      { type: "h", text: "Meter" },
      {
        type: "p",
        text: "A countable business quantity emitted during an operation — tokens, exports, messages. Meters are aggregated per tenant and per month so you can bill or enforce quotas from the same instrumentation.",
      },
      {
        type: "code",
        filename: "usage.ts",
        code: `import { observe, attr, event, meter, tenant } from "${B.npmPackage}";

export const generate = observe("ai.generate", async (input) => {
  tenant(input.tenantId);                 // scopes attributes and meters
  attr({ model: "gpt-4o-mini", prompt: input.kind });

  const res = await callModel(input);
  event("model.completed", { finishReason: res.finishReason });
  meter("ai.tokens", res.usage.totalTokens);

  return res;
});`,
      },
    ],
  },
  {
    slug: "nestjs",
    title: "NestJS",
    group: "Frameworks",
    summary: "Decorator-based instrumentation with an interceptor and a Prisma extension.",
    blocks: [
      {
        type: "code",
        filename: "app.module.ts",
        code: `import { IntentModule } from "${B.npmScope}/nestjs";

@Module({
  imports: [
    IntentModule.forRoot({
      endpoint: process.env.INTENT_ENDPOINT!,
      token: process.env.INTENT_TOKEN!,
      service: "api",
    }),
  ],
})
export class AppModule {}`,
      },
      {
        type: "code",
        filename: "billing.controller.ts",
        code: `import { Observe, Attr, Meter } from "${B.npmScope}/nestjs";

@Controller("checkout")
export class BillingController {
  @Post()
  @Observe("checkout")
  async checkout(@Body() dto: CheckoutDto) {
    Attr({ cartValue: dto.total, currency: dto.currency });
    const order = await this.billing.checkout(dto);
    Meter("orders.created", 1);
    return order;
  }
}`,
      },
      { type: "h", text: "Prisma query attribution" },
      {
        type: "code",
        filename: "prisma.service.ts",
        code: `import { intentPrisma } from "${B.npmScope}/prisma";

export const prisma = new PrismaClient().$extends(intentPrisma());`,
      },
      {
        type: "note",
        text: "Queries are only recorded when they run inside a marked operation. A query from an unmarked endpoint is ignored.",
      },
    ],
  },
  {
    slug: "nextjs",
    title: "Next.js",
    group: "Frameworks",
    summary: "Wrap server actions and route handlers. No client-side instrumentation.",
    blocks: [
      {
        type: "code",
        filename: "app/api/checkout/route.ts",
        code: `import { observe } from "${B.npmScope}/next";

export const POST = observe("checkout", async (req: Request) => {
  const body = await req.json();
  return Response.json(await checkout(body));
});`,
      },
      {
        type: "code",
        filename: "app/actions.ts",
        code: `"use server";
import { observe, attr } from "${B.npmScope}/next";

export const publishPost = observe("post.publish", async (id: string) => {
  attr({ postId: id });
  return db.post.update({ where: { id }, data: { published: true } });
});`,
      },
      {
        type: "note",
        text: `${B.name} never ships a browser bundle. There is no RUM, no session replay and no front-end error capture.`,
      },
    ],
  },
  {
    slug: "express",
    title: "Express & Fastify",
    group: "Frameworks",
    summary: "Explicit per-route wrapping — deliberately not blanket middleware.",
    blocks: [
      {
        type: "code",
        filename: "server.ts",
        code: `import { observe, attr } from "${B.npmPackage}";

app.post("/checkout", observe("checkout", async (req, res) => {
  attr({ tenant: req.auth.tenantId, cartValue: req.body.total });
  res.json(await checkout(req.body));
}));`,
      },
      {
        type: "p",
        text: "There is an app-wide middleware, but it is opt-in per route by design. Instrumenting everything at once produces the noise this product exists to avoid.",
      },
    ],
  },
  {
    slug: "metering",
    title: "Metering & quotas",
    group: "Concepts",
    summary: "Turn instrumentation you already have into per-tenant usage numbers.",
    blocks: [
      {
        type: "p",
        text: "A meter is a number emitted inside an operation. Because the operation already knows the tenant, usage rolls up per tenant, per plan and per month without a second system.",
      },
      {
        type: "code",
        filename: "meters.ts",
        code: `meter("ai.tokens", res.usage.totalTokens);
meter("pdf.exports", 1);
meter("sms.sent", recipients.length);`,
      },
      { type: "h", text: "Reading usage back" },
      {
        type: "code",
        filename: "quota.ts",
        code: `import { usage } from "${B.npmPackage}";

const used = await usage({ meter: "ai.tokens", tenant: tenantId, period: "month" });
if (used > plan.tokenQuota) throw new QuotaExceededError();`,
      },
      {
        type: "note",
        text: `${B.name} reports usage. It does not bill, invoice or price. Send the numbers to Stripe yourself.`,
      },
    ],
  },
  {
    slug: "what-intent-is-not",
    title: `What ${B.name} is not`,
    group: "Concepts",
    summary: "The limitations are the product. Here is what will never be added.",
    blocks: [
      {
        type: "p",
        text: `${B.name} watches the parts of your application you deliberately marked. Everything below is intentionally out of scope, and staying out of scope is what keeps the tool small enough to actually use.`,
      },
      {
        type: "list",
        items: [
          "Not infrastructure monitoring — no host metrics beyond the process running your service",
          "Not log aggregation — there is no log search, no ingest pipeline, no parsing rules",
          "Not APM auto-instrumentation — nothing is traced unless you marked it",
          "Not distributed tracing across an org — correlation is best-effort between your own services",
          "Not alerting-as-a-platform — no on-call rotations, escalation policies or incident management",
          "Not frontend monitoring — no RUM, no session replay, no browser SDK",
          "Not a metrics database — you cannot push arbitrary time series into it",
          "Not multi-tenant SaaS — you run it, your data stays in your database file",
        ],
      },
      {
        type: "note",
        text: "If you need those things, you need an observability stack. This is the tool for teams who have decided they don't.",
      },
    ],
  },
  {
    slug: "deployment",
    title: "Deployment",
    group: "Operating",
    summary: "One container, one volume, one port. Retention is a number of days.",
    blocks: [
      {
        type: "code",
        filename: "shell",
        code: `docker run -d \\
  -p ${B.port}:${B.port} \\
  -v intent-data:/data \\
  -e INTENT_TOKEN=$INTENT_TOKEN \\
  -e INTENT_RETENTION_DAYS=14 \\
  ${B.dockerImage}:latest`,
      },
      { type: "h", text: "Sizing" },
      {
        type: "list",
        items: [
          "~1 GB of storage per 10 million occurrences at default retention",
          "Single process, 2 vCPU and 2 GB RAM handles ~5k occurrences/second",
          "Backups are a file copy of /data/intent.db while the process is running",
        ],
      },
      { type: "h", text: "Configuration" },
      {
        type: "code",
        filename: ".env",
        code: `INTENT_TOKEN=…              # shared ingest + dashboard token
INTENT_RETENTION_DAYS=14    # occurrences older than this are dropped
INTENT_MAX_BODY_KB=32       # attribute payload ceiling per occurrence
INTENT_PUBLIC_URL=https://intent.internal.acme.dev`,
      },
    ],
  },
  {
    slug: "privacy",
    title: "Data & privacy",
    group: "Operating",
    summary: "Only marked operations leave your process, and only the attributes you name.",
    blocks: [
      {
        type: "list",
        items: [
          "No automatic capture of request bodies, headers or query strings",
          "Attributes are opt-in per key — nothing is inferred",
          "Redaction runs in-process before anything is sent over the wire",
          "Self-hosted: data never leaves the infrastructure you control",
        ],
      },
      {
        type: "code",
        filename: "redaction.ts",
        code: `init({
  redact: ["email", "phone", /token/i],
  onAttribute: (key, value) => (key === "cardLast4" ? "***" : value),
});`,
      },
    ],
  },
];

export function findDoc(slug: string): DocPage | undefined {
  return docs.find((d) => d.slug === slug);
}
