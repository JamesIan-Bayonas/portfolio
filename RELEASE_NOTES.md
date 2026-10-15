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

## Maintenance release — 15 October 2026

The combined release adds local Engineering Note creation and browser draft recovery, Filipino CentraLog and DormFix written case studies, recorded historical application test execution, stronger question matching, and tagged English project briefs. Public editor code/API and unpublished article copy remain excluded from delivery. Existing application working trees and unrelated Windows/export files are excluded from this release.

TypeScript, 95 tests, build, and 28-page verification passed under Node.js 22.23.3. PDF content/structure/link validation and four rendered-page inspections passed. Browser zoom, screen-reader speech, reduced-motion emulation, and new DormFix mobile interaction remain unverified after native browser control stopped; ACCESSIBILITY_REVIEW.md preserves those limits. The recorded historical IsdaLog suite remains 4/5 with its failure explained.

Published through the existing main-branch Vercel workflow: implementation 838bf68, PDF 1.7 header correction cd278d9, and reproducible styling fix [154f4ba](https://github.com/JamesIan-Bayonas/portfolio/commit/154f4ba). Vercel completed successfully. `npm run verify:live` passed for 28 routes, 48 built assets, both RSS feeds, the application execution download, four PDF hashes, and four excluded owner routes.

Tailwind now scans only App.tsx and the component directory. Local untracked exports and documentation no longer change public CSS. A frozen-lockfile clean snapshot produced the same 39 JavaScript/CSS assets byte-for-byte as the working checkout.

## Professional workspace refinement — 15 October 2026

The local editor now maintains About, Now, and How I can help in paired English/Filipino fields with unsaved public-layout previews, validated atomic saves, protected identities/links, and recovery upgrades. Original professional copy and search metadata remain unchanged. TypeScript, 99 tests, build, and 28-page static verification passed. Local browser checks verified save/block/recover/restore behavior and 320px editor reflow. Source [da038b8](https://github.com/JamesIan-Bayonas/portfolio/commit/da038b8) was published through the existing main-branch workflow and Vercel completed successfully. Direct live verification passed for 28 routes, 47 exact built assets, both feeds, application evidence, four PDF hashes, and five excluded editor/API endpoints.

## Interactive visual design — 15 October 2026

Homepage and Explore now feature a selectable project atlas: moving constellations, pointer response, connection signals, project/workflow detail, and real technology navigation. Explore includes an editorial heading and animated result entry. Motion can be paused and respects reduced-motion preferences; decorative processing suspends offscreen/backgrounded. Original project credit and evidence are retained. Local browser checks covered keyboard selection, pause/resume, filter integration, themes, and 320px reflow. TypeScript, 99 tests, build, and static verification passed; source [d8156c7](https://github.com/JamesIan-Bayonas/portfolio/commit/d8156c7) deployed successfully. Live checks passed for 28 routes, 49 built assets, feeds, application evidence, PDF hashes, and five excluded owner/API endpoints. Live homepage selection retained the correct DormFix contribution credit.

## Interaction design refinement — 15 October 2026

Added card pointer/focus treatments, expandable project filters and removable chips, terminal-style search, Lab reset and progressive guidance, project-specific particle morphs, and an optional lazy-loaded profile command explorer. The profile explorer uses the existing paired professional content, real technology filters, project credits, and standard page destinations. TypeScript, 102 tests, the build, and static verification of 28 pages passed. See QUALITY_REVIEW.md for browser checks and remaining manual accessibility/motion review.
