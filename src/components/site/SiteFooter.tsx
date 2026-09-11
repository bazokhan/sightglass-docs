import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { B } from "@/lib/brand";
import { Mark } from "./SiteHeader";
import { DocsLink } from "./DocsLink";

const linkClass = "text-[13px] text-foreground/80 transition-colors hover:text-primary";

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

        <FooterCol title="Product">
          <Link to="/" className={linkClass}>
            Overview
          </Link>
          <Link to="/demo" className={linkClass}>
            Live demo
          </Link>
          <DocsLink slug="what-intent-is-not" className={linkClass}>
            What it is not
          </DocsLink>
          <DocsLink slug="deployment" className={linkClass}>
            Deployment
          </DocsLink>
        </FooterCol>

        <FooterCol title="Docs">
          <DocsLink slug="quickstart" className={linkClass}>
            Quickstart
          </DocsLink>
          <DocsLink slug="nestjs" className={linkClass}>
            NestJS
          </DocsLink>
          <DocsLink slug="nextjs" className={linkClass}>
            Next.js
          </DocsLink>
          <DocsLink slug="metering" className={linkClass}>
            Metering
          </DocsLink>
        </FooterCol>

        <FooterCol title="Demo">
          <Link to="/demo/operations" className={linkClass}>
            Operations
          </Link>
          <Link to="/demo/queries" className={linkClass}>
            Queries
          </Link>
          <Link to="/demo/usage" className={linkClass}>
            Usage
          </Link>
          <Link to="/demo/health" className={linkClass}>
            Health
          </Link>
        </FooterCol>
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

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="mt-3 flex flex-col gap-2">{children}</div>
    </div>
  );
}
