# Portfolio feature roadmap

Updated: 14 October 2026 (Asia/Singapore)

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

The current core roadmap and listed extensions are complete. The content workspace remains an owner-only local tool. Future additions should address a concrete visitor or maintenance need.

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
- Detailed validation and scope limits are recorded in QUALITY_REVIEW.md. The core roadmap is complete; remaining optional extensions are uncommitted suggestions.

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
