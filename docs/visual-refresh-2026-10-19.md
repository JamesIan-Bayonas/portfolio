# Portfolio visual refresh

The next optional stage, the signature introduction, is complete locally. See [its implementation and validation](signature-introduction-2026-10-19.md).

Implemented locally on 19 October 2026 following the reference review. No deployment, commit, or push was performed.

## Changes

- Rebalanced the homepage heading, spacing, and atlas so the main actions appear in the opening desktop view. The compact atlas retains project selection, contribution credit, direct links, and the particle scene. A native expandable section contains workflow and technologies; the full Explore atlas remains available.
- Introduced a shared page introduction layout, heading scale, spacing, motion durations, and easing. The Lab uses an accented serif phrase; About uses a diagrammatic JIB monogram. Maintained English/Filipino profile content and professional content previews use the shared styles.
- Added four lightweight SVG illustrations: fisheries, receipt review, asset records/valuation, and pharmacy sales. The Lab artwork and ordered stages follow the selected experiment. Drawings are decorative; workflow text remains accessible.
- Converted project preview workflows into compact ordered diagrams, reusing their original narrative from a shared data file. Problem, result, credit, screenshot, comparison, and case-study destinations remain intact.
- Added restrained screenshot emphasis on hover or keyboard focus, selected-atlas copy transitions, and a finite Lab drawing reveal. Coordinated preview scan/transfer/result timings and workflow feedback easing. No additional continuous animation or dependency was introduced.

## Validation

Final checks passed:

- `npm run check`
- `npm test`: 142 passed, 0 failed
- `npm run build`
- `npm run verify:build`: 30 static pages, 14 shared entry assets, 33 responsive screenshots, four project briefs, fonts, metadata, favicon, and resume verified

Browser checks on the local development preview:

- Desktop homepage: both primary actions appear in the opening view.
- 320px homepage: primary link ends at approximately 641px in a 740px-high viewport; both primary buttons are visible.
- 1024 × 600 homepage: primary action ends at approximately 531px; no horizontal overflow.
- 320px Home, Explore, English About, and Filipino About: no horizontal document overflow in inspected states. 390px Lab also fits without horizontal overflow.
- Atlas: DormFix selection preserves collaborative-capstone/feature-developer credit and correct destinations. Enter opens/closes the extended section. Tab after closing moves to the next visible link rather than hidden workflow links.
- Lab: all four experiment selections update the matching illustration, stages, and experiment title.
- Light theme: the diagram uses its darker project accent (CentraLog `#80520d` in the inspected state). Dark layouts were also visually inspected.
- Reduced motion: the homepage reports reduced motion, the atlas stops, and its new copy animation computes to `none`. Text and links remain available. Testing preferences were returned to following the device, and temporary viewport overrides were reset.
- The final browser log contained Motion's expected reduced-motion notice from the preference test, with no application errors.

Screenshots are saved under `output/visual-refresh/`. These checks do not replace a spoken screen-reader review, native-phone gesture checks, or fresh production performance measurements. No performance improvement is claimed from the visual changes.
