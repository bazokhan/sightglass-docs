import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(".");
const contentDirectory = resolve(root, "content/docs");
const outputDirectory = resolve(root, "public/docs");
const canonicalUrl = "https://sightglass-docs.trugraph.io";

function parseDocument(file) {
  const source = readFileSync(resolve(contentDirectory, file), "utf8").replace(/\r\n/g, "\n");
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file} is missing frontmatter`);
  const metadata = Object.fromEntries(
    match[1]
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      }),
  );
  return {
    ...metadata,
    order: Number(metadata.order),
    body: match[2].trim(),
    file,
  };
}

const documents = readdirSync(contentDirectory)
  .filter((file) => file.endsWith(".md"))
  .map(parseDocument)
  .sort((a, b) => a.order - b.order);

mkdirSync(outputDirectory, { recursive: true });

for (const document of documents) {
  const markdown = [
    `# ${document.title}`,
    "",
    document.summary,
    "",
    `Canonical HTML: ${canonicalUrl}/docs/${document.slug}`,
    "",
    document.body,
    "",
  ].join("\n");
  writeFileSync(resolve(outputDirectory, `${document.slug}.md`), markdown);
}

const index = [
  "# Sightglass",
  "",
  "> Application observability for developers who do not want an observability stack.",
  "",
  "Sightglass is an open-source, self-hosted TypeScript observability tool. It records only explicitly observed operations, their steps, database and outbound-call attribution, and durable usage meters.",
  "",
  "## Documentation",
  "",
  ...documents.map(
    (document) =>
      `- [${document.title}](${canonicalUrl}/docs/${document.slug}.md): ${document.summary}`,
  ),
  "",
  "## Source and packages",
  "",
  "- Source: https://github.com/bazokhan/sightglass",
  "- Documentation source: https://github.com/bazokhan/sightglass-docs",
  "- Core SDK: https://www.npmjs.com/package/@bazokhan/sightglass-core",
  "- Express adapter: https://www.npmjs.com/package/@bazokhan/sightglass-express",
  "- Fastify adapter: https://www.npmjs.com/package/@bazokhan/sightglass-fastify",
  "- NestJS adapter: https://www.npmjs.com/package/@bazokhan/sightglass-nest",
  "- Next.js adapter: https://www.npmjs.com/package/@bazokhan/sightglass-next",
  "- Prisma adapter: https://www.npmjs.com/package/@bazokhan/sightglass-prisma",
  "- Docker image: https://hub.docker.com/r/bazokhan/sightglass",
  "- Releases: https://github.com/bazokhan/sightglass/releases",
  "",
].join("\n");

const full = documents
  .map(
    (document) =>
      `# ${document.title}\n\n${document.summary}\n\nSource: ${canonicalUrl}/docs/${document.slug}\n\n${document.body}`,
  )
  .join("\n\n---\n\n");

writeFileSync(resolve(root, "public/llms.txt"), index);
writeFileSync(resolve(root, "public/llms-full.txt"), `${full}\n`);
writeFileSync(
  resolve(root, "public/robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${canonicalUrl}/sitemap.xml\n`,
);
writeFileSync(
  resolve(root, "public/sitemap.xml"),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url><loc>${canonicalUrl}/</loc></url>`,
    ...documents.map((document) => `  <url><loc>${canonicalUrl}/docs/${document.slug}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n"),
);

console.log(`Generated LLM-readable Markdown for ${documents.length} pages.`);
