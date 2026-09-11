import { createFileRoute } from "@tanstack/react-router";
import { DemoShell } from "@/components/demo/DemoShell";
import { B } from "@/lib/brand";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: `${B.name} live demo — ${B.demoApp} dashboard` },
      {
        name: "description",
        content: `Explore a seeded ${B.name} dashboard: marked operations, occurrence timelines, query attribution, per-tenant usage and service health.`,
      },
      { property: "og:title", content: `${B.name} live demo` },
      {
        property: "og:description",
        content: `A fully seeded dashboard showing what opt-in observability looks like in practice.`,
      },
    ],
  }),
  component: DemoShell,
});
