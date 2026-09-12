import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Database, Gauge, LockKeyhole, ScanSearch } from "lucide-react";
import { CodeTabs } from "@/components/kit/CodeTabs";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { B } from "@/lib/brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${B.name} — application observability without the stack` },
      { name: "description", content: B.positioning },
      { property: "og:title", content: `${B.name} — ${B.tagline}` },
      { property: "og:description", content: B.positioning },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="grid-bg border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:py-24">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-2.5 py-1 font-mono text-[11px] text-primary">
                <span className="size-1.5 rounded-full bg-primary" />
                Node.js · TypeScript · self-hosted
              </div>
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
                Application observability for developers who do not want an observability stack.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Mark the operations that matter. Sightglass shows what happened, why it failed,
                which database or outbound call was slow, and what each customer used—without
                collecting everything else.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/docs/$slug"
                  params={{ slug: "quickstart" }}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                >
                  Start the quickstart <ArrowRight className="size-4" />
                </Link>
                <a
                  href="https://github.com/bazokhan/sightglass"
                  className="inline-flex items-center rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary/40"
                >
                  View on GitHub
                </a>
              </div>
              <p className="mt-5 font-mono text-[11px] text-muted-foreground">
                One container. Explicit SDK calls. Your infrastructure.
              </p>
            </div>
            <CodeTabs
              tabs={[
                {
                  label: "Core",
                  filename: "checkout.ts",
                  code: `export const checkout = observe("checkout", async () => {\n  observe.set({ tenantId, plan: "pro" });\n  const order = await observe.step("create-order", createOrder);\n  observe.meter("orders.created", 1, { tenantId });\n  return order;\n});`,
                },
                {
                  label: "Docker",
                  filename: "terminal",
                  code: `docker run -d --name sightglass \\\n  -p 7777:7777 \\\n  -v sightglass-data:/data \\\n  sightglasshq/sightglass:0.1.0`,
                },
              ]}
            />
          </div>
        </section>
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
              A deliberately narrow model
            </p>
            <h2 className="mt-2 max-w-2xl text-2xl font-semibold">
              Start with the questions your team actually asks.
            </h2>
            <div className="mt-8 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
              <Feature
                icon={ScanSearch}
                title="Observed operations"
                copy="Explicitly mark checkout, reporting, or any workflow worth understanding."
              />
              <Feature
                icon={Database}
                title="Query attribution"
                copy="See Prisma cost inside the operation that caused it."
              />
              <Feature
                icon={Gauge}
                title="Durable metering"
                copy="Record exact idempotent product usage with execution context."
              />
              <Feature
                icon={LockKeyhole}
                title="Safe defaults"
                copy="Bodies, headers, cookies, SQL, and bind values are never captured automatically."
              />
            </div>
          </div>
        </section>
        <section className="bg-surface/30">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 lg:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
                Deliberately opt-in
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Observe one operation, not the whole world.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Unwrapped work stays invisible. Add bounded business context, meaningful events,
                steps, database attribution, outbound calls, and usage only where they matter.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-foreground/85">
              {[
                "Express and tsoa, Fastify, NestJS, and Next.js Route Handlers",
                "Prisma and native fetch attribution inside observed work",
                "One SQLite server and an opinionated read-only dashboard",
                "No daemon, external collector, query language, or dashboard builder",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-ok" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof ScanSearch;
  title: string;
  copy: string;
}) {
  return (
    <article className="bg-surface p-5">
      <Icon className="size-4 text-primary" />
      <h3 className="mt-4 text-sm font-medium">{title}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{copy}</p>
    </article>
  );
}
