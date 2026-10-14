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
| Content editor / CMS | Maintaining notes and milestones through repository files becomes a recurring burden | Optional later |
| Additional languages | A defined audience needs a second language and translations can be maintained | Optional later |
| Portfolio question assistant | Guided questions and published project records with case-study, source, test, demo, profile, and comparison links | Ready locally |
| Personal interests or reflections | James wants a broader author profile and has original content to publish | Optional later |

## Tracking each future change

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
