import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Panel, Tag } from "@/components/demo/primitives";
import { occurrences } from "@/data/seed";
import type { SpanNode } from "@/data/types";
import { ms, num } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/demo/occurrences/$id")({
  loader: ({ params }) => {
    const occ = occurrences.find((o) => o.id === params.id);
    if (!occ) throw notFound();
    return { occ };
  },
  component: OccurrenceDetail,
});

function flatten(node: SpanNode, depth = 0): { node: SpanNode; depth: number }[] {
  return [{ node, depth }, ...(node.children ?? []).flatMap((c) => flatten(c, depth + 1))];
}

const kindTone: Record<SpanNode["kind"], string> = {
  operation: "bg-primary",
  step: "bg-info",
  db: "bg-warn",
  http: "bg-meter",
  service: "bg-ok",
};

function OccurrenceDetail() {
  const { occ } = Route.useLoaderData();
  const rows = flatten(occ.root);
  const total = occ.root.ms;

  return (
    <div className="space-y-4">
      <Link
        to="/demo/operations/$id"
        params={{ id: occ.operationId }}
        className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> {occ.operation}
      </Link>

      <header className="flex flex-wrap items-center gap-2">
        <h1 className="font-mono text-[18px] font-semibold tracking-tight">{occ.id}</h1>
        <Tag tone={occ.status === "error" ? "danger" : "ok"}>
          {occ.method} {occ.httpStatus}
        </Tag>
        <Tag>{occ.service}</Tag>
        <Tag>{occ.environment}</Tag>
        <span className="num text-[12.5px] text-muted-foreground">{ms(occ.durationMs)}</span>
      </header>

      {occ.error ? (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3">
          <p className="font-mono text-[13px] text-danger">{occ.error.type}</p>
          <p className="mt-1 text-[13px] text-foreground/85">{occ.error.message}</p>
          <p className="mt-1.5 font-mono text-[11.5px] text-muted-foreground">{occ.error.where}</p>
        </div>
      ) : null}

      <Panel title="Timeline" subtitle={`${rows.length} recorded spans · total ${ms(total)}`}>
        <div className="space-y-1.5">
          {rows.map(({ node, depth }) => (
            <div key={node.id} className="flex items-center gap-3">
              <div className="w-56 shrink-0 truncate" style={{ paddingLeft: depth * 12 }}>
                <span
                  className={cn(
                    "font-mono text-[12px]",
                    node.status === "error" ? "text-danger" : "text-foreground/85",
                  )}
                >
                  {node.label}
                </span>
              </div>
              <div className="relative h-4 flex-1 rounded bg-surface-2">
                <div
                  className={cn(
                    "absolute top-0 h-4 rounded",
                    node.status === "error" ? "bg-danger" : kindTone[node.kind],
                  )}
                  style={{
                    left: `${(node.offset / total) * 100}%`,
                    width: `${Math.max(1, (node.ms / total) * 100)}%`,
                  }}
                />
              </div>
              <span className="num w-16 shrink-0 text-right text-[11.5px] text-muted-foreground">
                {ms(node.ms)}
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Attributes" subtitle="Only keys you attached explicitly">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12.5px]">
            <Row k="tenant" v={`${occ.tenantName} (${occ.tenantId})`} />
            <Row k="plan" v={occ.plan} />
            <Row k="user" v={occ.userId} />
            <Row k="requestId" v={occ.requestId} />
            <Row k="route" v={`${occ.method} ${occ.route}`} />
            <Row k="timestamp" v={occ.timestamp} />
            {Object.entries(occ.attributes).map(([k, v]) => (
              <Row key={k} k={k} v={String(v)} />
            ))}
          </dl>
        </Panel>

        <Panel title="Events" subtitle="Timestamped moments inside this execution">
          <ul className="space-y-2.5">
            {occ.events.map((e) => (
              <li key={e.name + e.atMs} className="flex gap-3">
                <span className="num w-14 shrink-0 text-[11.5px] text-muted-foreground">
                  +{ms(e.atMs)}
                </span>
                <div className="min-w-0">
                  <span
                    className={cn(
                      "font-mono text-[12.5px]",
                      e.level === "error" ? "text-danger" : "text-foreground/90",
                    )}
                  >
                    {e.name}
                  </span>
                  <p className="truncate font-mono text-[11.5px] text-muted-foreground">
                    {Object.entries(e.attrs)
                      .map(([k, v]) => `${k}=${v}`)
                      .join(" · ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title="Database" subtitle={`${occ.db.queries} queries · ${ms(occ.db.totalMs)}`}>
          <ul className="space-y-2 text-[12.5px]">
            {occ.db.slowest.map((q) => (
              <li key={q.name} className="flex justify-between gap-3">
                <span className="font-mono">{q.name}</span>
                <span className="num text-muted-foreground">{ms(q.ms)}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Dependencies" subtitle="Outbound calls made inside the operation">
          <ul className="space-y-2 text-[12.5px]">
            {occ.dependencies.map((d) => (
              <li key={d.name} className="flex justify-between gap-3">
                <span className="font-mono">{d.name}</span>
                <span className="num shrink-0 text-muted-foreground">
                  {ms(d.ms)} · {d.status}
                </span>
              </li>
            ))}
            {occ.dependencies.length === 0 ? (
              <li className="text-muted-foreground">No outbound calls recorded.</li>
            ) : null}
          </ul>
        </Panel>

        <Panel title="Meters" subtitle="Business quantities emitted here">
          <ul className="space-y-2 text-[12.5px]">
            {(occ.meters ?? []).map((m) => (
              <li key={m.name} className="flex justify-between gap-3">
                <span className="font-mono text-meter">{m.name}</span>
                <span className="num text-muted-foreground">{num(m.quantity)}</span>
              </li>
            ))}
            {!occ.meters?.length ? (
              <li className="text-muted-foreground">No meters emitted.</li>
            ) : null}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="font-mono text-muted-foreground">{k}</dt>
      <dd className="truncate font-mono">{v}</dd>
    </>
  );
}
