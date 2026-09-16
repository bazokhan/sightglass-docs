/**
 * Single source of truth for product naming.
 * Change these values to rename the product globally.
 */
export const brand = {
  name: "Sightglass",
  nameLower: "sightglass",
  tagline: "Mark what matters. We show you what happened.",
  positioning: "Application observability for developers who don't want an observability stack.",
  npmScope: "@bazokhan",
  npmPackage: "@bazokhan/sightglass-core",
  dockerImage: "bazokhan/sightglass",
  releaseVersion: "0.1.3",
  port: 7777,
  docsUrl: "https://sightglass-docs.trugraph.io",
  sourceUrl: "https://github.com/bazokhan/sightglass",
  docsSourceUrl: "https://github.com/bazokhan/sightglass-docs",
  releasesUrl: "https://github.com/bazokhan/sightglass/releases",
  npmUrl: "https://www.npmjs.com/package/@bazokhan/sightglass-core",
  npmScopeUrl: "https://www.npmjs.com/search?q=%40bazokhan%2Fsightglass",
  dockerUrl: "https://hub.docker.com/r/bazokhan/sightglass",
} as const;

export const B = brand;

export function siteUrl(path = "/"): string {
  return new URL(path, `${brand.docsUrl}/`).toString();
}
