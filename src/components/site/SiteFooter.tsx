import { Link } from "@tanstack/react-router";
import { B } from "@/lib/brand";
import { Mark } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Mark className="text-foreground" />
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
            {B.positioning}
          </p>
        </div>

        <FooterCol
          title="Product"
          items={[
            { to: "/", label: "Overview" },
            { to: "/demo", label: "Live demo" },
            { to: "/docs/what-intent-is-not", label: "What it is not" },
            { to: "/docs/deployment", label: "Deployment" },
          ]}
        />
        <FooterCol
          title="Docs"
          items={[
            { to: "/docs/quickstart", label: "Quickstart" },
            { to: "/docs/nestjs", label: "NestJS" },
            { to: "/docs/nextjs", label: "Next.js" },
            { to: "/docs/metering", label: "Metering" },
          ]}
        />
        <FooterCol
          title="Demo"
          items={[
            { to: "/demo/operations", label: "Operations" },
            { to: "/demo/queries", label: "Queries" },
            { to: "/demo/usage", label: "Usage" },
            { to: "/demo/health", label: "Health" },
          ]}
        />
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-5 text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            {B.name} — {B.tagline}
          </span>
          <span className="font-mono">
            Concept site. {B.demoApp} data is seeded and fictional.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { to: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i.to + i.label}>
            <Link
              to={i.to}
              className="text-[13px] text-foreground/80 transition-colors hover:text-primary"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
