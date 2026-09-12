/**
 * Single source of truth for product naming.
 * Change these values to rename the product globally.
 */
export const brand = {
  name: "Sightglass",
  nameLower: "sightglass",
  tagline: "Mark what matters. We show you what happened.",
  positioning:
    "Application observability for developers who don't want an observability stack.",
  npmScope: "@sightglass",
  npmPackage: "@sightglass/node",
  dockerImage: "sightglasshq/sightglass",
  port: 7777,
  demoApp: "Acme Cloud",
} as const;

export const B = brand;
