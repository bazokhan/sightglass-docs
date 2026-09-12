# Sightglass: Observability without noise

Build a polished, production-quality product website and interactive dashboard demo for a fictional but fully-realized developer tool called **Intent** (working name; structure the code so the name can be changed globally later). Treat the product as if it already exists. The purpose is validation: I want to show this to developer friends and get feedback before building the backend product itself.

## PRODUCT THESIS
Intent is **application observability for developers who don't want an observability stack**.

Tagline: **Mark what matters. We show you what happened.**

This is NOT a general observability platform. It is intentionally opinionated, lightweight, opt-in, and focused on the 90% of application/debugging/business usage questions an ordinary backend developer actually asks.

Core philosophy:
- **Nothing is observed by default.**
- Developers explicitly mark meaningful API operations, jobs, or workflows.
- Only during those marked operations does Intent automatically collect obvious technical context.
- It stores one compact, information-dense **Observed Operation** rather than treating logs, metrics, and traces as separate primary products.
- Business context and meaningful events are explicit.
- Billable/commercial usage is explicit and durable.
- Everything irrelevant stays invisible.
- One SDK. One server. One database file. No observability stack.
- If a power user needs arbitrary telemetry exploration, Kubernetes observability, full log management, PromQL, dashboards, session replay, etc., they should use Datadog/Grafana/Honeycomb/etc.

## SUPPORTED STACKS FOR NOW
Only support what the founder actually uses:
- NestJS
- Express
- tsoa on Express
- Next.js (mainly App Router route handlers; optionally note future Server Actions)
- Node/TypeScript only
- Prisma should be treated as a first-class integration for database timing.
- Native `fetch` / outbound HTTP should be automatically timed and correlated while inside an observed operation.

Do NOT present Intent as language-agnostic today. The narrow Node/TS support is intentional.

## DATA MODEL / MENTAL MODEL
The primary primitive is an **Observed Operation**.

An operation can contain:
- id
- operation name
- timestamp
- duration
- status/result
- service
- environment
- tenant/customer id
- user id
- HTTP method + route if applicable
- meaningful attributes/context
- important events
- database summary: query count, total DB time, slowest DB calls
- outbound dependency calls and durations
- distributed request correlation across supported services
- error information
- optional usage meter entries
- optional lightweight infra snapshot (CPU/RAM/event-loop lag/uptime)

The product does NOT separately foreground logs/metrics/traces. The UI derives useful views from operations.

Internally/semantically think of only three data classes:
1. **Occurrence** = one observed execution
2. **Aggregate** = precomputed stats for dashboards
3. **Meter** = exact durable usage records

## SDK / DEVELOPER EXPERIENCE
Keep the public API extremely small and opinionated. Use only these concepts:

1. `observe()` / framework decorator/wrapper = “this operation matters”
2. `observe.set()` = attach small searchable business context
3. `observe.event()` = meaningful occurrence inside the operation
4. `observe.meter()` = exact durable usage amount
5. `observe.step()` = optional manual child timing, only when genuinely useful

### Nest example
```ts
@Module({
  imports: [
    IntentModule.forRoot({
      service: "billing-api",
      endpoint: "http://intent:7777"
    })
  ]
})
export class AppModule {}
```

Then:
```ts
@Observe()
@Post("checkout")
checkout() {}
```

Support controller-level opt-in conceptually:
```ts
@Observe()
@Controller("billing")
export class BillingController {}
```

Optionally show `@NoObserve()` for exclusions in docs.

### Express example
```ts
app.post("/checkout", observe(), checkoutHandler)
```

or semantic naming:
```ts
app.post("/checkout", observe("checkout.purchase"), checkoutHandler)
```

### tsoa example
Show the ergonomic intended API:
```ts
@Observe()
@Post("checkout")
public async checkout() {}
```
Mention it runs on the Express adapter underneath.

### Next.js example
Setup:
```ts
// instrumentation.ts
export { register } from "@intent/next"
```

Route handler:
```ts
export const POST = observe("checkout", async (req) => {
  // ...
})
```

No page renders, favicon requests, RSC noise, static assets, prefetches, etc. Nothing is observed unless explicitly wrapped.

### Example enrichment
```ts
@Observe()
@Post("generate")
async generate() {
  observe.set({
    tenantId: this.tenant.id,
    plan: "pro"
  })

  const result = await observe.step(
    "llm.call",
    () => this.ai.generate()
  )

  observe.event("generation.completed", {
    model: result.model
  })

  observe.meter("ai.tokens", result.tokens)

  return result
}
```

Rules:
- `observe.set()` only accepts small primitive searchable values such as string/number/boolean/IDs/enums. No arbitrary huge JSON blobs.
- Events are semantic, not a replacement for debug logging.
- Meter names should be centrally defined/configured.

## AUTOMATIC ENRICHMENT — ONLY INSIDE OBSERVED OPERATIONS
While an observed operation is active, automatically capture only obvious, useful technical context:
- duration
- HTTP status
- thrown exception
- route/method
- outbound `fetch` duration
- downstream correlation header / W3C trace context
- Prisma database timing/query count/slow calls
- perhaps Redis later, but do not make it central in the current demo

If a request is not observed, all of this should effectively stay silent.

Important philosophy sentence to feature prominently in docs:
**Automatic instrumentation is allowed only when it enriches an explicitly observed operation.**

## USAGE / METERING
Usage is first-class but NOT full billing software.

Promise:
**Billing-grade usage metering, not billing.**

Example:
```ts
observe.meter("ai.tokens", 1842)
```

Meters are exact/durable and can later be exported to Stripe, Metronome, OpenMeter, or a custom invoicing system.

Meters should conceptually have:
- unique event id / idempotency
- tenant/customer
- meter name
- quantity
- timestamp

Do not imply that sampled observability telemetry is used for billing. Usage metering has stronger durability guarantees.

## DEFAULT LIGHTWEIGHT DEPLOYMENT
Show deployment as intentionally tiny:

```text
App(s) -> Intent -> one local data file
```

Default product architecture concept:
- one binary/container
- one port
- one volume
- embedded SQLite initially
- no Redis
- no Kafka
- no ClickHouse
- no PostgreSQL
- no Grafana
- no Prometheus
- no OTel Collector

A future large-scale external backend may be possible, but it is NOT part of the positioning and should not distract from the demo.

Show a Docker example such as:
```bash
docker run -d \
  -p 7777:7777 \
  -v intent-data:/data \
  intenthq/intent
```

The dashboard is served by the same container.

## DASHBOARD PHILOSOPHY
The dashboard must be **one fixed, highly opinionated product UI**.

NO:
- dashboard builder
- arbitrary widgets
- query language
- PromQL
- SQL console
- custom visualizations
- log explorer
- “choose your visualization” UX

The product knows the common questions and directly answers them.

Main navigation should be roughly:
- Overview
- Operations
- Queries
- Usage
- Security
- Health
- Docs / Setup

Do not add a generic Logs page. Meaningful events appear inside operation details. Ordinary stdout logs remain ordinary application logs.

## DASHBOARD DEMO — MUST BE INTERACTIVE AND REALISTIC
Build a fully interactive seeded demo for a fictional SaaS app called **Acme Cloud** with at least these services:
- api
- billing-api
- worker

Seed enough realistic data to make the interface useful. No real backend is required; static/mock data in TypeScript is fine. Use deterministic seeded data rather than random values that change on refresh.

### Overview page
The top should immediately answer “does anything need my attention?”

Example content, polish as needed:
- environment selector: Production
- time range: Last 24h
- 18,429 observed operations
- 1.7% errors
- p95 482 ms
- service health summary
- needs attention cards
- unauthorized attempt summary
- business usage summary

Example problem cards:
1. `checkout` — 4.8% errors, p95 1.8s
2. `report.generate` — p95 8.2s, DB accounts for 71%
3. unauthorized attempts — 73, mostly POST /admin/export

Usage examples:
- AI Generate: 14,281 calls / 28.4M tokens
- PDF Export: 2,881 exports
- SMS: 918 messages

### Operations page
Table columns:
- operation
- calls
- errors
- p95
- DB
- usage if relevant

Seed rows such as:
- checkout
- ai.generate
- report.generate
- subscription.change
- admin.export

Clicking an operation opens a details page or side panel with:
- calls
- error %
- p50/p95/p99
- top failures
- time spent breakdown
- recent/slowest occurrences
- business context breakdown where useful

### Occurrence / Trace detail
This is the most important debugging screen.
Render a compact distributed timeline/tree, for example:

checkout 842ms ERROR
├── inventory.reserve 102ms
│   └── Prisma inventory.update 61ms
└── payment.authorize 493ms
    └── Stripe API 421ms

Show meaningful events inline, e.g.
- inventory.reserved
- payment.declined

Show context such as tenant, user, plan, service, route, request id.

Do NOT call this a generic “trace explorer”. Make it feel like “what happened to this operation?”

### Queries page
Focused on database questions developers care about.
Columns:
- query / Prisma operation
- calls
- avg
- p95
- total time
- top calling operation

Examples:
- Order.findMany
- Inventory.update
- Report.findMany complex
- User.findUnique

Click one to show which observed operations caused it and slow occurrences.

Do NOT display raw sensitive SQL parameters by default.

### Usage page
This page must visually separate product/business usage from technical monitoring.
Show exact durable meters by tenant and feature.

Meters:
- ai.tokens
- pdf.exports
- sms.sent

Include:
- today / month totals
- tenant breakdown
- top customers
- quota/limit progress examples
- a subtle badge/text explaining “exact metered usage”

Use language like “billing-grade usage metering, not billing.”

### Security page
Keep intentionally narrow:
- unauthorized 401 attempts
- forbidden 403 attempts
- explicitly reported security events
- top routes
- top tenants/users/IPs if available
- recent occurrences

Do NOT make this look like a SIEM.

### Health page
Extremely simple.
For each service show:
- healthy / degraded
- CPU
- memory
- uptime
- event-loop lag
- restart count

Maybe disk at the host level.

No infrastructure topology maps or Prometheus-style dashboards.

## MARKETING / LANDING PAGE
Create a convincing product landing page for technical founders/backend developers.

Tone:
- confident
- technical
- restrained
- slightly contrarian toward overbuilt observability
- not gimmicky
- no fake enterprise buzzword soup

Hero:
**Application observability for developers who don't want an observability stack.**
**Mark what matters. We show you what happened.**

Primary CTA: `Open live demo`
Secondary CTA: `Read the docs`

Show a concise installation code snippet above the fold if it fits.

Sections should communicate:
1. The problem: modern observability often starts by collecting everything and makes developers pay operational/storage complexity for signals they never use.
2. The Intent approach: explicit opt-in operations.
3. “One operation, one useful record” / wide-event concept.
4. Automatic enrichment only inside observed operations.
5. Debug + measure + operate as the three user goals.
6. Billing-grade usage metering without becoming a billing platform.
7. Single-container deployment.
8. Supported stack cards: NestJS, Express/tsoa, Next.js, Prisma.
9. A strong “what Intent deliberately does not do” section.
10. Dashboard preview screenshots/components using the actual demo UI.
11. Final CTA.

Avoid positioning as “cheaper Datadog”. It is a fundamentally smaller, more intentional category.

## DOCUMENTATION
Build a polished docs area integrated into the site.

Docs IA should include at minimum:
- Introduction
- Philosophy
- Quickstart
- NestJS
- Express
- tsoa
- Next.js
- Prisma
- Operations
- Context (`set`)
- Events
- Metering
- Distributed operations / request propagation
- Security & privacy
- Deployment
- Retention
- What Intent is not

The docs should be genuinely useful and detailed enough that a developer can understand the imagined product without asking questions.

Important documentation principles:
- Nothing observed by default.
- An observed operation is the primary unit.
- Meaningful events, not noisy logs.
- Usage metering is exact and durable.
- Default privacy: sensitive query params/request bodies/authorization headers are NOT captured.
- Automatic technical enrichment only inside active operations.

## RETENTION / STORAGE POSITIONING
Use sane defaults in the imagined product:
- raw successful occurrences: 7 days
- raw errors: 30 days
- hourly aggregates: 12 months
- usage meter ledger: retained indefinitely by default or explicitly configurable

Explain that aggregates allow long-term trends without retaining huge raw telemetry volume.

## DESIGN DIRECTION
The visual design should feel like a premium developer tool: somewhere between Linear, Vercel, Stripe developer products, and a focused infrastructure tool — but do not clone any of them.

Requirements:
- desktop-first but responsive
- excellent dark mode as the default visual identity; light mode optional only if easy
- very strong information hierarchy
- dense enough for technical data, but calm, not Grafana-like
- restrained accent color
- crisp tables
- monospace only where appropriate
- minimal rounded-card spam
- no giant gradient blobs
- no generic AI-generated SaaS aesthetic
- no fake 3D infrastructure illustrations
- use subtle diagrams built from HTML/CSS/SVG where useful

The dashboard should feel **finished**, not like a template.

## ROUTES / SITE STRUCTURE
Suggested routes:
- `/` marketing landing page
- `/docs`
- `/docs/...`
- `/demo` dashboard overview
- `/demo/operations`
- `/demo/operations/:id`
- `/demo/occurrences/:id`
- `/demo/queries`
- `/demo/usage`
- `/demo/security`
- `/demo/health`

Use a clear navbar that lets visitors switch between Product, Docs, and Live Demo.

## INTERACTIVITY
The demo should feel real:
- operation rows clickable
- filters for time range/service/environment where sensible
- data changes consistently when selecting filters (can be mocked)
- occurrence details clickable
- docs code tabs for Nest/Express/tsoa/Next where useful
- copy buttons on code snippets
- responsive navigation

Do not overbuild authentication or databases. This is a validation prototype/site, not the actual product backend.

## PRODUCT BOUNDARIES — IMPORTANT
Explicitly include this product doctrine somewhere in the site/docs:

Intent is NOT:
- a log management system
- a general metrics database
- a customizable dashboard platform
- Kubernetes observability
- infrastructure management
- browser session replay
- product analytics
- incident management
- a SIEM
- a billing platform
- a data warehouse

It answers:
- Is my application behaving correctly?
- If not, where did this important operation go wrong?
- What is slow?
- Which database/dependency is responsible?
- Who is using which important capability, and how much?
- Are unauthorized requests happening?
- Is the machine obviously unhealthy?

## IMPLEMENTATION GUIDANCE FOR THIS LOVABLE PROJECT
- This project is a product validation website/demo, not the real Intent server.
- Use mock deterministic data and frontend state.
- Do not waste effort provisioning Supabase unless absolutely needed. Prefer a self-contained frontend demo.
- Build all major pages now, not just a hero page.
- Keep shared data/types/components clean so the demo can be extended.
- Make reasonable product/design decisions autonomously rather than stopping for questions.
- If something conflicts, prioritize in this order: 1) intentional opt-in philosophy, 2) ease of use, 3) lightweight product feel, 4) realistic developer usefulness, 5) visual polish.

Most importantly: **preserve the narrowness. Do not add generic observability-platform features because they are common in competitors. The limitations are the product.**

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9ef5cc53-dbc9-4197-9e84-54cce81b7ddc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
