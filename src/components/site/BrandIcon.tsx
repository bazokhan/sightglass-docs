import {
  siDocker,
  siExpress,
  siFastify,
  siGithub,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siNpm,
  siPrisma,
  siTypescript,
} from "simple-icons";
import { cn } from "@/lib/utils";

type IconData = { title: string; path: string };

export const brandIcons = {
  docker: siDocker,
  express: siExpress,
  fastify: siFastify,
  github: siGithub,
  nestjs: siNestjs,
  nextjs: siNextdotjs,
  nodejs: siNodedotjs,
  npm: siNpm,
  prisma: siPrisma,
  typescript: siTypescript,
} as const satisfies Record<string, IconData>;

export type BrandIconName = keyof typeof brandIcons;

export function BrandIcon({
  name,
  className,
  decorative = true,
}: {
  name: BrandIconName;
  className?: string;
  decorative?: boolean;
}) {
  const icon = brandIcons[name];

  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("shrink-0 fill-current", className)}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : icon.title}
    >
      <path d={icon.path} />
    </svg>
  );
}

const headingIcons: Array<{ match: RegExp; icon: BrandIconName }> = [
  { match: /^express\b/i, icon: "express" },
  { match: /^fastify\b/i, icon: "fastify" },
  { match: /^nestjs\b/i, icon: "nestjs" },
  { match: /^next\.js\b/i, icon: "nextjs" },
  { match: /^prisma\b/i, icon: "prisma" },
  { match: /^docker\b/i, icon: "docker" },
  { match: /^node\.js\b/i, icon: "nodejs" },
  { match: /^typescript\b/i, icon: "typescript" },
];

export function brandIconForHeading(value: string) {
  return headingIcons.find(({ match }) => match.test(value))?.icon;
}
