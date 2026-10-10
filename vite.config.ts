// Lovable's adapter provides TanStack Start, React, Tailwind, Nitro, env handling,
// and tsconfig path resolution. Keeping this as the build entrypoint means the
// same repository works in Lovable, Vercel, and a local checkout.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { inlineStylesheetManifest } from "./vite/inline-css-manifest";

// Vite plugin: force Asset.cjs into the inline <style> path. The
// TanStack Start plugin reads `startConfig.server.build.inlineCss.enabled`
// to set `TSS_INLINE_CSS_ENABLED` via Vite's `define`, but the
// @lovable adapter doesn't forward that option, so the env var is
// always "false" in this build. We override it via a plugin's
// `config()` hook (which runs AFTER the start plugin's config hook and
// therefore wins the merge) so every bundle gets
// `TSS_INLINE_CSS_ENABLED` inlined to "true". Without this, Asset.cjs
// short-circuits the inline path and every <link rel="stylesheet">
// is dropped from the SSR head.
function forceInlineCssEnabled() {
  return {
    name: "sightglass:force-inline-css-enabled",
    enforce: "pre" as const,
    config(config: { define?: Record<string, string> }) {
      config.define = {
        ...config.define,
        "process.env.TSS_INLINE_CSS_ENABLED": JSON.stringify("true"),
      };
      return config;
    },
  };
}

export default defineConfig({
  // Nitro defaults to the cloudflare-module preset so the editor's
  // LOVABLE_NITRO_PRESET keeps shipping its worker output. Outside the
  // editor (Coolify, local) we pin node-server so the build produces a
  // runnable .output/server/index.mjs and Railpack can serve it.
  nitro: { preset: "node-server" },
  tanstackStart: { server: { entry: "server" } },
  // Force the SSR environment to resolve `node` before `browser` so
  // @tanstack/router-core/isServer picks server.js (true) and Asset.cjs
  // takes the inline <style> path. The default Vite order picks
  // `browser` first for this build, which gates Asset.cjs into the
  // <link rel="stylesheet"> path that React 19's streaming SSR drops.
  vite: {
    environments: {
      ssr: { resolve: { conditions: ["node", "import", "default"] } },
    },
  },
  plugins: [forceInlineCssEnabled(), inlineStylesheetManifest()],
});
