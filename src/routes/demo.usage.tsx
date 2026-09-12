import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, Panel, Stat, TableShell, Tag } from "@/components/demo/primitives";
import { useFilters } from "@/components/demo/filters";
import { meters } from "@/data/seed";
import { compact, num, pct, scale } from "@/lib/format";
import { B } from "@/lib/brand";

export const Route = createFileRoute("/demo/usage")({
  head: () => ({ meta: [{ title: `Durable usage metering — ${B.name} demo` }, { name: "description", content: "Inspect durable product usage by meter, tenant, plan, and quota." }, { property: "og:title", content: `Usage metering — ${B.name}` }, { property: "og:description", content: "Product usage recorded with operation context." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: UsagePage,
});

function UsagePage() {
  const { factor } = useFilters();
  const [meterId, setMeterId] = useState(meters[0]?.id ?? "");
  const meter = meters.find(m => m.id === meterId) ?? meters[0];
  if (!meter) return null;
  const delta = (meter.month - meter.prevMonth) / meter.prevMonth;
  return <div className="space-y-4"><header><h1 className="text-[17px] font-semibold">Usage</h1><p className="mt-0.5 text-[12.5px] text-muted-foreground">Durable counters recorded inside successful operations—not reconstructed from logs.</p></header><div className="flex flex-wrap gap-1">{meters.map(m => <button key={m.id} type="button" onClick={() => setMeterId(m.id)} className={`rounded px-3 py-1.5 font-mono text-[11.5px] ${meter.id === m.id ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50"}`}>{m.meter}</button>)}</div><div className="grid gap-3 sm:grid-cols-3"><Stat label="Today" value={compact(scale(meter.today, factor))} hint={meter.unit} /><Stat label="This month" value={compact(meter.month)} hint={meter.unit} /><Stat label="vs last month" value={`${delta >= 0 ? "+" : ""}${pct(delta)}`} tone={delta > .25 ? "warn" : "ok"} hint={`${compact(meter.prevMonth)} previous`} /></div><Panel title={`${meter.label} by tenant`} subtitle={`Ledger meter: ${meter.meter}`} bodyClassName="px-0 py-0"><TableShell head={<><th className="px-4 py-2 font-medium">Tenant</th><th className="px-4 py-2 font-medium">Plan</th><th className="px-4 py-2 text-right font-medium">Quantity</th><th className="px-4 py-2 font-medium">Quota</th></>}>{meter.tenants.map(t => { const share = t.quota ? t.quantity / t.quota : 0; return <tr key={t.tenantId} className="border-b border-border/60 last:border-0"><td className="px-4 py-3"><div className="text-[12.5px]">{t.name}</div><div className="font-mono text-[10.5px] text-muted-foreground">{t.tenantId}</div></td><td className="px-4 py-3"><Tag>{t.plan}</Tag></td><td className="num px-4 py-3 text-right">{num(t.quantity)}</td><td className="px-4 py-3">{t.quota ? <div className="flex min-w-40 items-center gap-2"><Bar value={share} tone={share > .9 ? "danger" : share > .75 ? "warn" : "meter"} /><span className="num w-10 text-right text-[11px] text-muted-foreground">{pct(share,0)}</span></div> : <span className="text-[11px] text-muted-foreground">unlimited</span>}</td></tr>})}</TableShell></Panel><Panel title="Ledger semantics" subtitle="Why these numbers can support billing"><div className="grid gap-4 text-[12.5px] text-muted-foreground sm:grid-cols-3"><p><strong className="block text-foreground">Idempotent</strong>Retries do not double-count a meter entry.</p><p><strong className="block text-foreground">Contextual</strong>Tenant, operation, and occurrence remain linked.</p><p><strong className="block text-foreground">Durable</strong>Accepted entries survive process restarts.</p></div></Panel></div>;
}