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

## Maintenance release candidate — 15 October 2026

The combined candidate adds local Engineering Note creation and browser draft recovery, Filipino CentraLog and DormFix written case studies, recorded historical application test execution, stronger question matching, and tagged English project briefs. Public editor code/API and unpublished article copy remain excluded from delivery. Existing application working trees and unrelated Windows/export files are excluded from this release.

TypeScript, 95 tests, build, and 28-page verification passed under Node.js 22.23.3. PDF content/structure/link validation and four rendered-page inspections passed. Browser zoom, screen-reader speech, reduced-motion emulation, and new DormFix mobile interaction remain unverified after native browser control stopped; ACCESSIBILITY_REVIEW.md preserves those limits. The recorded historical IsdaLog suite remains 4/5 with its failure explained.

Release uses the existing main-branch Vercel workflow. After deployment, run `npm run verify:live` to compare the public site against the reviewed build. No live completion is claimed until that check passes.
