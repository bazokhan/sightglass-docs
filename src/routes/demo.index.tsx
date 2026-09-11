import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useFilters } from "@/components/demo/filters";
import { Bar, Panel, Sparkline, Stat, TableShell, Tag } from "@/components/demo/primitives";
import {
  errorSeries,
  occurrences,
  operations,
  queries,
  securityEvents,
  summary,
  trafficSeries,
} from "@/data/seed";
import { compact, ms, num, pct, scale } from "@/lib/format";
import { B } from "@/lib/brand";

export const Route = createFileRoute("/demo/")({
  component: OverviewPage,
});

function OverviewPage() {
  const { factor, service, range } = useFilters();
  const visible = operations.filter((o) => service === "all" || o.service === service);
  const calls = visible.reduce((a, o) => a + scale(o.calls, factor), 0);
  const errors = visible.reduce((a, o) => a + scale(o.calls * o.errorRate, factor), 0);
  const p95 = Math.round(
    visible.reduce((a, o) => a + o.p95 * o.calls, 0) / Math.max(1, visible.reduce((a, o) => a + o.calls, 0)),
  );
  const recentErrors = occurrences.filter((o) => o.status === "error").slice(0, 5);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-[17px] font-semibold tracking-tight">Overview</h1>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">
            {visible.length} marked operations in {B.demoApp}. Everything else in the codebase is
            invisible on purpose.
          </p>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">range={range}</span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Occurrences" value={compact(calls)} hint={`${num(calls)} recorded executions`} />
        <Stat
          label="Error rate"
          value={pct(errors / Math.max(1, calls))}
          tone={errors / Math.max(1, calls) > 0.02 ? "warn" : "ok"}
          hint={`${num(errors)} failed`}
        />
        <Stat label="p95 latency" value={ms(p95)} hint="weighted across operations" />
        <Stat
          label="Unauthorized"
          value={num(scale(summary.unauthorized, factor))}
          tone="danger"
          hint="401/403 on marked routes"
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title="Throughput" subtitle="occurrences per hour" className="lg:col-span-2">
          <Sparkline data={trafficSeries} />
        </Panel>
        <Panel title="Error rate" subtitle="% of occurrences">
          <Sparkline data={errorSeries} tone="danger" />
        </Panel>
      </div>

      <Panel
        title="Operations"
        subtitle="Ranked by total time spent"
        action={
          <Link
            to="/demo/operations"
            className="inline-flex items-center gap-1 text-[12px] text-primary hover:underline"
          >
            All operations <ArrowUpRight className="size-3" />
          </Link>
        }
        bodyClassName="px-0 py-0"
      >
        <TableShell
          head={
            <>
              <Th>Operation</Th>
              <Th>Service</Th>
              <Th right>Calls</Th>
              <Th right>Errors</Th>
              <Th right>p95</Th>
              <Th>DB share</Th>
            </>
          }
        >
          {visible
            .slice()
            .sort((a, b) => b.calls * b.p50 - a.calls * a.p50)
            .map((o) => (
              <tr key={o.id} className="border-b border-border/60 last:border-0 hover:bg-accent/30">
                <Td>
                  <Link
                    to="/demo/operations/$id"
                    params={{ id: o.id }}
                    className="font-mono text-[12.5px] text-primary hover:underline"
                  >
                    {o.name}
                  </Link>
                </Td>
                <Td>
                  <span className="font-mono text-[12px] text-muted-foreground">{o.service}</span>
                </Td>
                <Td right>{num(scale(o.calls, factor))}</Td>
                <Td right>
                  <span className={o.errorRate > 0.03 ? "text-danger" : "text-muted-foreground"}>
                    {pct(o.errorRate)}
                  </span>
                </Td>
                <Td right>{ms(o.p95)}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Bar value={o.dbShare} tone={o.dbShare > 0.6 ? "warn" : "primary"} className="w-24" />
                    <span className="num text-[11.5px] text-muted-foreground">{pct(o.dbShare, 0)}</span>
                  </div>
                </Td>
              </tr>
            ))}
        </TableShell>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Recent failures" subtitle="Every failed occurrence is kept in full">
          <ul className="space-y-2">
            {recentErrors.map((o) => (
              <li key={o.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to="/demo/occurrences/$id"
                    params={{ id: o.id }}
                    className="font-mono text-[12.5px] text-primary hover:underline"
                  >
                    {o.operation}
                  </Link>
                  <p className="truncate text-[12px] text-muted-foreground">
                    {o.error?.type ?? "error"} · {o.tenantName}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <Tag tone="danger">{o.httpStatus}</Tag>
                  <div className="num mt-1 text-[11.5px] text-muted-foreground">
                    {ms(o.durationMs)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Slowest queries" subtitle="Attributed to the operation that ran them">
          <ul className="space-y-2.5">
            {queries
              .slice()
              .sort((a, b) => b.totalMs - a.totalMs)
              .slice(0, 5)
              .map((q) => (
                <li key={q.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      to="/demo/queries"
                      className="font-mono text-[12.5px] text-foreground hover:text-primary"
                    >
                      {q.name}
                    </Link>
                    <p className="truncate text-[11.5px] text-muted-foreground">
                      via {q.topOperation}
                    </p>
                  </div>
                  <span className="num shrink-0 text-[12.5px]">{ms(q.avgMs)}</span>
                </li>
              ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Security signal" subtitle="Auth failures on marked routes only">
        <ul className="space-y-2">
          {securityEvents.slice(0, 4).map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="font-mono text-[12.5px]">
                  {e.method} {e.route}
                </span>
                <p className="truncate text-[11.5px] text-muted-foreground">{e.note}</p>
              </div>
              <Tag tone={e.kind === "reported" ? "meter" : "danger"}>{e.code}</Tag>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <th className={`px-4 py-2 font-medium ${right ? "text-right" : ""}`}>{children}</th>;
}

function Td({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <td className={`px-4 py-2 ${right ? "num text-right" : ""}`}>{children}</td>;
}
