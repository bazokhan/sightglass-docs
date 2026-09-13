type SourceModule = string;

export interface DocPage {
  slug: string;
  title: string;
  summary: string;
  group: string;
  order: number;
  content: string;
}

const sources = import.meta.glob<SourceModule>("/content/docs/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function parse(source: string, path: string): DocPage {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing frontmatter in ${path}`);
  const metadata = Object.fromEntries(
    match[1]!
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      }),
  );
  return {
    slug: metadata["slug"]!,
    title: metadata["title"]!,
    summary: metadata["summary"]!,
    group: metadata["group"]!,
    order: Number(metadata["order"]),
    content: match[2]!.trim(),
  };
}

export const docs = Object.entries(sources)
  .map(([path, source]) => parse(source, path))
  .sort((a, b) => a.order - b.order);
export const docGroups = [...new Set(docs.map((doc) => doc.group))];
export const findDoc = (slug: string) => docs.find((doc) => doc.slug === slug);
