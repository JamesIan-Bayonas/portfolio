# Local release candidate — 19 October 2026

The planned visual refresh, optional signature introduction, and orbital atlas are complete locally. This review adds a repeatable production-artifact check for the combined working tree. Nothing has been deployed, committed, or pushed by this release-preparation step.

## Repeatable checks

- `npm run verify:release` runs the type check, tests, build, static artifact verification, and local HTTP artifact verification in sequence.
- `npm run verify:preview` verifies an existing `dist` build using an automatically assigned loopback port, then closes the preview server.
- `npm run preview:release` leaves the built site available at <http://127.0.0.1:4173/> for manual review.

The preview uses Vite's multi-page mode so missing pages return 404 instead of receiving the home page. It applies the exact-path response headers currently configured in `vercel.json`, including the RSS headers. Unsupported future header patterns produce an explicit error so they cannot silently be skipped. A fixture test covers separate generated pages, script assets, RSS headers, and excluded or missing routes.

The HTTP verifier accepts an optional report path. Local preview checks write `.tmp-release-preview-verification.json`, leaving `.tmp-live-verification.json` available for public-site checks.

## Verification results

`npm run verify:release` passed on 19 October 2026:

| Check | Result |
| --- | --- |
| Type check | Passed |
| Automated tests | 146 passed, 0 failed |
| Fresh production build | Passed |
| Static artifact checks | Passed |
| Generated page routes over HTTP | 30 passed |
| Built asset contents over HTTP | 92 passed |
| PDF downloads | 4 passed |
| RSS feeds | 2 passed |
| Execution evidence download | Passed |
| Excluded owner routes | 5 returned 404 |
| Excluded development routes | 4 returned 404 |

The local HTTP report recorded no failures at `2026-10-19T14:27:02.331Z`. A durable copy is saved in [output/release-candidate/verification.json](../output/release-candidate/verification.json). Its temporary origin port is no longer running; the manual preview uses port 4173.

## Production-browser review

The browser loaded the built files from port 4173. Checks covered:

- Orbit and Constellation keyboard activation, preserved project selection and attribution, case-study destination, and project selection while motion is paused.
- Introduction replay and skip, with the skip control retaining focus.
- Search results for DormFix.
- Light appearance and reduced motion, then restoration to device preferences.
- All four Lab project previews and their matching workflow illustrations.
- The React 19 Explore filter, which returned DormFix, CentraLog, and PharmaLink.
- The production regular-expression worker, which returned two matches for its sample input, and JSON formatting.
- Home at 320px and 390px, plus Filipino About at 320px, without horizontal overflow. Atlas appearance controls measured 44px high at 320px.
- Desktop home appearance, with both main actions visible. The captured browser error log was empty.

Evidence: [desktop home](../output/release-candidate/homepage-production.png) and [browser review data](../output/release-candidate/browser-review.json).

## Remaining scope

This is a local artifact preview, not an emulation of all hosting behavior. Hosting redirects, CDN behavior, live response headers, public URLs, and deployment configuration still require verification after publication. The browser review samples representative pages and interactions; it does not establish a complete browser/device matrix, real-phone performance, or a screen-reader audit.

No further visual feature is queued in this plan. The remaining release step is publication of the reviewed changes, followed by verification against the resulting public site.
