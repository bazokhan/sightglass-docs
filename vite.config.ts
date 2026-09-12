// Lovable's adapter provides TanStack Start, React, Tailwind, Nitro, env handling,
// and tsconfig path resolution. Keeping this as the build entrypoint means the
// same repository works in Lovable, Vercel, and a local checkout.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: { server: { entry: "server" } },
});
