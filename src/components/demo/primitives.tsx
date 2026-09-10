import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
  subtitle,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-md border border-border bg-surface", className)}>
      {title ? (
        <header className="flex items-start justify-between gap-3 border-b border-border/70 px-4 py-2.5">
          <div>
            <h2 className="text-[13px] font-medium tracking-tight text-foreground">{title}</h2>
            {subtitle ? (
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {action}
        </header>
      ) : null}
      <div className={cn("px-4 py-3", bodyClassName)}>{children}</div>
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "default" | "ok" | "warn" | "danger";
}) {
  const toneClass = {
    default: "text-foreground",
    ok: "text-ok",
    warn: "text-warn",
    danger: "text-danger",
  }[tone];

  return (
    <div className="rounded-md border border-border bg-surface px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("num mt-1.5 text-[22px] leading-none", toneClass)}>{value}</div>
      {hint ? <div className="mt-1.5 text-[11.5px] text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

export function StatusDot({ status }: { status: "healthy" | "degraded" | "ok" | "error" }) {
  const color =
    status === "healthy" || status === "ok"
      ? "bg-ok"
      : status === "degraded"
        ? "bg-warn"
        : "bg-danger";
  return <span className={cn("inline-block size-1.5 rounded-full", color)} />;
}

export function Tag({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "ok" | "warn" | "danger" | "primary" | "meter";
}) {
  const tones = {
    muted: "border-border text-muted-foreground",
    ok: "border-ok/30 text-ok",
    warn: "border-warn/30 text-warn",
    danger: "border-danger/35 text-danger",
    primary: "border-primary/35 text-primary",
    meter: "border-meter/35 text-meter",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wider",
        tones,
      )}
    >
      {children}
    </span>
  );
}

export function Bar({
  value,
  tone = "primary",
  className,
}: {
  value: number;
  tone?: "primary" | "ok" | "warn" | "danger" | "meter";
  className?: string;
}) {
  const bg = {
    primary: "bg-primary",
    ok: "bg-ok",
    warn: "bg-warn",
    danger: "bg-danger",
    meter: "bg-meter",
  }[tone];
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-2", className)}>
      <div className={cn("h-full rounded-full", bg)} style={{ width: `${Math.min(100, value * 100)}%` }} />
    </div>
  );
}

export function Sparkline({
  data,
  className,
  tone = "primary",
}: {
  data: number[];
  className?: string;
  tone?: "primary" | "danger";
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 30 - ((d - min) / span) * 26 - 2;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const stroke = tone === "primary" ? "var(--primary)" : "var(--danger)";

  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={cn("h-10 w-full", className)}>
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function TableShell({
  head,
  children,
}: {
  head: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            {head}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
