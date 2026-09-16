import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Bot, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { docs, findDoc } from "@/data/docs";
import { B, siteUrl } from "@/lib/brand";
import { BrandIcon, brandIconForHeading } from "@/components/site/BrandIcon";

export const Route = createFileRoute("/docs/$slug")({
  loader: ({ params }) => {
    const doc = findDoc(params.slug);
    if (!doc) throw notFound();
    return { doc };
  },
  head: ({ params, loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.doc.title} — ${B.name} docs` },
          { name: "description", content: loaderData.doc.summary },
          { property: "og:title", content: `${loaderData.doc.title} — ${B.name} docs` },
          { property: "og:description", content: loaderData.doc.summary },
          { property: "og:type", content: "article" },
          { property: "og:url", content: siteUrl(`/docs/${params.slug}`) },
          { name: "twitter:title", content: `${loaderData.doc.title} — ${B.name} docs` },
          { name: "twitter:description", content: loaderData.doc.summary },
        ]
      : [{ title: `Page not found — ${B.name} docs` }, { name: "robots", content: "noindex" }],
    links: loaderData
      ? [
          { rel: "canonical", href: siteUrl(`/docs/${params.slug}`) },
          {
            rel: "alternate",
            type: "text/markdown",
            href: `/docs/${loaderData.doc.slug}.md`,
          },
        ]
      : [],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TechArticle",
              headline: loaderData.doc.title,
              description: loaderData.doc.summary,
              articleSection: loaderData.doc.group,
              url: siteUrl(`/docs/${params.slug}`),
              isPartOf: { "@type": "WebSite", name: `${B.name} docs`, url: B.docsUrl },
            }),
          },
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Docs", item: siteUrl("/docs") },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: loaderData.doc.title,
                  item: siteUrl(`/docs/${params.slug}`),
                },
              ],
            }),
          },
        ]
      : [],
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
    <article className="min-w-0 max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-wider text-primary">{doc.group}</p>
      <h1 className="mt-1.5 text-3xl font-semibold tracking-tight">{doc.title}</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{doc.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px]">
        <a
          href={`/docs/${doc.slug}.md`}
          className="inline-flex items-center gap-1.5 rounded border border-border bg-surface px-2.5 py-1.5 text-muted-foreground hover:border-primary/40 hover:text-primary"
        >
          <FileText className="size-3" /> View Markdown
        </a>
        <a
          href="/llms.txt"
          className="inline-flex items-center gap-1.5 rounded border border-border bg-surface px-2.5 py-1.5 text-muted-foreground hover:border-primary/40 hover:text-primary"
        >
          <Bot className="size-3" /> LLM index
        </a>
      </div>
      <div className="docs-prose mt-9">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children, ...props }) => {
              const title = String(children);
              const icon = brandIconForHeading(title);
              return (
                <h2 {...props} className={icon ? "flex items-center gap-2" : undefined}>
                  {icon ? <BrandIcon name={icon} className="size-4 text-muted-foreground" /> : null}
                  {children}
                </h2>
              );
            },
          }}
        >
          {doc.content}
        </ReactMarkdown>
      </div>
      <nav
        className="mt-12 flex min-w-0 items-center justify-between gap-4 border-t border-border pt-5"
        aria-label="Documentation pages"
      >
        {previous ? (
          <Link
            to="/docs/$slug"
            params={{ slug: previous.slug }}
            className="min-w-0 inline-flex items-center gap-2 text-[13.5px] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span className="truncate">{previous.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/docs/$slug"
            params={{ slug: next.slug }}
            className="min-w-0 inline-flex items-center gap-2 text-right text-[13.5px] text-muted-foreground hover:text-foreground"
          >
            <span className="truncate">{next.title}</span>
            <ArrowRight className="size-3.5" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
