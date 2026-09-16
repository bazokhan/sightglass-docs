# Sightglass documentation

The public documentation and product site for [Sightglass](https://github.com/bazokhan/sightglass), built with TanStack Start, React, Tailwind CSS, and Nitro. The production site and canonical URL is [sightglass-docs.trugraph.io](https://sightglass-docs.trugraph.io).

Official distributions: [npm packages](https://www.npmjs.com/search?q=%40bazokhan%2Fsightglass), [Docker image](https://hub.docker.com/r/bazokhan/sightglass), and [GitHub releases](https://github.com/bazokhan/sightglass/releases).

Canonical documentation lives in `content/docs`. The site does not contain seeded product data or fictional capabilities.

The deployment and operations guides cover the authenticated dashboard, user and key administration, SMTP alerts, local and S3-compatible backups, update checks, and the Coolify Compose template shipped by the main repository.

## Development

```bash
bun install
bun run dev
```

## Verification

```bash
bun run check
```

## Deployment

The repository is configured for Vercel's `tanstack-start` framework preset. Production builds use:

```bash
bun run build
```
