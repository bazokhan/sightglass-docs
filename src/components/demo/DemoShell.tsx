import { Link, Outlet } from "@tanstack/react-router";
import {
  Activity,
  Boxes,
  Database,
  Gauge,
  Layers,
  Shield,
  BookOpen,
} from "lucide-react";
import { B } from "@/lib/brand";
import { environments, services, timeRangeLabel, timeRanges } from "@/data/seed";
import { FiltersProvider, useFilters } from "./filters";
import { Mark } from "@/components/site/SiteHeader";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/demo", label: "Overview", icon: Layers, exact: true },
  { to: "/demo/operations", label: "Operations", icon: Activity, exact: false },
  { to: "/demo/queries", label: "Queries", icon: Database, exact: false },
  { to: "/demo/usage", label: "Usage", icon: Boxes, exact: false },
  { to: "/demo/security", label: "Security", icon: Shield, exact: false },
  { to: "/demo/health", label: "Health", icon: Gauge, exact: false },
];

function FilterBar() {
  const { environment, setEnvironment, range, setRange, service, setService } = useFilters();

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-background/85 px-5 py-2.5 backdrop-blur">
      <Select
        value={environment}
        onChange={(v) => setEnvironment(v as typeof environment)}
        options={environments.map((e) => ({ value: e, label: e }))}
      />
      <Select
        value={range}
        onChange={(v) => setRange(v as typeof range)}
        options={timeRanges.map((r) => ({ value: r, label: timeRangeLabel[r] }))}
      />
      <Select
        value={service}
        onChange={(v) => setService(v as typeof service)}
        options={[
          { value: "all", label: "All services" },
          ...services.map((s) => ({ value: s, label: s })),
        ]}
      />
      <span className="ml-auto hidden font-mono text-[11px] text-muted-foreground sm:block">
        seeded demo · {B.demoApp}
      </span>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border border-border bg-surface px-2 py-1 font-mono text-[11.5px] text-foreground outline-none transition-colors hover:border-input focus:ring-1 focus:ring-ring"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-surface">
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function DemoShell() {
  return (
    <FiltersProvider>
      <div className="flex min-h-screen">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
          <div className="flex h-14 items-center border-b border-border px-4">
            <Link to="/" className="text-foreground">
              <Mark />
            </Link>
          </div>
          <nav className="flex-1 space-y-0.5 p-2">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.exact }}
                activeProps={{ className: "bg-sidebar-accent text-foreground" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="flex items-center gap-2.5 rounded px-2.5 py-1.5 text-[13px] transition-colors hover:text-foreground"
              >
                <n.icon className="size-3.5" />
                {n.label}
              </Link>
            ))}
            <Link
              to="/docs"
              className="mt-2 flex items-center gap-2.5 rounded px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <BookOpen className="size-3.5" />
              Docs / Setup
            </Link>
          </nav>
          <div className="border-t border-border px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
            Nothing is observed by default. This demo shows only explicitly marked operations.
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-30 md:static">
            <div className="flex items-center gap-3 overflow-x-auto border-b border-border bg-background px-4 py-2 md:hidden">
              <Link to="/" className="shrink-0 text-foreground">
                <Mark />
              </Link>
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.exact }}
                  activeProps={{ className: "text-foreground" }}
                  inactiveProps={{ className: "text-muted-foreground" }}
                  className="shrink-0 text-[12.5px]"
                >
                  {n.label}
                </Link>
              ))}
            </div>
            <FilterBar />
          </div>
          <main className={cn("px-5 py-5")}>
            <Outlet />
          </main>
        </div>
      </div>
    </FiltersProvider>
  );
}
