/**
 * Rasterise the vector OG assets to PNG so platforms that refuse SVG
 * previews (Facebook, Twitter, LinkedIn legacy scrapers) still render them.
 * Source SVGs live in public/; outputs overwrite the same paths with .png.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const root = resolve(".");
const targets = [
  { svg: "public/og-image.svg", png: "public/og-image.png", width: 1200, height: 630 },
  {
    svg: "public/apple-touch-icon.svg",
    png: "public/apple-touch-icon.png",
    width: 180,
    height: 180,
  },
  { svg: "public/favicon.svg", png: "public/favicon.png", width: 64, height: 64 },
];

for (const { svg, png, width, height } of targets) {
  const buffer = readFileSync(resolve(root, svg));
  const resvg = new Resvg(buffer, {
    fitTo: { mode: "width", value: width },
    background: "transparent",
    font: { loadSystemFonts: true },
  });
  const rendered = resvg.render();
  const pixel = rendered.pixelRatio ?? 1;
  const targetWidth = Math.round(width * pixel);
  if (rendered.width !== targetWidth) {
    // resvg always honours fitTo width; this branch exists only to document
    // the intent when a future caller asks for a different pixelRatio.
    throw new Error(`expected ${targetWidth}px wide render for ${svg}, got ${rendered.width}px`);
  }
  writeFileSync(resolve(root, png), rendered.asPng());
  console.log(`Rendered ${png} (${width}x${height} @${pixel}x)`);
}
