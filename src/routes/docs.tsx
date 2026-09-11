import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { docGroups, docs } from "@/data/docs";
import { B } from "@/lib/brand";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: `${B.name} docs — instrument one operation at a time` },
      {
        name: "description",
        content: `Setup, framework guides and concepts for ${B.name}: opt-in application observability you self-host in one container.`,
      },
      { property: "og:title", content: `${B.name} docs` },
      {
        property: "og:description",
        content: `Quickstart, NestJS, Next.js, metering and deployment guides for ${B.name}.`,
      },
    ],
  }),
  component: DocsLayout,
});

function DocsLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-10 px-5 py-10">
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-20 space-y-6">
            {docGroups.map((g) => (
              <div key={g}>
                <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {g}
                </h2>
                <ul className="mt-2 space-y-0.5">
                  {docs
                    .filter((d) => d.group === g)
                    .map((d) => (
                      <li key={d.slug}>
                        <Link
                          to="/docs/$slug"
                          params={{ slug: d.slug }}
                          activeProps={{ className: "text-primary" }}
                          inactiveProps={{ className: "text-foreground/75" }}
                          className="block rounded px-2 py-1 text-[13px] transition-colors hover:text-primary"
                        >
                          {d.title}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
