# Portfolio release preparation

Prepared on 13 October 2026 for the existing Vercel project connected to the repository's `main` branch.

## Included work

- Four dedicated project case studies with contribution credits and original screenshots.
- Guided sample workflows for IsdaLog, DormFix, CentraLog, and PharmaLink.
- `/explore/` with combined text, domain, and technology filters and shareable filter URLs.
- `/lab/` with selectable, lazy-loaded demonstrations and experiment deep links.
- `/notes/` and four project-specific engineering articles.
- Shared search, dark/light themes, keyboard access, reduced-motion handling, static route metadata, and a résumé download.
- IsdaLog's inactive live hosting marked unavailable while its source and local demonstration remain accessible.

## Release configuration and validation

`vercel.json` selects Vite and the `dist` output directory. It installs with pinned pnpm 10.34.3 and a frozen lockfile, then runs TypeScript checks, all tests, the production build, and static-output verification. The Node.js release line is pinned to 22.x in `package.json`.

The stale lockfile's `framer-motion` importer was synchronized with the application's `motion` dependency. A frozen install succeeded. TypeScript validation, 43 tests, the production build, and all 12 generated-page checks passed under Node.js 22.23.3.

Unrelated Windows metadata files and the existing repository export are excluded from the release commit. No paid hosting or new hosting project is required for the portfolio release.

The local quality-review findings and limitations are documented in `QUALITY_REVIEW.md`. After deployment, verify the existing public address, all project and article routes, Lab deep links, Explore filters, search, page metadata, and the résumé.
