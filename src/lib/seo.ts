/**
 * Centralised SEO/OG/Twitter meta. Every route's `head()` runs through
 * `buildSeo({...})` so titles, descriptions, canonical URLs, and previews stay
 * consistent. Image + URL builders rely on `brand.docsUrl` as the canonical
 * origin; swap the brand constant to retarget everything.
 */
import { B, siteUrl } from "@/lib/brand";

export const SEO = {
  siteName: B.name,
  defaultTitle: B.name,
  defaultDescription: B.positioning,
  defaultKeywords: [
    "application observability",
    "opt-in tracing",
    "self-hosted observability",
    "Node.js observability",
    "TypeScript SDK",
    "durable metering",
    "Prisma tracing",
    "Express tracing",
    "Fastify tracing",
    "NestJS tracing",
    "Next.js tracing",
    "SQLite observability",
    "OpenTelemetry alternative",
  ],
  ogImage: "/og-image.png",
  ogImageFallback: "/og-image.svg",
  appleTouchIcon: "/apple-touch-icon.png",
  twitterHandle: "@sightglass",
  locale: "en_US",
} as const;

export type SeoInput = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
};

export type SeoOutput = {
  meta: Array<Record<string, string>>;
  links: Array<Record<string, string>>;
  scripts: Array<Record<string, unknown>>;
};

/**
 * Build the standard head bundle for a route. Pass at minimum a `title`; the
 * rest fall back to brand defaults so no route accidentally ships an empty
 * description or a relative canonical.
 */
// Named `build*` instead of `use*` so the React rules-of-hooks lint doesn't
// flag the route-level calls (TanStack `head()` is not a component).
export function buildSeo(input: SeoInput): SeoOutput {
  const title = input.title || SEO.defaultTitle;
  const description = input.description || SEO.defaultDescription;
  const path = input.path || "/";
  const canonical = siteUrl(path);
  const image = input.image || SEO.ogImage;
  const imageAbsolute = new URL(image, canonical).toString();
  const type = input.type || "website";
  const keywords = [...SEO.defaultKeywords, ...(input.keywords ?? [])].join(", ");

  const meta: Array<Record<string, string>> = [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
    { name: "color-scheme", content: "dark light" },
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "author", content: B.name },
    { name: "application-name", content: B.name },
    { name: "generator", content: `${B.name} docs` },
    { name: "theme-color", content: "#111417" },
    { name: "theme-color", content: "#0c0e10", media: "(prefers-color-scheme: dark)" },
    { name: "apple-mobile-web-app-title", content: B.name },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    { name: "format-detection", content: "telephone=no" },
    ...(input.noindex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
    { property: "og:site_name", content: SEO.siteName },
    { property: "og:locale", content: SEO.locale },
    { property: "og:type", content: type },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonical },
    { property: "og:image", content: imageAbsolute },
    { property: "og:image:secure_url", content: imageAbsolute },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: `${B.name} — ${B.tagline}` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: SEO.twitterHandle },
    { name: "twitter:creator", content: SEO.twitterHandle },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageAbsolute },
    { name: "twitter:image:alt", content: `${B.name} — ${B.tagline}` },
    ...(input.publishedTime
      ? [{ property: "article:published_time", content: input.publishedTime }]
      : []),
    ...(input.modifiedTime
      ? [{ property: "article:modified_time", content: input.modifiedTime }]
      : []),
    { property: "og:see_also", content: B.sourceUrl },
    { property: "og:see_also", content: B.docsSourceUrl },
  ];

  const links: Array<Record<string, string>> = [
    { rel: "canonical", href: canonical },
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "icon", type: "image/png", sizes: "64x64", href: "/favicon.png" },
    { rel: "apple-touch-icon", href: SEO.appleTouchIcon },
    { rel: "apple-touch-icon", sizes: "180x180", href: SEO.appleTouchIcon },
    { rel: "manifest", href: "/manifest.webmanifest" },
    {
      rel: "alternate",
      type: "application/rss+xml",
      title: `${B.name} releases`,
      href: `${B.releasesUrl}.atom`,
    },
  ];

  return { meta, links, scripts: [] };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: B.name,
    url: B.docsUrl,
    description: B.positioning,
    inLanguage: SEO.locale,
    publisher: {
      "@type": "Organization",
      name: "Trugraph",
      url: "https://trugraph.io",
      logo: new URL("/og-image.png", B.docsUrl).toString(),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${B.docsUrl}/docs/{search_term}`,
      "query-input": "required name=search_term",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Trugraph",
    url: "https://trugraph.io",
    logo: new URL("/og-image.png", B.docsUrl).toString(),
    sameAs: [B.sourceUrl, B.docsSourceUrl, B.npmScopeUrl, B.dockerUrl],
  };
}

export function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: B.name,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Application Observability",
    operatingSystem: "Linux, macOS, Windows (Docker)",
    description: B.positioning,
    url: B.docsUrl,
    downloadUrl: B.dockerUrl,
    softwareVersion: B.releaseVersion,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: organizationJsonLd(),
  };
}
