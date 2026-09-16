import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { docGroups, docs } from "@/data/docs";
import { B, siteUrl } from "@/lib/brand";

export const Route = createFileRoute("/docs/")({
  head: () => ({
    meta: [
      { title: `Documentation — ${B.name}` },
      {
        name: "description",
        content: `Everything needed to run ${B.name}: quickstart, framework guides, metering, deployment and scope.`,
      },
      { property: "og:title", content: `Documentation — ${B.name}` },
      {
        property: "og:description",
        content: `Quickstart, framework guides, metering and deployment for ${B.name}.`,
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl("/docs") },
      { name: "twitter:title", content: `Documentation — ${B.name}` },
      {
        name: "twitter:description",
        content: `Quickstart, framework guides, metering and deployment for ${B.name}.`,
      },
    ],
    links: [{ rel: "canonical", href: siteUrl("/docs") }],
  }),
  component: DocsIndex,
});

function DocsIndex() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Documentation</h1>
      <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-muted-foreground">
        {B.name} is one container plus explicit SDK instrumentation for the operations you care
        about. Start with the quickstart, then choose the adapter for your framework.
      </p>

      <div className="mt-8 space-y-8">
        {docGroups.map((g) => (
          <section key={g}>
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {g}
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {docs
                .filter((d) => d.group === g)
                .map((d) => (
                  <Link
                    key={d.slug}
                    to="/docs/$slug"
                    params={{ slug: d.slug }}
                    className="group rounded-md border border-border bg-surface px-4 py-3 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[14px] font-medium">{d.title}</span>
                      <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                      {d.summary}
                    </p>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
