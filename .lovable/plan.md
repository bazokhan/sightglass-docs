# Add polished technology brand icons

## Goal
Use recognizable brand marks where they improve trust and scanning, without turning the site into a logo wall or implying sponsorship.

## Changes
- Add a small reusable brand-icon component backed by the maintained Simple Icons library, using monochrome marks that inherit the Sightglass design system.
- Add a restrained “Works with your Node stack” integration row on the homepage for Node.js, TypeScript, Express, Fastify, NestJS, Next.js, Prisma, and Docker.
- Add the GitHub mark beside GitHub links in the header, homepage, and footer.
- Add matching brand marks to relevant documentation headings automatically, while leaving unbranded headings unchanged.
- Keep trademark names descriptive only and add a short non-affiliation note near the integration row.

## Technical details
- Use package-provided SVG paths rather than remote image requests, so icons remain fast, stable, theme-aware, and available offline.
- Keep accessible labels on icon-only presentation and avoid hardcoded brand colors that would conflict with the site palette.
- Verify the homepage and framework documentation at desktop and mobile sizes.
