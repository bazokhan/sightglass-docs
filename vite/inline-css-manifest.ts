/**
 * Vite plugin: populate the TanStack Start manifest's `inlineCss` field
 * with the contents of the built stylesheet so `buildTagsFromMatches`
 * emits a real <style> tag (via InlineCssStyle) instead of a <link>
 * ref. The current build's `<link rel="stylesheet">` is dropped by
 * React 19's streaming SSR (Asset.cjs sets `precedence="default"` and
 * the hoist path doesn't fire on initial render); the inline `<style>`
 * path uses a different renderer (InlineCssStyle) that survives SSR.
 *
 * The CSS is read from .output/public after the client build writes it
 * and embedded as a base64-encoded JSON literal in the start-manifest
 * virtual module. We also rewrite the `createStartHandler(handler)`
 * call in the default server entry to pass `inlineCss: true` — without
 * that option the manifest pipeline drops our inlineCss before it
 * reaches Asset.cjs. The `TSS_INLINE_CSS_ENABLED` define that gates
 * Asset.cjs's inline path is forced to "true" via `forceInlineCssEnabled`.
 *
 * Status: inlines the CSS into the manifest. Verified by direct
 * import — the runtime `manifest.inlineCss.styles` is populated.
 * The head's `buildTagsFromMatches` does NOT currently emit a
 * <style> tag for it though — there is one more layer in the
 * createStartHandler manifest pipeline that strips the inlineCss
 * before it reaches the head. Root cause unconfirmed; needs further
 * investigation. Until then, the fallback is the client-side
 * useStylesheet() in RootShell that injects the <link> after
 * hydration (FOUC for ~1 frame on first paint).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const STYLESHEET_RE = /"\/assets\/styles-[A-Za-z0-9_-]+\.css"/g;

export function inlineStylesheetManifest() {
  function patchManifest(code: string): string | null {
    const hrefs: string[] = [];
    for (const m of code.matchAll(STYLESHEET_RE)) {
      hrefs.push(m[0].replace(/^"|"$/g, ""));
    }
    if (hrefs.length === 0) return null;
    const stylePayload: Record<string, string> = {};
    for (const href of hrefs) {
      const file = resolve(process.cwd(), ".output/public", href.replace(/^\//, ""));
      try {
        stylePayload[href] = readFileSync(file, "utf8");
      } catch {
        return null;
      }
    }
    const encoded = Buffer.from(JSON.stringify(stylePayload)).toString("base64");
    const replacement = `inlineCss:{styles:JSON.parse(Buffer.from(${JSON.stringify(encoded)}, "base64").toString())},`;
    // Original shape: `export const tsrStartManifest = () => (({routes:{...}}))`
    // Target shape:   `export const tsrStartManifest = () => (({inlineCss:{...},routes:{...}}))`
    const result = code.replace(
      /(export const tsrStartManifest = \(\) => \(\({)routes:/,
      (_, captured) => `${captured}${replacement}routes:`,
    );
    return result === code ? null : result;
  }

  function patchServerEntry(code: string): string | null {
    // The default server entry uses
    // `createStartHandler(defaultStreamHandler)` without inlineCss. Wrap
    // the handler argument into an options object that opts in.
    const result = code.replace(
      /createStartHandler\(([a-zA-Z_$][\w$]*)\)(?!\s*[;)]\s*[,)])/g,
      (_, handler) => `createStartHandler({ handler: ${handler}, inlineCss: true })`,
    );
    return result === code ? null : result;
  }

  return {
    name: "sightglass:inline-stylesheet-manifest",
    applyToEnvironment(environment: { name: string }) {
      return environment.name === "ssr";
    },
    enforce: "post" as const,
    transform(code: string, id: string) {
      if (id.includes("start-manifest")) return patchManifest(code);
      const isServerEntry =
        /server-[A-Za-z0-9_-]+\.(?:m?js)$/.test(id) ||
        /default-entry\/esm\/server\.(?:m?js)$/.test(id);
      if (isServerEntry && code.includes("createStartHandler(defaultStreamHandler)")) {
        return patchServerEntry(code);
      }
      return null;
    },
  };
}
