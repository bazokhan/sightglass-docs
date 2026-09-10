import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { B } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
        <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="none" stroke="currentColor" strokeOpacity="0.35" />
        <path d="M6 15.5h4.2l1.9-7 1.9 4.2H18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight">{B.name}</span>
    </span>
  );
}

const links = [
  { to: "/", label: "Product", exact: true },
  { to: "/docs", label: "Docs", exact: false },
  { to: "/demo", label: "Live demo", exact: false },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="text-foreground transition-opacity hover:opacity-80">
          <Mark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.exact }}
              activeProps={{ className: "text-foreground bg-accent/60" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded px-3 py-1.5 text-[13.5px] transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/docs/quickstart"
            className="rounded-md px-3 py-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Quickstart
          </Link>
          <Link
            to="/demo"
            className="rounded-md bg-primary px-3 py-1.5 text-[13.5px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open live demo
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-background px-5 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded px-2 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
