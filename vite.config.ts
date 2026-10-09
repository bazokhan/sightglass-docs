// Lovable's adapter provides TanStack Start, React, Tailwind, Nitro, env handling,
// and tsconfig path resolution. Keeping this as the build entrypoint means the
// same repository works in Lovable, Vercel, and a local checkout.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Nitro defaults to the cloudflare-module preset so the editor's
  // LOVABLE_NITRO_PRESET keeps shipping its worker output. Outside the
  // editor (Coolify, local) we pin node-server so the build produces a
  // runnable .output/server/index.mjs and Railpack can serve it.
  nitro: { preset: "node-server" },
  tanstackStart: { server: { entry: "server" } },
});
