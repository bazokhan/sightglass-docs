---
name: tanstack-coolify-deploy
description: TanStack Start + Vite + Coolify deployment and SEO/head gotchas. Use when building, deploying, or debugging a TanStack Start app on a non-Vercel/Cloudflare target (Coolify, plain VPS, Node host), or when the rendered HTML is missing the favicon/canonical link, the stylesheet, or other head tags the route declared in `head()`.
---

# TanStack Start on Coolify / Node — what to know up front

This is the Sightglass docs repo: TanStack Start 1.168+, React 19, Tailwind 4, Nitro 3.0 beta, Vite 8, Bun. It was originally on Vercel, moved to Coolify. Almost every "the rendered HTML is wrong" bug below was debugged the hard way; this skill is the shortcut.

## Deploy to Coolify (or any Node host)

Three things must be set, or Railpack falls back to a static-site build and fails on `dist/`:

1. **Pin the Nitro preset to `node-server`.** The Lovable editor sets `cloudflare-module` so the in-editor build produces a Cloudflare Worker. Outside the editor, pin it in `vite.config.ts`:

   ```ts
   import { defineConfig } from "@lovable.dev/vite-tanstack-config";
   export default defineConfig({
     nitro: { preset: "node-server" },
     tanstackStart: { server: { entry: "server" } },
   });
   ```

2. **Add a `start` script** so Railpack detects this as a Node service, not a static site. The default `vite build` output goes to `.output/`, not `dist/`:

   ```json
   "scripts": { "start": "node .output/server/index.mjs", "build": "vite build" }
   ```

3. **Set the build's start command in Coolify** to `bun run start` (or `node .output/server/index.mjs`). Port is `3000` by default; Coolify's `PORT` env var is honored by Nitro.

Symptom of missing any of these: the build runs, then `copy /app/dist` errors with `"/app/dist": not found` because Nitro outputs to `.output/`, not `dist/`.

## Vercel redirects when the canonical host changes

If the docs host moves (e.g. `sightglass-docs.trugraph.io` → `sightglass.trugraph.io`), `vercel.json` redirects need both the bare-host `/` rule and the `/:path*` rule pointing at the new canonical, otherwise Vercel hits a 404 for the root path:

```json
{ "source": "/", "has": [{ "type": "host", "value": "old.vercel.app" }],
  "destination": "https://new.trugraph.io/", "permanent": true },
{ "source": "/:path*", "has": [{ "type": "host", "value": "old.vercel.app" }],
  "destination": "https://new.trugraph.io/:path*", "permanent": true }
```

## SEO/OG pattern

Centralise the head bundle in one helper. Do NOT name the helper `useSeo` — the React hooks rules-of-hooks lint flags it as a hook even though TanStack's `head()` is not a component. Use `buildSeo` (or similar) and call it inside `head: () => ({...})`.

**Don't pre-format titles.** TanStack applies a title template automatically. If you set `{ title: "Quickstart docs — Sightglass" }` AND a title template, you get `Quickstart docs — Sightglass — Sightglass`. Pass the raw title and let the framework append.

**JSON-LD scripts go in the `scripts` field**, not as inline JS. Each script has `{ type: "application/ld+json", children: JSON.stringify({...}) }`. `headContentUtils` escapes the JSON correctly for SSR.

**OG image.** SVG og-image works on LinkedIn / Discord / Slack; Facebook and Twitter reject it. Always emit a PNG via `?url` + a `prebuild` step that rasterises the SVG with `@resvg/resvg-js` (prebuilt native binaries, no headless browser). Same for apple-touch-icon.

```ts
// vite.config.ts
export default defineConfig({
  // ...
  vite: { build: { /* leave cssCodeSplit on for now */ } },
});

// package.json
"prebuild": "bun run generate:llms && bun run generate:og",
"generate:og": "node scripts/build-og.mjs",

// scripts/build-og.mjs
import { Resvg } from "@resvg/resvg-js";
const resvg = new Resvg(readFileSync("public/og-image.svg"), {
  fitTo: { mode: "width", value: 1200 },
});
writeFileSync("public/og-image.png", resvg.render().asPng());
```

## THE stylesheet-in-SSR bug (still open)

In this Vite + TanStack Start + React 19 build, **every `<link rel="stylesheet">` and `<style>` child is dropped from the SSR head**. Hit-confirmed symptoms:

- Route's `head()` returns `{ links: [{ rel: "stylesheet", href: appCss }] }` → link absent from HTML.
- Hardcoded JSX `<link rel="stylesheet" href={appCss} />` in `RootShell` → absent.
- Manifest's per-route `css` field is correctly populated (Vite tracks `importedCss` per chunk via `chunk.viteMetadata?.importedCss`), `createStartHandler` calls `attachRouterServerSsrUtils` on the router, `buildTagsFromMatches` builds `manifestCssTags` — but the rendered HTML still has no stylesheet link.
- Even raw `<style>{cssText}</style>` with `dangerouslySetInnerHTML` is dropped.

Root cause: `Asset.cjs` sets `precedence: "default"` on every stylesheet link, and React 19's streaming SSR hoists precedence-tagged links into a JS-driven preload path that doesn't fire during the initial server render. The link never makes it into the HTML.

### What's required to fix it properly

1. `Asset.cjs` should NOT set `precedence` on links coming from `manifestCssTags` (they're not user-hoisted resources — they're build-emitted external CSS).
2. OR `buildTagsFromMatches` should emit `<style>{inlineCss}</style>` instead of `<link rel="stylesheet">` when `manifest.inlineCss` is set, and the Vite plugin should populate `inlineCss` from the CSS bundle.
3. OR add a Nitro response hook to inject the link after the React stream finishes. Nitro 3 does not currently expose a `render:html` / `render:response` hook, so this requires patching the Nitro server entry.

### Workarounds that work today

- **Client-side injection** (current state of this repo): a `useEffect` in `RootShell` creates the `<link>` and appends it to `document.head`. There's a brief FOUC on first paint; CSS lands when React mounts. Acceptable for a docs site; not for anything user-perceived-styled above the fold.
- **Inlining all CSS as a `<style>` block** also gets dropped by React 19 SSR (verified), so this does not work.

The Vite + TanStack team is aware (`@tanstack/start-plugin-core` references `inlineCss` for rsbuild but the Vite path doesn't wire it up). The cleanest interim fix would be a one-line change in `Asset.cjs` to skip `precedence` for `manifestCssTags`, or a Vite plugin that emits a Nitro response hook to inject the link post-render.

## Verifying the deploy

```bash
bun run check   # validate:content + lint + build
node .output/server/index.mjs &
curl -s http://localhost:3000/ -o /tmp/page.html
grep -c "stylesheet" /tmp/page.html   # 0 = the bug above; >0 = working
```

Always check the actual rendered HTML — don't trust the build success. The CSS-shipping bug is silent at build time.
