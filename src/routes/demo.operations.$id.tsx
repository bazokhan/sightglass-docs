import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useFilters } from "@/components/demo/filters";
import { Bar, Panel, Stat, TableShell, Tag } from "@/components/demo/primitives";
import { occurrences, operations, queries } from "@/data/seed";
import { ms, num, pct, scale } from "@/lib/format";

export const Route = createFileRoute("/demo/operations/$id")({
  loader: ({ params }) => {
    const op = operations.find((o) => o.id === params.id);
    if (!op) throw notFound();
    return { op };
  },
  component: OperationDetail,
});

function OperationDetail() {
  const { op } = Route.useLoaderData();
  const { factor } = useFilters();
  const related = occurrences.filter((o) => o.operationId === op.id);
  const relatedQueries = queries.filter((q) =>
    q.callers.some((c) => c.operation === op.name),
  );
  const totalBreakdown = op.breakdown.reduce((a, b) => a + b.ms, 0);

  return (
    <div className="space-y-4">
      <Link
        to="/demo/operations"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Operations
      </Link>

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-mono text-[18px] font-semibold tracking-tight">{op.name}</h1>
          <Tag>{op.service}</Tag>
          {op.route ? (
            <Tag tone="primary">
              {op.method} {op.route}
            </Tag>
          ) : (
            <Tag tone="meter">background job</Tag>
          )}
        </div>
        <p className="mt-1.5 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
          {op.description}
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Calls" value={num(scale(op.calls, factor))} />
        <Stat
          label="Error rate"
          value={pct(op.errorRate)}
          tone={op.errorRate > 0.03 ? "danger" : "ok"}
        />
        <Stat label="p95" value={ms(op.p95)} hint={`p50 ${ms(op.p50)} · p99 ${ms(op.p99)}`} />
        <Stat label="DB time" value={ms(op.dbMs)} hint={`${pct(op.dbShare, 0)} of total time`} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Where the time goes" subtitle="Average milliseconds per call">
          <ul className="space-y-3">
            {op.breakdown.map((b) => (
              <li key={b.label}>
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="font-mono">{b.label}</span>
                  <span className="num text-muted-foreground">{ms(b.ms)}</span>
                </div>
                <Bar
                  value={b.ms / totalBreakdown}
                  tone={b.label.includes("Prisma") || b.label.includes("database") ? "warn" : "primary"}
                  className="mt-1.5"
                />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Why it fails" subtitle="Grouped failure reasons">
          <ul className="space-y-3">
            {op.topFailures.map((f) => (
              <li key={f.reason}>
                <div className="flex items-center justify-between gap-3 text-[12.5px]">
                  <span className="font-mono text-danger/90">{f.reason}</span>
                  <span className="num shrink-0 text-muted-foreground">
                    {num(scale(f.count, factor))} · {pct(f.share, 0)}
                  </span>
                </div>
                <Bar value={f.share} tone="danger" className="mt-1.5" />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {op.contextBreakdown ? (
        <Panel title={op.contextBreakdown.label} subtitle="Split by an attribute you attached">
          <TableShell
            head={
              <>
                <th className="px-1 py-2 font-medium">Value</th>
                <th className="px-1 py-2 text-right font-medium">Calls</th>
                <th className="px-1 py-2 text-right font-medium">Error rate</th>
              </>
            }
          >
            {op.contextBreakdown.rows.map((r) => (
              <tr key={r.key} className="border-b border-border/60 last:border-0">
                <td className="px-1 py-2 font-mono text-[12.5px]">{r.key}</td>
                <td className="num px-1 py-2 text-right">{num(scale(r.calls, factor))}</td>
                <td
                  className={`num px-1 py-2 text-right ${
                    r.errorRate > 0.05 ? "text-danger" : "text-muted-foreground"
                  }`}
                >
                  {pct(r.errorRate)}
                </td>
              </tr>
            ))}
          </TableShell>
        </Panel>
      ) : null}

      {relatedQueries.length ? (
        <Panel title="Queries run inside this operation">
          <ul className="space-y-2">
            {relatedQueries.map((q) => (
              <li key={q.id} className="flex items-center justify-between gap-3 text-[12.5px]">
                <Link to="/demo/queries" className="font-mono text-primary hover:underline">
                  {q.name}
                </Link>
                <span className="num text-muted-foreground">
                  avg {ms(q.avgMs)} · p95 {ms(q.p95Ms)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      <Panel title="Recent occurrences" subtitle="Full detail is kept for every failure">
        {related.length ? (
          <ul className="space-y-2">
            {related.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to="/demo/occurrences/$id"
                    params={{ id: o.id }}
                    className="font-mono text-[12.5px] text-primary hover:underline"
                  >
                    {o.id}
                  </Link>
                  <p className="truncate text-[11.5px] text-muted-foreground">
                    {o.tenantName} · {o.plan} · {new Date(o.timestamp).toUTCString().slice(17, 25)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Tag tone={o.status === "error" ? "danger" : "ok"}>{o.httpStatus}</Tag>
                  <span className="num text-[12px] text-muted-foreground">{ms(o.durationMs)}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[12.5px] text-muted-foreground">
            No sampled occurrences in this seeded window.
          </p>
        )}
      </Panel>
    </div>
  );
}
