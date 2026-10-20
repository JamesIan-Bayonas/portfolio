# Universo Drago: visual and animation feasibility review

Implementation follow-up: the [visual refresh](visual-refresh-2026-10-19.md), [optional introduction](signature-introduction-2026-10-19.md), and [dimensional atlas](orbital-atlas-2026-10-19.md) are complete locally. Their notes distinguish tested behavior from remaining device and production verification.

Inspected 19 October 2026, Asia/Singapore.

## Finding

The portfolio already has much of the reference's interaction vocabulary. The most useful next step is to improve composition, give individual pages more recognizable artwork, and coordinate existing motion. A new animation framework or a full visual rebuild is not necessary for the recommended first stage.

## Inspection scope

Live browser inspection covered the reference homepage, its ASCII introduction and changing particle figures, Tools, Services, and About. Local browser comparison covered the current homepage, Explore, Lab, and About. Source inspection covered the hero, atlas, directory, profile components, project accents, text decoding, interactive surfaces, workflow previews, result transitions, motion preferences, and existing review notes.

Reference pages:

- [Home](https://universodrago.com/)
- [Tools](https://universodrago.com/tools)
- [Services](https://universodrago.com/servicios)
- [About](https://universodrago.com/about)

This is a desktop visual inspection and source-based feasibility assessment. It does not establish mobile behavior, screen-reader behavior, frame rates, current production performance, or the reference's internal technology. Existing performance reports are historical evidence, not measurements of this working tree. No application code was changed during the inspection phase. Subsequent implementation and validation are recorded in [the visual refresh notes](visual-refresh-2026-10-19.md).

## What the reference does effectively

The homepage makes its particle scene a dominant visual element, with a clear identity and two main destinations. The scene changed between figures during inspection. A separate introduction uses ASCII artwork, terminal text, and scanline texture.

Tools uses circuit traces, small connected labels, traveling light signals, and a large central title. Services uses particle lettering against a dimensional grid. About combines a prominent name, portrait, concise introduction, visible actions, and a compact facts strip. These pages share a technical aesthetic while using different compositions.

The transferable principle is that each visual should introduce or explain its section. The exact dragon artwork, text, and decorative status displays are not needed for this portfolio.

## What already exists locally

The earlier `ANIMATION_REVIEW.md` records a reference inspection and subsequent implementation. Current source confirms these foundations:

| Existing foundation | Relevant source | Implication |
| --- | --- | --- |
| Selectable project particle symbols, morph transitions, depth offsets, workflow links, and motion pause | `src/components/ProjectAtlas.tsx`, `src/components/ProjectAtlas.css` | Extend the existing atlas instead of introducing another particle engine. |
| Project-specific accents with light-theme variants | `src/data/projectAccents.ts` | Continue the existing cyan, purple, amber, and pink project identities. |
| Short text decoding with stable accessible text | `src/components/DecodeText.tsx` | Reuse selectively; a second scramble implementation adds maintenance without a clear benefit. |
| Architecture circuits and scanning tool cards | `src/components/StackFlow.tsx`, `src/components/Toolbox.tsx` | Polish their presentation rather than propose them as missing features. |
| Moving technology strip | `src/components/TechnologyStrip.tsx`, `src/components/SkillsMatrix.tsx` | Improve its role in the page rhythm before adding another moving strip. |
| Workflow previews, animated process stages, and changed-output feedback | `src/components/ToolPreview.tsx`, `src/components/Process.tsx`, shared workflow components | Build on actual user actions and project states. |
| Pointer spotlight/tilt and a code-texture signature | `src/lib/useInteractiveSurfaces.ts`, `src/components/SignatureWordmark.tsx` | Much of the reference's tactile and terminal styling is already represented. |
| Portfolio command navigation, profile explorer, search, appearance and motion controls | `src/components/PortfolioTerminal.tsx`, `src/components/ProfileExplorer.tsx`, preference components | These capabilities already support exploration and personalization. |

## Recommended changes

Complexity is relative implementation effort, not a delivery estimate. Benefit is a design judgment rather than a measured conversion result.

| Priority | Proposal | Concrete application | Complexity | Expected benefit |
| --- | --- | --- | --- | --- |
| 1 | Rebalance the homepage hero | Reduce the compact atlas's vertical footprint; retain the selected project, identity, and direct case-study action. Put extended workflow and technology details farther down or behind an explicit expansion. | Medium | Makes the introduction and primary actions available sooner. |
| 1 | Establish a shared visual hierarchy | Align title sizes, body widths, section spacing, border strength, and supporting text across Home, Explore, Lab, and About. Keep monospace for small technical labels and use display typography deliberately. | Low–medium | Makes the pages feel like one designed portfolio. |
| 1 | Coordinate animation timing | Define shared durations and easing for buttons, cards, section reveals, and project switches. Sequence related elements briefly, then let them settle. | Medium | Makes existing motion feel intentional and reduces competing movement. |
| 2 | Give pages distinctive technical artwork | Explore: emphasize the existing project atlas. Lab: add a compact input-to-result illustration. About: bring the existing monogram/profile treatment into the opening composition. | Medium | Adds the reference's section variety while keeping the portfolio's identity. |
| 2 | Refine project preview presentation | Coordinate existing screenshots, story previews, diagrams, and accent colors. Use one short emphasis on hover, focus, or selection; retain direct case-study links. | Medium | Makes projects more recognizable and easier to scan. |
| 2 | Strengthen meaningful workflow feedback | Refine the existing receipt, settlement, stock, and valuation visuals so connectors and changed values point to the action that just occurred. | Medium | Demonstrates engineering behavior through animation. |
| 3 | Add an optional signature introduction | If desired, reuse the name/monogram or code-texture treatment for a short introduction inside the page, with immediate access to content. | Medium | Adds personality, but offers less practical value than the first two stages. |
| Later | Denser particle scenes or a dimensional scene | Prototype within the existing canvas system and compare against the current scene on representative devices. | High | Potential visual impact; its performance cost and added value remain unmeasured. |

### Most concrete current layout issue

In the inspected desktop viewport, approximately 1280 × 720, the opening homepage view showed the heading and most of the atlas while the main action buttons fell below the first screen. The atlas called “compact” still contains navigation, a particle scene, three workflow cards, project copy, two actions, and technologies. Its height affects the neighboring introduction's placement.

The first implementation should address this composition. It should not force the complete hero into a fixed height on every phone or short screen; readable text and normal scrolling remain necessary.

### Page artwork that fits the content

- **IsdaLog:** catch → bid → handoff → settlement, using its cyan project identity.
- **DormFix:** receipt → extracted fields → checks → review, using its purple identity.
- **CentraLog:** custody and maintenance around a valuation curve, using amber.
- **PharmaLink:** sale → stock change → recorded adjustment, using pink.

These are refinements to existing project stories and demo visuals, not proposals for new application features. Small SVG diagrams and CSS treatments are sufficient for many of them.

## Motion direction

Suggested starting values for a shared system:

- Button and focus feedback: 120–180 ms.
- Card and selected-panel changes: 200–300 ms.
- Section entry: 350–500 ms, usually once per visit.
- Small heading decode: roughly 500–650 ms; the current component already uses 620 ms.
- Background motion: subdued, confined to its section, and paused when offscreen or backgrounded.

These are proposed design values, not externally mandated thresholds. Preserve immediate readable output when reduced motion is active. Keep the selected project stable while someone reads; reserve automatic changes for purely decorative elements. Animate illustrations around actual state changes without delaying validation or results.

## Lower-value directions

Do not prioritize a mandatory full-screen boot sequence, a custom drawing editor for particle shapes, site-wide scanlines, or heavy 3D throughout the portfolio. They add work and visual competition without clearly improving access to projects. A new catalog of tools, games, accounts, or dashboards is also outside this visual enhancement scope.

The terminal, search, project accents, saved exploration, previews, and motion controls already exist. Treat them as foundations to refine, not missing reference features to rebuild. Decorative data streams should not imply measured application activity.

## Implementation sequence and review criteria

1. **Composition pass:** compact the homepage atlas, make primary actions visible in the inspected desktop size, and align the heading/spacing hierarchy across the main pages.
2. **Motion pass:** consolidate timing/easing, refine selected-project transitions, and remove competing decorative motion in the same view.
3. **Identity pass:** enrich page-specific and project-specific illustrations using the existing palette, diagrams, and preview content.
4. **Verification:** inspect desktop and 320–390 px layouts, short screens, touch/focus equivalents, keyboard navigation, light/dark themes, and reduced motion. Confirm project credit, source links, and demo results still match maintained content. For implementation changes, run the project's type, test, production build, and build verification checks as appropriate; compare fresh production performance before increasing continuous canvas work.

The recommended first stage is feasible within the current React, Motion, CSS, SVG, and canvas setup. The actual performance of richer effects requires a prototype and measurement.
