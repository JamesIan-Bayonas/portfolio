# Portfolio feature roadmap

Updated: 15 October 2026 (Asia/Singapore)

## Purpose

Build a portfolio where visitors can discover relevant systems, understand their workflows, inspect engineering evidence, and discuss similar work. Adapt useful patterns from Universo Drago to James Ian Bayonas's own projects and professional context.

References:

- [Universo Drago publications](https://universodrago.com/publications?category=interest): categorized content, filtering, and connected discovery.
- [Universo Drago About](https://universodrago.com/about): journey, capabilities, current work, and roadmap.
- Referenced Codex chat: **Adapt Universo Drago ideas**.

The core scope below was approved for implementation. Optional extensions remain suggestions rather than delivery commitments.

## Status definitions

- **Existing:** implemented in the repository before the current enhancement batch. This status does not substitute for a fresh live-site check.
- **Ready locally:** implemented and checked in the working tree, awaiting publication.
- **Published and verified:** deployed successfully and checked on the public site.
- **Proposed:** recommended future work, with implementation scope still to be chosen.
- **Optional later:** useful if a specific visitor or maintenance need justifies it.
- **Local tool verified:** owner tooling implemented and exercised locally; excluded from the public site build.

## Core features already implemented

| Area | Feature | Scope | Status |
| --- | --- | --- | --- |
| Discover | Project explorer | Search, domain and technology filters, shared URLs | Existing |
| Discover | Portfolio search | Search projects, capabilities, notes, demos, and sections | Existing |
| Discover | Project comparison | Compare two systems, contributions, approaches, and trade-offs | Existing |
| Discover | Engineering capabilities map | Four capabilities connected to documented project evidence | Existing |
| Understand | Dedicated case studies | Four project pages with problems, roles, architecture, workflows, and decisions | Existing |
| Understand | Interactive walkthroughs | IsdaLog custody/settlement, DormFix receipts, CentraLog lifecycle, PharmaLink sales/stock | Existing |
| Understand | Engineering Lab | Shared access to four sample demonstrations | Existing |
| Understand | Screenshot viewer | Captions, original captures, zoom, and keyboard navigation | Existing |
| Understand | Engineering Notes | Four articles with contents, reading times, and project/demo links | Existing |
| Continue | Related projects | Explained recommendations and comparison links | Existing |
| Continue | Walkthrough completion summaries | Sample outcome, engineering explanation, contact, and replay | Existing |
| Share | Project briefs | Four one-page PDFs with case-study and source links | Existing |
| Connect | Project-aware contact | Project-specific inquiry context and a reviewable email handoff | Existing |
| Foundation | Responsive and accessible presentation | Mobile layouts, theme controls, keyboard support, and reduced-motion handling | Existing |
| Foundation | Delivery and metadata | Responsive images, loading improvements, static page metadata, and build checks | Existing |

## Published enhancement batch

| Feature | Implemented scope | Status |
| --- | --- | --- |
| Source-code references | Nine references with explanations, commit-pinned file links, and line ranges | Published and verified |
| Test evidence | Eight scenarios with expected outcomes, scope labels, and commit-pinned test links | Published and verified |
| Filterable Notes archive | Text search, topic/project filters, counts, reset, copied URLs, reload and Back restoration | Published and verified |
| Related Engineering Notes | Two curated recommendations per article, summaries, reading times, and connection explanations | Published and verified |
| Project evolution timelines | Three milestones per project, verified commit timestamps, design context, outcomes, and links | Published and verified |

Last completed validation for this batch: 61 portfolio tests passed; type checks, production build, and static build verification passed. Timeline dates and commits were verified, and responsive navigation was reviewed. Application test evidence describes inspected source assertions; the external application suites were not executed for this batch.

## Completed core implementation

All five items are implemented. Release 7f8b354 was deployed through the established main-branch Vercel workflow on 14 October 2026.

| Order | Work item | Why it matters | Completion criteria | Status |
| --- | --- | --- | --- | --- |
| 1 | Content consistency and version labels | Repository history now exposes differences between historical case-study designs and newer code | Audit project summaries, technologies, notes, source references, timelines, and briefs; clearly identify the version each explanation describes; correct unsupported claims | Published and verified |
| 2 | Publish and verify the current batch | Visitors need access to the enhancements that currently exist only locally | Review the combined changes, complete relevant checks, publish through the repository's established process, then verify live routes, links, downloads, and mobile layouts | Published and verified |
| 3 | Current work / Now page | Show what James is actively building or learning and provide a dated professional update | Add a concise page with confirmed current work, learning priorities, an explicit update date, and relevant project links | Published and verified |
| 4 | Personal journey timeline | Connect the existing project stories to James's education and development experience | Use user-confirmed dates, roles, and milestones; distinguish school, collaborative, and independent work; connect milestones to evidence | Published and verified |
| 5 | How I can help | Connect demonstrated capabilities to the kinds of work a visitor can discuss | Describe supported project types, relevant examples, engagement process, and contextual contact actions using confirmed offerings | Published and verified |

Personal content uses the supplied resume, project documentation, and confirmed project roles. The Now page describes the current portfolio work and project-based learning themes. The contact page invites supported work discussions without claiming employment availability, rates, or client history.

## Extensions

| Feature | When to consider it | Status |
| --- | --- | --- |
| RSS publication updates | One feed for all notes, copyable reader link, article and archive entry points, automatic build generation | Published and verified |
| Content editor / CMS | Local fields and preview for existing notes and milestones, validated saves, conflict checks, and linked portfolio preview | Local tool verified |
| Additional languages | English/Filipino switch; Filipino project overview, professional pages, contact controls, and language metadata | Published and verified |
| Portfolio question assistant | Guided questions and published project records with case-study, source, test, demo, profile, and comparison links | Published and verified |
| Personal interests or reflections | Bilingual reflections on project ownership and reviewing workflow decisions, supporting references, related reading, and RSS | Published and verified |
| Bilingual reflection editing | Paired local fields/previews, protected identities and references, validation, and collection saves | Local tool verified |

## Tracking each future change

The original core roadmap and listed extensions are complete within their recorded scope. The maintenance batch below expands those implementations. The content workspace remains an owner-only local tool. Future additions should address a concrete visitor or maintenance need.

For every feature, record:

1. The visitor problem and bounded scope.
2. Status: proposed, in progress, ready locally, or published and verified.
3. Completion criteria and validation performed.
4. Evidence: changed files, relevant commit or PR, and live URL when published.
5. Any remaining content dependency or limitation.

Review this file before proposing the next feature. Add new items only when they serve a clear visitor or maintenance need, and mark existing items complete instead of allowing the roadmap to grow indefinitely.

## Release evidence

- Implementation: [7f8b354](https://github.com/JamesIan-Bayonas/portfolio/commit/7f8b354), Vercel deployment completed successfully.
- New professional pages: [About](https://jamesian-portfolio.vercel.app/about/), [Now](https://jamesian-portfolio.vercel.app/now/), [How I can help](https://jamesian-portfolio.vercel.app/work-with-me/).
- All 15 public routes returned the expected titles; all four live PDF hashes matched the revised manifest.
- Live navigation and DormFix contact preselection worked. The three professional pages fit 320px without horizontal overflow, and the inspected browser reported no console errors.
- Detailed validation and scope limits are recorded in QUALITY_REVIEW.md. Later sections record the completed extensions and the published maintenance batch.

## RSS extension release — 14 October 2026

- Implementation: [efad330](https://github.com/JamesIan-Bayonas/portfolio/commit/efad330), Vercel deployment completed successfully.
- [Notes feed](https://jamesian-portfolio.vercel.app/notes/feed.xml): all four articles, canonical destinations, summaries, categories, and stable identifiers. Future published notes are included automatically at build time.
- 64 tests, type checks, production build, route/asset verification, and XML parsing passed. Live feed content matched the build; RSS content type, revalidation header, and all article destinations were verified.
- The published archive displayed its follow controls and copy-success feedback. Local article, mobile, theme, and manual-selection checks are detailed in QUALITY_REVIEW.md.

## Portfolio question assistant release — 14 October 2026

- Implementation: [c5bf36e](https://github.com/JamesIan-Bayonas/portfolio/commit/c5bf36e), Vercel deployment completed successfully.
- [Ask about the portfolio](https://jamesian-portfolio.vercel.app/ask/): questions select maintained project records and cite the published destinations. Explore and search provide entry points.
- Scope: project names, technology and domain matches, contribution credits, source/test evidence, sample demos, profile pages, and two-project comparison. Unknown questions offer browsing/contact; rates and availability are not inferred. This bounded guide does not use an external model or store question history.
- 70 tests, type checks, build, and verification of 16 static routes passed. Live checks confirmed metadata and asset delivery, DormFix contribution/version context, .NET project selection, unknown fallback, and 320px layout without horizontal overflow. RSS remained valid with four articles; the inspected console was empty.

## Content workspace release — 14 October 2026

- Implementation: [0f8806d](https://github.com/JamesIan-Bayonas/portfolio/commit/0f8806d), source published and Vercel deployment completed successfully.
- Owner workspace: run `npm run content:edit`, then open [the local editor](http://127.0.0.1:4186/editor/). Instructions and save/recovery behavior are in CONTENT_EDITING.md.
- Scope: existing note copy and milestone explanations, draft preview, protected routes/reviewed references, validated collection saves, and version conflict handling. Publishing remains the repository release workflow.
- Original content values were preserved exactly. All 75 tests and build checks passed; all 16 live route titles and the four-item RSS feed were verified. The public editor and editor API routes returned 404.
- Browser verification covered saving/restoring both collections, local page/title preview, retained unsaved drafts across saves, required-field validation, and 320px layouts with labelled fields and no horizontal overflow. The inspected console was empty.

## Filipino entry-page release — 14 October 2026

- Language choice: Filipino, confirmed by the user. Implementation: [2c43daf](https://github.com/JamesIan-Bayonas/portfolio/commit/2c43daf), Vercel deployment completed successfully.
- Published routes: [Overview](https://jamesian-portfolio.vercel.app/fil/), [About](https://jamesian-portfolio.vercel.app/fil/about/), [Now](https://jamesian-portfolio.vercel.app/fil/now/), [How I can help](https://jamesian-portfolio.vercel.app/fil/work-with-me/).
- Scope: translated project overview and professional content, contact controls, explicit English-resource labels, desktop/mobile language switch, search discovery, and static language metadata. Detailed engineering resources, documents, and email-template labels remain English.
- TypeScript, 79 tests, build, and verification of 20 static routes passed. Live checks confirmed all four Filipino route titles and language alternatives, reciprocal English About metadata, desktop/mobile counterpart switching, a four-note RSS feed, and an empty inspected console. All four Filipino pages fit 320px in local browser review.
- Coverage and maintenance are recorded in LOCALIZATION.md. Source changes prompt review of Filipino copy before release.

## Reflections release — 14 October 2026

- Implementation: [09b78a2](https://github.com/JamesIan-Bayonas/portfolio/commit/09b78a2), Vercel deployment completed successfully.
- Published [English reflections](https://jamesian-portfolio.vercel.app/reflections/) and [Filipino reflections](https://jamesian-portfolio.vercel.app/fil/reflections/): two pieces on project context and reviewing workflow decisions, with supporting references, related reading, and an English RSS feed.
- TypeScript, 83 tests, build, and verification of 26 static pages passed. All six new live routes returned their expected titles, language tags, alternatives, and RSS discovery links.
- The two-item reflections feed and existing four-item notes feed were valid XML, matched the local build exactly, and served the RSS content type and revalidation headers. Live browser review confirmed article navigation, section-preserving Filipino switching, and an empty inspected console. Local mobile, search, and copy checks are recorded in QUALITY_REVIEW.md.

## Reflection editing refinement — 14 October 2026

- Visitor/owner need: the new reflections previously required manual file editing for both languages. The local workspace now provides paired fields, previews, and saved-page links while preserving publication identities and supporting references.
- Implementation: [a410bb8](https://github.com/JamesIan-Bayonas/portfolio/commit/a410bb8), source published and Vercel deployment completed successfully. Status: local tool verified.
- TypeScript, 86 tests, production build, and 26-route verification passed. Browser checks covered bilingual saves/previews, retained unrelated drafts, required-field validation, both records, and 320px layout. Original content was restored after testing.
- Public `/editor/`, `/api/content-editor`, and `/api/content-editor/reflections` returned 404; both public RSS feeds retained their exact built content. Owner instructions are in CONTENT_EDITING.md.

## Maintenance and evidence batch — 14 October 2026

This batch follows the inspection of the completed roadmap. The public changes were published and verified on 15 October 2026. Owner editing remains a local tool; its source is published.

| Work item | Bounded completion criteria | Status |
| --- | --- | --- |
| Create Engineering Notes | Create an article with a unique URL, save and reopen incomplete drafts, edit draft sections, preview the actual article layout, require complete content for publication, derive archive/search/metadata/RSS entries, and exclude draft text from public bundles | Local tool verified; source published |
| Recover unsaved edits | Preserve drafts in browser storage, offer restore/export/discard, retain incomplete text, and block restoration over newer repository collections | Local tool verified; source published |
| Filipino CentraLog case study | Translate the written case study, source/test explanations, and milestones; retain canonical evidence identities; provide counterpart routes and section links; label English demos, documents, and related resources | Published and verified |
| Execute referenced application evidence | Run isolated snapshots at the cited commits, show actual results and scope, retain failures, and provide a downloadable execution record | Published and verified |
| Improve portfolio questions | Recognize common Filipino intents and technology aliases, intersect combined technology criteria, and fall back for unsupported exclusion questions | Published and verified |

Evidence: `src/editor/ContentEditor.tsx`, `src/editor/NotePreview.tsx`, `src/lib/contentEditing.ts`, `src/lib/editorRecovery.ts`, `src/data/filipinoCentralog.ts`, `src/components/ApplicationTestResults.tsx`, `src/data/applicationTestRuns.json`, and `src/lib/portfolioQuestions.ts`. Instructions and detailed validation are in CONTENT_EDITING.md, LOCALIZATION.md, APPLICATION_TEST_RESULTS.md, and QUALITY_REVIEW.md. The combined release is recorded in the 15 October section below.

Application execution found a failure at historical IsdaLog commit `df1ca46`: order creation calls missing `OrderController::store`. The other four selected IsdaLog tests passed. DormFix's seven selected helper tests, PharmaLink's six export tests, CentraLog's three in-memory tests, and its selected disposed-transfer integration assertion passed. CentraLog used a verified disposable schema, with only the temporary fixture database name changed; the schema was removed afterward.

Remaining bounded follow-ups:

- Complete actual browser zoom, screen-reader speech, and reduced-motion preference reviews. PDF structure and visual checks were completed in the 15 October batch below; actual PDF assistive-technology behavior remains pending.
- Extend Filipino coverage to the other case studies and engineering resources when needed; the new translated page retains English interactive demonstrations.
- Professional-profile editing is implemented in the 15 October refinement below.
- A hosted CMS, external-model assistant, and live application sandboxes remain optional later work requiring their own scope and infrastructure. The local editor and current question guide do not depend on them.

## Accessibility and Filipino DormFix — 15 October 2026

- Visitor need: read the DormFix engineering story in Filipino and navigate downloaded briefs through explicit document structure.
- Implemented: `/fil/projects/dormfix/`, paired language/section links, translated contribution/source/test/milestone explanations, English-resource labels, search discovery, and static metadata. The original team credit, historical OCR/Ollama design, later Gemini/PostgreSQL context, and pinned evidence identities remain intact.
- PDF refinement: all four one-page briefs now include English language metadata, title display, H1/H2/paragraph reading-order tags, labelled link annotations, semantic tab order, and decorative artifacts. The authoring process validates structure and original source content; all four files were rendered and visually reviewed. This is not PDF/UA certification or captured screen-reader speech.
- Validation: 95 portfolio tests, TypeScript, production build, and 28-page verification passed under Node.js 22.23.3. The verifier also checks public PDF structural markers, manifest integrity, and both translated case-study chunks. A new `npm run verify:live` command compares deployed pages/assets, feeds, execution data, PDFs, and excluded owner routes against the reviewed build.
- Current status: published and verified through [154f4ba](https://github.com/JamesIan-Bayonas/portfolio/commit/154f4ba). Vercel completed successfully. Direct HTTP checks passed for all 28 public routes, 48 built assets, both RSS feeds, application execution data, all four PDF hashes, and four excluded owner endpoints. Detailed scope is in ACCESSIBILITY_REVIEW.md and QUALITY_REVIEW.md.
- Native browser review stopped because the control tool could not verify the active Edge URL. No browser input followed that stop. Actual zoom, preference emulation, screen-reader speech, and the new DormFix mobile layout remain unverified; earlier browser results are dated separately.

## Professional-page editing — 15 October 2026

- Owner need: update About, Now, and How I can help without editing code or maintaining language copies in separate files.
- Implemented: one paired English/Filipino record, labelled editor fields, shared date, protected routes/identity/project links, atomic saves with version checks, automatic Now-summary synchronization, unsaved public-layout preview, and draft recovery including upgrades of earlier recovery copies. Original copy and search metadata were preserved.
- Validation: TypeScript, 99 tests, production build, and 28-page static verification. Local browser checks covered paired saves, blank-field blocking, incomplete recovery, both preview languages, page selection, and 320px editor reflow. Actual zoom, screen-reader speech, and reduced-motion preference checks remain pending.
- Status: local tool verified; source published through [da038b8](https://github.com/JamesIan-Bayonas/portfolio/commit/da038b8) and Vercel completed successfully. Direct live checks passed for 28 routes, 47 built assets, both RSS feeds, application evidence, four PDF hashes, and five excluded editor/API endpoints. Owner instructions are in CONTENT_EDITING.md.

## Interactive visual design — 15 October 2026

- Visitor need: explore the portfolio through interactive animation inspired by the supplied Universo Drago publications image.
- Implemented: a shared project atlas on the homepage and Explore, with four selectable systems, colored particle constellations, pointer response, animated connection signals, orbital detail, project/workflow links, and technology controls connected to existing filters. Explore gains an editorial gradient heading, content-derived collection counts, and animated result entry. The homepage atlas replaces its typewritten IsdaLog diff panel; the project case studies and engineering evidence remain available.
- Motion: pause/play with a remembered choice, reduced-motion handling, and offscreen/background suspension. The canvas uses bounded point counts, capped pixel density, and a roughly 30fps update ceiling. No new animation dependency or external service was added.
- Validation: 99 existing tests, TypeScript, build, and 28-page static verification; local browser checks for selection, keyboard Enter, project/workflow destinations, technology filtering, light/dark appearance, 320px layouts, pause/resume frames, and empty inspected console logs. Real reduced-motion preference emulation and screen-reader speech remain outside this review.
- Status: published through [d8156c7](https://github.com/JamesIan-Bayonas/portfolio/commit/d8156c7); Vercel completed successfully. Live verification passed for 28 routes, 49 built assets, both feeds, application evidence, four PDF hashes, and five excluded owner/API endpoints. The live homepage also passed a DormFix selection check with its team credit and destinations intact.

## Delivered: reference-inspired interaction refinement — 15 October 2026

- [x] Shared project/experiment card spotlights, corner accents, keyboard focus feedback, and restrained fine-pointer tilt.
- [x] Expandable Explore search/filter panel with individually removable active filters and existing shareable URLs.
- [x] Terminal-style portfolio search, preserving keyboard selection and navigation.
- [x] Lab workbench reset, expandable guidance, and calculation assumptions/source disclosure.
- [x] Four normalized project symbols with 2D canvas particle morphing and the existing pause/reduced-motion controls.
- [x] Optional, lazy-loaded profile command explorer using maintained English/Filipino professional content and real project/technology links.

Validation: 102 tests, TypeScript, production build, and 28 static pages passed. Browser review included 320px reflow, search navigation, filter removal, Lab reset, and localized profile commands. Manual pointer-motion, actual zoom, screen-reader, and reduced-motion preference checks remain listed in QUALITY_REVIEW.md. Accent customization, reading modes, and a full 3D scene are future options, not part of this release.
