import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Database, Gauge, LockKeyhole, ScanSearch } from "lucide-react";
import { CodeTabs } from "@/components/kit/CodeTabs";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { BrandIcon } from "@/components/site/BrandIcon";
import { TechnologyStrip } from "@/components/site/TechnologyStrip";
import { B } from "@/lib/brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${B.name} — opt-in observability for Node.js apps` },
      {
        name: "description",
        content: `${B.positioning} Self-host one container, instrument the operations that matter, and meter usage durably.`,
      },
      { property: "og:title", content: `${B.name} — ${B.tagline}` },
      { property: "og:description", content: B.positioning },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: `${B.name} — ${B.tagline}` },
      { name: "twitter:description", content: B.positioning },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: B.name,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Linux, macOS, Windows (Docker)",
          description: B.positioning,
          url: B.docsUrl,
        }),
      },
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
          <div className="mx-auto grid min-w-0 max-w-6xl gap-10 px-5 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:py-24">
            <div className="min-w-0">
              <div className="mb-5 inline-flex max-w-full flex-wrap items-center gap-2 border border-primary/30 bg-primary/5 px-2.5 py-1 font-mono text-[11px] text-primary">
                <span className="size-1.5 rounded-full bg-primary" />
                Node.js · TypeScript · self-hosted
              </div>
              <h1 className="max-w-2xl text-3xl font-semibold leading-[1.12] tracking-tight sm:text-5xl">
                Application observability for developers who do not want an observability stack.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Mark the operations that matter. Sightglass shows what happened, why it failed,
                which database or outbound call was slow, and what each customer used—without
                collecting everything else.
              </p>
              <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
                <Link
                  to="/docs/$slug"
                  params={{ slug: "quickstart" }}
                  className="inline-flex min-w-0 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground"
                >
                  Start the quickstart <ArrowRight className="size-4" />
                </Link>
                <a
                  href="https://github.com/bazokhan/sightglass"
                  className="inline-flex min-w-0 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-center text-sm font-medium text-foreground hover:border-primary/40"
                >
                  <BrandIcon name="github" className="size-4" />
                  View on GitHub
                </a>
              </div>
              <p className="mt-5 font-mono text-[11px] text-muted-foreground">
                One container. Explicit SDK calls. Your infrastructure.
              </p>
            </div>
            <CodeTabs
              className="min-w-0 max-w-full"
              tabs={[
                {
                  label: "Core",
                  filename: "checkout.ts",
                  code: `export const checkout = observe("checkout", async () => {\n  observe.set({ tenantId, plan: "pro" });\n  const order = await observe.step("create-order", createOrder);\n  observe.meter("orders.created", 1, { tenantId });\n  return order;\n});`,
                },
                {
                  label: "Docker",
                  filename: "terminal",
                  code: `docker run -d --name sightglass \\\n  -p 7777:7777 \\\n  -v sightglass-data:/data \\\n  -e SIGHTGLASS_INSECURE_HTTP=true \\\n  bazokhan/sightglass:latest`,
                },
              ]}
            />
          </div>
        </section>
        <TechnologyStrip />
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
        <section className="border-b border-border bg-surface/20">
          <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
                The answers are already connected
              </p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                From a slow operation to the exact step, query, and customer impact.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Sightglass keeps business context beside runtime evidence, so you can investigate
                without stitching together logs, traces, and billing exports.
              </p>
            </div>
            <ProductShot
              src="/product/operations.svg"
              alt="Sightglass operations dashboard showing execution volume, latency, and errors"
              eyebrow="Know where to look"
              title="A calm overview of only the operations you chose to observe."
              copy="Compare volume, tail latency, and errors without building queries or maintaining dashboards."
              priority
            />
            <ProductShot
              src="/product/occurrence.svg"
              alt="Sightglass occurrence detail showing context, steps, a Prisma query, and a usage event"
              eyebrow="Explain what happened"
              title="Every occurrence tells one coherent story."
              copy="See bounded business context, steps, database work, outbound calls, events, and the final outcome in execution order."
              reverse
            />
            <ProductShot
              src="/product/meters.svg"
              alt="Sightglass usage meter ledger showing per-tenant product usage"
              eyebrow="Meter with evidence"
              title="Durable usage records stay tied to the work that produced them."
              copy="Use idempotent meters for billing and limits, then move directly from an aggregate to its supporting executions."
            />
            <p className="mt-5 text-center font-mono text-[10px] text-muted-foreground">
              Product renders use representative sample data.
            </p>
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
                "One SQLite server with a signed-in, opinionated dashboard",
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

function ProductShot({
  src,
  alt,
  eyebrow,
  title,
  copy,
  reverse = false,
  priority = false,
}: {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  copy: string;
  reverse?: boolean;
  priority?: boolean;
}) {
  return (
    <article
      className={`mt-12 grid min-w-0 gap-6 lg:grid-cols-[1.55fr_0.75fr] lg:items-center ${
        reverse ? "lg:[&>div]:order-first lg:[&>figure]:order-last" : ""
      }`}
    >
      <figure className={reverse ? "lg:order-2" : ""}>
        <div className="overflow-hidden rounded-lg border border-border bg-background shadow-2xl shadow-black/20">
          <img
            src={src}
            alt={alt}
            className="block h-auto w-full"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
          />
        </div>
      </figure>
      <div className={reverse ? "lg:order-1" : ""}>
        <p className="font-mono text-[11px] uppercase tracking-wider text-primary">{eyebrow}</p>
        <h3 className="mt-2 text-xl font-semibold">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p>
      </div>
    </article>
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
