# Particle hero release verification

Verified 17 October 2026 at [the live portfolio](https://jamesian-portfolio.vercel.app/). Application runtime revision: `5648892e70819331f6713adb18cca2be0cd97acb`. The subsequent verification commit adds release evidence and stronger build/live checks; it does not change the application bundle.

## Automated release checks

- TypeScript, all 109 tests, production build, and static-build verification passed.
- Static verification covered 28 pages, 13 shared entry assets, 33 generated screenshot candidates, four project briefs, fonts, metadata, favicon, and resume.
- Live verification covered 28 routes and all 64 built asset hashes, matching the local production build byte for byte. Four PDF hashes, both RSS feeds, and the execution-evidence download also matched.
- Five owner-only routes returned 404. All four development fixture HTML/TSX URLs returned 404 as well.
- Build verification now rejects development fixture files in `dist/tests/fixtures` or fixture entry points in the Vite manifest. A deliberate test copy was rejected with `Development fixture leaked`; after removing the test file, verification passed again.
- [Live verification result](live-verification.json) records the check time, origin, counts, and empty failure list. Source-only fixtures remain available for development and are excluded from production.

## Live browser checks

[Recorded browser checks](browser-checks.json) cover 32 cases: four projects × homepage/Explore × dark/light × desktop/phone. Each case retained correct contribution information, case-study/walkthrough URLs, all three workflow destinations, one pressed project, valid control references, a matching concise status, circular halo dimensions, no clipped control text, and matching document/scroll widths.

Additional live interactions verified:

- Paused project selection settled immediately; the saved pause persisted between routes.
- Keyboard focus reached the selected workflow with its solid outline. Enter opened the existing DormFix and PharmaLink workflow headings.
- Laravel 11 filtering returned only IsdaLog, set `?tech=Laravel+11`, and restored the same result after reload.
- A 1040×600 homepage retained the refined heading top near 136px, a 240px scene, and matching 1030px document/scroll widths.
- Scrolling the unpaused Atlas offscreen set its animation state to false and paused connector playback.
- Inspected warning/error logs were empty. The live origin's original dark theme and unpaused preference were restored after capturing paused stills.

Representative production captures: [desktop homepage](home-desktop-dark.jpg), [phone Explore](explore-phone-light.jpg). The phone still shows the visible scene/workflow portion of the normally scrolling widget.

## Release status and follow-up

The planned richer-hero implementation has completed local and live release verification. This is not certification of every device or assistive technology. Manual checks remain for actual OS/browser reduced-motion and forced-colors settings, screen-reader speech, actual browser zoom, physical touch/coarse input, representative slower/high-DPR devices, and sustained GPU/thermal/battery performance. Prior simulated lifecycle, responsive, and local performance reports remain scoped to their recorded environments.

No additional visual feature is automatically queued by this roadmap. Resolve or record manual checks before making broader accessibility/performance claims; a future visual expansion needs a separate scope decision.
