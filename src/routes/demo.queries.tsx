import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, Panel, Stat, TableShell, Tag } from "@/components/demo/primitives";
import { useFilters } from "@/components/demo/filters";
import { queries } from "@/data/seed";
import { compact, ms, num, scale } from "@/lib/format";
import { B } from "@/lib/brand";

export const Route = createFileRoute("/demo/queries")({
  head: () => ({ meta: [{ title: `Query attribution — ${B.name} demo` }, { name: "description", content: "Database query cost attributed to the observed operations that caused it." }, { property: "og:title", content: `Query attribution — ${B.name}` }, { property: "og:description", content: "See slow Prisma queries in their application context." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: QueriesPage,
});

function QueriesPage() {
  const { factor } = useFilters();
  const [selected, setSelected] = useState(queries[0]?.id ?? "");
  const query = queries.find((item) => item.id === selected) ?? queries[0];
  const total = queries.reduce((sum, item) => sum + item.totalMs, 0);
  if (!query) return null;
  return <div className="space-y-4"><header><h1 className="text-[17px] font-semibold">Queries</h1><p className="mt-0.5 text-[12.5px] text-muted-foreground">Prisma work is attributed to the marked operation that caused it.</p></header><div className="grid gap-3 sm:grid-cols-3"><Stat label="Query calls" value={compact(scale(queries.reduce((s,q) => s + q.calls, 0), factor))} /><Stat label="Database time" value={ms(scale(total, factor))} /><Stat label="Slowest p95" value={ms(Math.max(...queries.map(q => q.p95Ms)))} tone="warn" /></div><div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]"><Panel title="Query inventory" subtitle="Select a row to inspect its callers" bodyClassName="px-0 py-0"><TableShell head={<><th className="px-4 py-2 font-medium">Query</th><th className="px-4 py-2 text-right font-medium">Calls</th><th className="px-4 py-2 text-right font-medium">Avg</th><th className="px-4 py-2 text-right font-medium">p95</th></>} >{queries.map(q => <tr key={q.id} onClick={() => setSelected(q.id)} className={`cursor-pointer border-b border-border/60 last:border-0 ${selected === q.id ? "bg-accent/60" : "hover:bg-accent/30"}`}><td className="px-4 py-2.5"><div className="font-mono text-[12px] text-primary">{q.name}</div><div className="text-[11px] text-muted-foreground">{q.kind}</div></td><td className="num px-4 py-2.5 text-right">{num(scale(q.calls, factor))}</td><td className="num px-4 py-2.5 text-right">{ms(q.avgMs)}</td><td className="num px-4 py-2.5 text-right">{ms(q.p95Ms)}</td></tr>)}</TableShell></Panel><div className="space-y-3"><Panel title={query.name} subtitle={query.note ?? `${query.model} · ${query.kind}`}><div className="space-y-3">{query.callers.map(c => <div key={c.operation}><div className="flex justify-between text-[12px]"><Link to="/demo/operations/$id" params={{ id: c.operation }} className="font-mono text-primary hover:underline">{c.operation}</Link><span className="num text-muted-foreground">{num(scale(c.calls, factor))}</span></div><Bar value={c.share} className="mt-1.5" /></div>)}</div></Panel><Panel title="Slowest occurrences">{query.slowest.map(s => <div key={`${s.occurrenceId}-${s.when}`} className="flex items-center justify-between border-b border-border/60 py-2 first:pt-0 last:border-0 last:pb-0"><div><Link to="/demo/occurrences/$id" params={{ id: s.occurrenceId }} className="font-mono text-[12px] text-primary hover:underline">{s.occurrenceId}</Link><p className="text-[11px] text-muted-foreground">{s.operation} · {s.when}</p></div><Tag tone="warn">{ms(s.ms)}</Tag></div>)}</Panel></div></div></div>;
}