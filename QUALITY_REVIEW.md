# Portfolio quality review

Reviewed locally on 13 October 2026. This report records the checks completed before release; it is not a record of published-state verification.

## Completed fixes

- Added a working SVG favicon and verified the résumé asset.
- Added a first-in-tab-order “Skip to content” link and a focusable main landmark.
- Added focus outlines for native disclosure controls and form inputs, semantic process headings, named footer icon links, and larger footer touch targets.
- Applied the user's reduced-motion preference through MotionConfig, CSS transitions/animations, and the scroll-progress indicator.
- Deferred portfolio search until first use. Article content and search now have separate chunks, reducing the main entry script from 405.05 KB to 381.36 KB (127.35 KB to 119.21 KB gzip). These are build sizes, not measured page-speed scores.
- Combined three Google Fonts imports into one early stylesheet request with preconnects.
- Corrected same-page search navigation, including clearing Explore filters when opening its index, preserving query strings on cross-page navigation, and focusing the main content for page results.
- Added home-page Open Graph text and a build verifier for all static page entries, metadata, entry assets, favicon, and résumé.
- Updated skill evidence links to open dedicated case studies and made the five-item home project index adapt to available width.
- Marked the IsdaLog live demo unavailable. Its previous Railway URL returns HTTP 404 with “Application not found”; the author confirmed that the hosting is inactive. Its source, case study, and sample walkthrough remain accessible.

## Verification

- TypeScript check, 43 native Node tests, production build, and `npm run verify:build` passed.
- All 12 routes rendered with one main H1, no duplicate IDs, no missing image alt attributes, no unlabelled form inputs, and no broken same-page fragments or internal route links in the inspected DOM.
- All 12 routes fit a 320 × 760 viewport without document-level horizontal overflow. Desktop and 390px light-theme layouts were also inspected.
- Keyboard checks covered the skip link, search focus cycle, Escape dismissal and return focus, and mobile-menu Escape recovery.
- Search still works when loaded on demand. Opening Explore from a filtered Explore page restores its unfiltered index.
- Dark muted text on the surface measured 5.62:1 contrast; dark accent on the background 7.49:1; light muted text on the background 6.00:1; light accent on the background 4.85:1. These spot checks do not cover every blended, animated, or disabled state.
- DormFix, CentraLog, and PharmaLink live URLs returned HTTP 200. The four project repositories and the linked valuation/adjustment source files returned HTTP 200. This checks URL availability, not authenticated backend workflows.
- No browser console errors appeared in the reviewed local pages.

## Review limits and release follow-up

This was a local structural, keyboard, responsive, asset, and link review. It does not constitute a full WCAG certification, screen-reader audit, security audit, or measured Core Web Vitals assessment. Reduced-motion handling was implemented and reviewed in source; preference emulation was not available in the browser tools.

The other live demos remain linked based on their successful URL responses. IsdaLog needs active hosting and a valid live URL before its live link can be restored through `demoAvailable` in `src/data/projects.ts`. No paid hosting purchase or production deployment was made.

Re-run the checks after further code changes, then verify the published routes and their metadata when deploying.

## Screenshot viewer follow-up — 13 October 2026

The viewer is loaded only after a screenshot button is activated. Closed Explore pages contain no original PNG image elements. Explore's gallery follows filtered results; case-study galleries use the project captures, including six IsdaLog images. Original links, alt text, source dimensions, and workflow captions are retained.

Local browser checks covered arrow-key navigation, zoom and Fit, scrollable zoomed images without aspect-ratio distortion, Tab/Shift+Tab wrapping, Escape dismissal, restored opening-button focus, and restored background scrolling. A single-result filtered gallery disabled previous/next navigation. At 390 × 844, the light-theme dialog fit the viewport, retained usable controls and captions, and caused no document overflow. Dark-theme desktop and IsdaLog walkthrough galleries were also inspected. No console errors appeared. TypeScript, all 43 existing tests, the production build, and all route/image asset checks passed. These checks do not replace a screen-reader audit.

## Project-aware contact follow-up — 13 October 2026

The contact panel preselects its case study and prepares build, improvement, or opportunity drafts using the existing public contact address. Project changes update the subject and canonical reference link. General inquiries omit project-specific context. Blank and overlong descriptions cannot produce a draft. Three added tests cover message limits, project changes, and correct mailto encoding of Unicode, ampersands, and line breaks; all 46 tests passed along with TypeScript, production build, route checks, and image verification.

Browser checks covered DormFix preselection, changing the project to CentraLog, inquiry type changes, live draft review, successful clipboard copying, explicit manual text selection, keyboard focus wrapping, Escape and restored opening-button focus, and mobile/light-theme layout without document overflow. The panel has a sticky close control and scrolls within the viewport. The email handoff is implemented as a user-activated mailto action; no actual email client was launched and no message was sent during testing. Clipboard-denial handling was reviewed in source; the explicit manual-copy route was exercised in the browser.

## Loading and motion follow-up — 13 October 2026

The homepage animation runtime is separated from the shared shell and preloaded only on Home. Case studies load their own walkthrough, with a reserved fragment target while loading. Navbar section observation now binds sections after lazy mounting. A native progress indicator batches updates; CSS handles the cursor and mobile menu, decorative typing stops when offscreen/hidden, and the footer pulse pauses offscreen. Loading placeholders use stable reserved areas without an animated shimmer.

TypeScript, 46 tests, the production build, static dependency-graph assertions, all 12 route entries, and all 33 image variants passed. Local checks exercised Explorer filters, screenshot and contact panels, mobile-menu Escape and return focus, all four case-study walkthrough fragments, active home navigation after delayed mounting, calculator changes, Lab switching, and notes/search. No console errors or document overflow were observed. The live Explore page confirmed that no animation preload was added. Fresh baseline and retest reports, timing limits, and remaining diagnostics are recorded in `PERFORMANCE_REVIEW.md`.

## Visitor journey follow-up — 13 October 2026

`VISITOR_REVIEW.md` records the task walkthrough, concrete fixes, verification, and human-testing limits. The home primary action now opens Explore; case-study headers expose contact and the written explanation directly. Role labels and screenshot captions are more specific. Zoomed gallery regions preserve arrow-key panning, and gallery position/title changes have explicit status markup. All 12 routes fit 320 pixels in the inspected DOM, with one H1, no duplicate IDs, no missing alt attributes, and no unlabelled fields. Keyboard recovery, 46 tests, build checks, and image verification passed. Actual screen-reader speech, browser zoom, and reduced-motion preference emulation remain untested; this is not a WCAG certification or a human usability study.


## Project comparison — October 13, 2026

Explore now compares two projects using shared case-study content. Browser checks covered selection, disabled duplicate options, changing filters without losing the pair, URL reload restoration, independent clearing, DormFix team credit, and CentraLog contact context with Escape focus recovery. At 320px the comparison stacked without document overflow. TypeScript, 48 tests, the production build, and all static-page/image checks passed. No message was sent during contact verification.


## Case-study section navigation — October 13, 2026

All four dedicated case studies now have shared section navigation. Browser checks verified that every link has a target, direct engineering-decision fragments load below the sticky bar, and current-section highlighting responds to manual scrolling. Compact-menu selection closes the menu and focuses the destination; Escape restores menu-button focus. All four pages showed no horizontal overflow at 320px. Desktop navigation fit one row at 1280px. The copy action showed its success status; clipboard contents could not be independently read through the browser tool. No browser console errors were observed in the inspected page. TypeScript, 48 existing tests, production build, and static asset checks passed.

