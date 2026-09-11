import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/kit/CodeBlock";
import { docs, findDoc } from "@/data/docs";
import { B } from "@/lib/brand";

export const Route = createFileRoute("/docs/$slug")({
  loader: ({ params }) => {
    const doc = findDoc(params.slug);
    if (!doc) throw notFound();
    return { doc };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: `Page not found — ${B.name} docs` }, { name: "robots", content: "noindex" }],
      };
    }
    const { doc } = loaderData;
    return {
      meta: [
        { title: `${doc.title} — ${B.name} docs` },
        { name: "description", content: doc.summary },
        { property: "og:title", content: `${doc.title} — ${B.name} docs` },
        { property: "og:description", content: doc.summary },
      ],
    };
  },
  notFoundComponent: DocNotFound,
  component: DocPageView,
});

function DocNotFound() {
  return (
    <div>
      <h1 className="text-xl font-semibold">That page doesn't exist</h1>
      <Link to="/docs" className="mt-3 inline-block text-[13.5px] text-primary">
        Back to documentation
      </Link>
    </div>
  );
}

function DocPageView() {
  const { doc } = Route.useLoaderData();
  const index = docs.findIndex((d) => d.slug === doc.slug);
  const prev = docs[index - 1];
  const next = docs[index + 1];

  return (
    <article className="max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {doc.group}
      </p>
      <h1 className="mt-1.5 text-2xl font-semibold tracking-tight">{doc.title}</h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{doc.summary}</p>

      <div className="mt-8 space-y-5">
        {doc.blocks.map((b, i) => {
          if (b.type === "h")
            return (
              <h2 key={i} className="pt-3 text-[15px] font-semibold tracking-tight">
                {b.text}
              </h2>
            );
          if (b.type === "p")
            return (
              <p key={i} className="text-[14px] leading-relaxed text-foreground/85">
                {b.text}
              </p>
            );
          if (b.type === "list")
            return (
              <ul key={i} className="space-y-1.5">
                {b.items.map((it) => (
                  <li
                    key={it}
                    className="flex gap-2.5 text-[14px] leading-relaxed text-foreground/85"
                  >
                    <span className="mt-[9px] size-1 shrink-0 rounded-full bg-primary" />
                    {it}
                  </li>
                ))}
              </ul>
            );
          if (b.type === "note")
            return (
              <div
                key={i}
                className="flex gap-2.5 rounded-md border border-primary/25 bg-primary/5 px-4 py-3"
              >
                <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <p className="text-[13.5px] leading-relaxed text-foreground/85">{b.text}</p>
              </div>
            );
          return <CodeBlock key={i} code={b.code} filename={b.filename} />;
        })}
      </div>

      <nav className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-5">
        {prev ? (
          <Link
            to="/docs/$slug"
            params={{ slug: prev.slug }}
            className="inline-flex items-center gap-2 text-[13.5px] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/docs/$slug"
            params={{ slug: next.slug }}
            className="inline-flex items-center gap-2 text-[13.5px] text-muted-foreground hover:text-foreground"
          >
            {next.title}
            <ArrowRight className="size-3.5" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
