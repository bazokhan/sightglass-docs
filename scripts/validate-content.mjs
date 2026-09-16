import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const directory = resolve("content/docs");
const files = readdirSync(directory).filter((file) => file.endsWith(".md"));
const slugs = new Set();
const orders = new Set();
const forbidden = [
  /INTENT_/i,
  /@sightglass\//i,
  /sightglasshq\//i,
  /sightglass-observability-without-noise/i,
  /Acme Cloud/i,
  /seeded demo/i,
  /fictional/i,
];

for (const file of files) {
  const content = readFileSync(resolve(directory, file), "utf8");
  const header = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!header) throw new Error(`${file} is missing frontmatter`);
  const metadata = Object.fromEntries(
    header[1]
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      }),
  );
  for (const field of ["slug", "title", "summary", "group", "order"])
    if (!metadata[field]) throw new Error(`${file} is missing ${field}`);
  if (slugs.has(metadata.slug)) throw new Error(`Duplicate slug ${metadata.slug}`);
  if (orders.has(metadata.order)) throw new Error(`Duplicate order ${metadata.order}`);
  slugs.add(metadata.slug);
  orders.add(metadata.order);
  for (const pattern of forbidden)
    if (pattern.test(content))
      throw new Error(`${file} contains forbidden demo content matching ${pattern}`);
}

const config = readFileSync(resolve("content/docs/configuration.md"), "utf8");
for (const option of [
  "service",
  "endpoint",
  "environment",
  "apiKey",
  "batchSize",
  "flushIntervalMs",
  "maxQueueSize",
  "requestTimeoutMs",
  "retryBaseMs",
  "retryMaxMs",
  "meterSpoolDirectory",
  "fetchInstrumentation",
  "healthIntervalMs",
  "meters",
  "onTelemetryError",
]) {
  if (!config.includes(`\`${option}\``)) throw new Error(`SDK configuration omits ${option}`);
}

for (const artifact of ["public/llms.txt", "public/llms-full.txt"]) {
  const generated = readFileSync(resolve(artifact), "utf8");
  if (!generated.includes("Sightglass")) throw new Error(`${artifact} was not generated correctly`);
}
if (!readFileSync(resolve("public/sitemap.xml"), "utf8").includes("sightglass-docs.trugraph.io")) {
  throw new Error("public/sitemap.xml was not generated correctly");
}

console.log(`Validated ${files.length} canonical documentation pages.`);
