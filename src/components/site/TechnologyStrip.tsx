import { BrandIcon, type BrandIconName } from "./BrandIcon";

const technologies: Array<{ name: BrandIconName; label: string }> = [
  { name: "nodejs", label: "Node.js" },
  { name: "typescript", label: "TypeScript" },
  { name: "express", label: "Express" },
  { name: "fastify", label: "Fastify" },
  { name: "nestjs", label: "NestJS" },
  { name: "nextjs", label: "Next.js" },
  { name: "prisma", label: "Prisma" },
  { name: "docker", label: "Docker" },
];

export function TechnologyStrip() {
  return (
    <section className="border-b border-border" aria-labelledby="integrations-title">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="shrink-0">
            <h2 id="integrations-title" className="text-sm font-medium">
              Works with your Node stack
            </h2>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Official marks identify supported integrations; no affiliation implied.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4 lg:grid-cols-8">
            {technologies.map((technology) => (
              <li
                key={technology.name}
                className="flex min-h-16 min-w-28 items-center gap-2 bg-surface px-3 text-[12px] text-foreground/80 transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <BrandIcon name={technology.name} className="size-4 text-muted-foreground" />
                <span>{technology.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
