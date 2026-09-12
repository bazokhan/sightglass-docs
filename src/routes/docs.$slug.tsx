import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { docs, findDoc } from "@/data/docs";
import { B } from "@/lib/brand";

export const Route = createFileRoute("/docs/$slug")({
  loader: ({ params }) => {
    const doc = findDoc(params.slug);
    if (!doc) throw notFound();
    return { doc };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.doc.title} — ${B.name} docs` },
          { name: "description", content: loaderData.doc.summary },
          { property: "og:title", content: `${loaderData.doc.title} — ${B.name} docs` },
          { property: "og:description", content: loaderData.doc.summary },
        ]
      : [{ title: `Page not found — ${B.name} docs` }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div>
      <h1 className="text-xl font-semibold">That page does not exist</h1>
      <Link to="/docs" className="mt-3 inline-block text-primary">
        Back to documentation
      </Link>
    </div>
  ),
  component: DocPageView,
});

function DocPageView() {
  const { doc } = Route.useLoaderData();
  const index = docs.findIndex((item) => item.slug === doc.slug);
  const previous = docs[index - 1];
  const next = docs[index + 1];
  return (
    <article className="max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-wider text-primary">{doc.group}</p>
      <h1 className="mt-1.5 text-3xl font-semibold tracking-tight">{doc.title}</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{doc.summary}</p>
      <div className="docs-prose mt-9">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.content}</ReactMarkdown>
      </div>
      <nav
        className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-5"
        aria-label="Documentation pages"
      >
        {previous ? (
          <Link
            to="/docs/$slug"
            params={{ slug: previous.slug }}
            className="inline-flex items-center gap-2 text-[13.5px] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            {previous.title}
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
