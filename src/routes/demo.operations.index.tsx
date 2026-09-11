import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useFilters } from "@/components/demo/filters";
import { Bar, Panel, Tag } from "@/components/demo/primitives";
import { operations } from "@/data/seed";
import { ms, num, pct, scale } from "@/lib/format";

export const Route = createFileRoute("/demo/operations/")({
  component: OperationsPage,
});

type SortKey = "calls" | "errorRate" | "p95" | "dbShare";

export function OperationsPage() {
  const { factor, service } = useFilters();
  const [sort, setSort] = useState<SortKey>("calls");
  const [q, setQ] = useState("");

  const rows = operations
    .filter((o) => service === "all" || o.service === service)
    .filter((o) => o.name.toLowerCase().includes(q.toLowerCase()))
    .slice()
    .sort((a, b) => b[sort] - a[sort]);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold tracking-tight">Operations</h1>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">
            Every row is something a developer explicitly marked with <code>@Observe()</code> or{" "}
            <code>observe()</code>.
          </p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="filter operations…"
          className="w-56 rounded border border-border bg-surface px-2.5 py-1.5 font-mono text-[12px] outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
        />
      </header>

      <div className="flex flex-wrap gap-1">
        {(
          [
            ["calls", "Most called"],
            ["errorRate", "Most errors"],
            ["p95", "Slowest p95"],
            ["dbShare", "Most DB-bound"],
          ] as [SortKey, string][]
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setSort(k)}
            className={`rounded px-2.5 py-1 font-mono text-[11.5px] transition-colors ${
              sort === k
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {rows.map((o) => (
          <Panel
            key={o.id}
            title={
              <Link
                to="/demo/operations/$id"
                params={{ id: o.id }}
                className="font-mono text-[13px] text-primary hover:underline"
              >
                {o.name}
              </Link>
            }
            subtitle={o.route ? `${o.method} ${o.route} · ${o.service}` : `job · ${o.service}`}
            action={
              o.errorRate > 0.03 ? (
                <Tag tone="danger">{pct(o.errorRate)} errors</Tag>
              ) : (
                <Tag tone="ok">healthy</Tag>
              )
            }
          >
            <div className="grid grid-cols-4 gap-3 text-[12.5px]">
              <Metric label="calls" value={num(scale(o.calls, factor))} />
              <Metric label="p50" value={ms(o.p50)} />
              <Metric label="p95" value={ms(o.p95)} />
              <Metric label="p99" value={ms(o.p99)} />
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11.5px] text-muted-foreground">
                <span>database share of time</span>
                <span className="num">{pct(o.dbShare, 0)}</span>
              </div>
              <Bar value={o.dbShare} tone={o.dbShare > 0.6 ? "warn" : "primary"} className="mt-1.5" />
            </div>
            {o.usage ? (
              <p className="mt-3 font-mono text-[11.5px] text-meter">
                meter {o.usage.meter} · {num(scale(o.usage.total, factor))} {o.usage.unit}
              </p>
            ) : null}
          </Panel>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="num mt-0.5 text-[14px]">{value}</div>
    </div>
  );
}
