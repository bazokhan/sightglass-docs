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
                <span className="size-1.5 rounded-full bg-primary" /> Node.js · TypeScript · self-hosted
              </div>
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                Application observability for developers who don’t want an observability stack.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Mark the operations that matter. {B.name} shows what happened, why it failed, which
                query was slow, and what each customer used—without collecting everything else.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/demo" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
                  Explore the live demo <ArrowRight className="size-4" />
                </Link>
                <Link to="/docs/$slug" params={{ slug: "quickstart" }} className="inline-flex items-center rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary/40">
                  Read the quickstart
                </Link>
              </div>
              <p className="mt-5 font-mono text-[11px] text-muted-foreground">One container. One SDK. Your infrastructure.</p>
            </div>
            <ProductPreview />
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <p className="font-mono text-[11px] uppercase tracking-wider text-primary">A narrower model</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-semibold tracking-normal">Start with the questions your team actually asks.</h2>
            <div className="mt-8 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
              <Feature icon={ScanSearch} title="Observed operations" copy="Explicitly mark checkout, report generation, or any workflow worth understanding." />
              <Feature icon={Database} title="Query attribution" copy="See database cost inside the operation that caused it, not in an isolated query list." />
              <Feature icon={Gauge} title="Durable metering" copy="Record product usage alongside execution context, safely and exactly once." />
              <Feature icon={LockKeyhole} title="Useful security signal" copy="Surface auth failures and explicit security events on marked routes only." />
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-surface/30">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-primary">Deliberately opt-in</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal">Observe one operation, not the whole world.</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Add business context, meaningful steps, events, and meters where they belong. Unmarked code stays invisible.</p>
              <ul className="mt-5 space-y-2 text-sm text-foreground/85">
                {["NestJS, Express, tsoa and Next.js", "Prisma and native fetch attribution", "No agents, query language, or dashboard builder"].map((item) => <li key={item} className="flex items-center gap-2"><Check className="size-3.5 text-ok" />{item}</li>)}
              </ul>
            </div>
            <CodeTabs tabs={[
              { label: "NestJS", filename: "checkout.controller.ts", code: `@Observe('checkout', {\n  context: ({ user }) => ({ tenantId: user.tenantId })\n})\n@Post('/checkout')\nasync checkout() {\n  return this.checkoutService.run();\n}` },
              { label: "Function", filename: "generate.ts", code: `return observe('ai.generate', async (op) => {\n  const response = await op.step('llm.call', generate);\n  op.meter('ai.tokens', response.usage.totalTokens);\n  return response;\n});` },
            ]} />
          </div>
        </section>

        <section>
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-14 sm:flex-row sm:items-center">
            <div><h2 className="text-xl font-semibold">See the complete Acme Cloud dataset.</h2><p className="mt-1 text-sm text-muted-foreground">Deterministic, fictional data. Every screen works.</p></div>
            <Link to="/demo" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Open live demo <ArrowRight className="size-4" /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Feature({ icon: Icon, title, copy }: { icon: typeof ScanSearch; title: string; copy: string }) {
  return <article className="bg-background p-5"><Icon className="size-5 text-primary" /><h3 className="mt-4 text-sm font-semibold">{title}</h3><p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{copy}</p></article>;
}

function ProductPreview() {
  const rows = [["checkout", "3,241", "4.8%", "1.80s"], ["ai.generate", "14,281", "0.6%", "2.94s"], ["report.generate", "2,881", "1.1%", "8.21s"]];
  return <div className="overflow-hidden rounded-md border border-border bg-surface shadow-2xl shadow-background"><div className="flex items-center justify-between border-b border-border px-4 py-3"><span className="font-mono text-xs font-medium">Acme Cloud / operations</span><span className="font-mono text-[10px] text-ok">● production</span></div><div className="grid grid-cols-3 gap-px border-b border-border bg-border"><PreviewStat label="Occurrences" value="18.4k" /><PreviewStat label="Error rate" value="1.7%" /><PreviewStat label="p95" value="482ms" /></div><div className="p-3"><div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-2 pb-2 font-mono text-[9px] uppercase text-muted-foreground"><span>Operation</span><span>Calls</span><span>Errors</span><span>p95</span></div>{rows.map((row, index) => <div key={row[0]} className="grid grid-cols-[1fr_auto_auto_auto] gap-3 border-t border-border/60 px-2 py-3 font-mono text-[11px]"><span className="text-primary">{row[0]}</span><span className="num w-12 text-right">{row[1]}</span><span className={`num w-9 text-right ${index === 0 ? "text-danger" : "text-muted-foreground"}`}>{row[2]}</span><span className="num w-10 text-right">{row[3]}</span></div>)}</div></div>;
}

function PreviewStat({ label, value }: { label: string; value: string }) { return <div className="bg-surface px-4 py-3"><div className="text-[9px] uppercase text-muted-foreground">{label}</div><div className="num mt-1 text-lg">{value}</div></div>; }
