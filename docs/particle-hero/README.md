# Richer particle hero: scope and baseline

Stage 1 completed on 16 October 2026 (Asia/Singapore). Runtime baseline: commit `a5845ac6890e562dbb944dd7c0ac848c3ebcb7c2`.

## Visitor goal

Make the selected project recognizable and its workflow understandable through a layered constellation. Keep the introduction, contribution credit, project selection, and useful destinations easy to read and operate.

This stage defines scope and records the current implementation. It does not introduce the richer scene or change runtime behavior. The images are before-change references, not proposed designs.

## First-release scope

- Larger, recognizable symbols for the existing four projects.
- Three restrained visual layers: sparse background, meaningful connections, and a foreground project symbol.
- Up to three documented workflow labels for the selected project, represented as accessible HTML where practical.
- One short, interruptible project-selection sequence, provisionally 700–900ms, tuned after visual review. Content and destinations update immediately; only decoration interpolates.
- Fine-pointer parallax with bounded movement; touch and keyboard selection provide the complete experience without it.
- Existing pause persistence, static reduced-motion rendering, and offscreen/background suspension.
- Separate responsive treatment for the compact homepage Atlas and full Explore Atlas.
- Reuse the current React, CSS, SVG, and 2D canvas implementation. Introduce no 3D dependency in this release.

Excluded: automatic project cycling, visitor drawings, uploaded/custom figures, free camera controls, camera fly-throughs, a WebGL/3D engine, and live operational telemetry. The scene must not imply that a payment, database transaction, inventory update, or delivery is actually occurring.

## Existing implementation to preserve

| Area | Current behavior | Requirement for the upgrade |
| --- | --- | --- |
| Homepage | `Hero.tsx` renders `<ProjectAtlas compact />`; the scene sits beside the introduction on wide screens, with its project description below the scene | Preserve the introduction, primary actions, compact variant, and readable selected-project information |
| Explore | `Explore.tsx` renders the full Atlas with an `onTechnology` callback; scene and description sit beside each other on wide screens | Preserve the full variant, workflow text, filtering behavior, and comparison/filter state |
| Selection | Four native buttons use `aria-pressed` and `aria-controls`; one project is selected | Keep keyboard focus and exactly one selection; rapid input must settle on the latest project |
| Project information | Name, category, title, contribution credit, and links derive from maintained project records | Preserve the exact project identity, contribution, version context, and destinations |
| Workflow | Full Atlas displays the first three maintained workflow titles; compact Atlas hides that list | Use maintained workflow data rather than a conflicting parallel account; decide placement during the static composition stage |
| Technology controls | Homepage anchors open shareable Explore filters; Explore buttons set a technology filter and scroll to results | Preserve both behaviors; do not replace controls with canvas hit areas |
| Motion preference | `portfolio-atlas-paused` persists in local storage; pause works even if storage is unavailable | Keep the stored preference and graceful storage fallback |
| Paused selection | Selecting another project still updates its details while the Atlas remains stopped; source draws its symbol without morphing | Pause must not disable discovery or navigation |
| Reduced motion | Preference changes are observed; motion is stopped and the motion button reads Reduced motion | Show a complete static scene immediately; keep selection and destinations available |
| Rendering | Canvas and decorative SVG are aria-hidden; project content remains HTML | Retain accessible text and visible keyboard focus; avoid decorative announcements |
| Lifecycle | Canvas and CSS effects suspend offscreen/backgrounded; observers/listeners/frames are cleaned up | Preserve suspension and cleanup across selection, resize, navigation, and preference changes |

Source anchors: [ProjectAtlas.tsx](../../src/components/ProjectAtlas.tsx), [ProjectAtlas.css](../../src/components/ProjectAtlas.css), [atlasSymbols.ts](../../src/lib/atlasSymbols.ts), [Hero.tsx](../../src/components/Hero.tsx), [Explore.tsx](../../src/components/Explore.tsx).

## Rendering baseline and performance boundaries

Source inspection found 60 surrounding particles (four groups of 15) and 96 foreground symbol points by default. Symbol generation normalizes counts between 16 and 160. The renderer caps pixel density at 1.5 and gates updates at a 32ms interval, roughly a 30fps target. These are implementation limits, not measured device-performance results.

Keep those limits as the starting budget. Do not increase particle density until the static composition and depth prototype justify it. Measure rendering cost and responsiveness before setting a larger budget. Do not add a second perpetual animation loop for depth or connections.

## Visual baseline

All captures use the existing IsdaLog selection with motion deliberately paused. Desktop browser viewport: 1440 × 1000. Phone browser viewport: 390 × 844. Phone captures separate the scene from its project details so both remain inspectable at a normal phone aspect ratio.

| Surface | Desktop dark / light | Phone dark | Phone light |
| --- | --- | --- | --- |
| Compact homepage | [Dark](baseline/home-desktop-dark.jpg), [Light](baseline/home-desktop-light.jpg) | [Scene](baseline/home-phone-dark-scene.jpg), [Details](baseline/home-phone-dark-detail.jpg) | [Scene](baseline/home-phone-light-scene.jpg), [Details](baseline/home-phone-light-detail.jpg) |
| Full Explore | [Dark](baseline/explore-desktop-dark.jpg), [Light](baseline/explore-desktop-light.jpg) | [Scene](baseline/explore-phone-dark-scene.jpg), [Details](baseline/explore-phone-dark-detail.jpg) | [Scene](baseline/explore-phone-light-scene.jpg), [Details](baseline/explore-phone-light-detail.jpg) |

[Capture manifest](baseline/manifest.json) records the source revision, browser dimensions, selected-project checks, technology filter check, image dimensions, and hashes. Browser screenshot dimensions may exclude scrollbar/browser surface pixels; use the manifest rather than assuming image width equals requested viewport width.

Observed opportunities for the static redesign: the central symbols occupy a small part of the scene; orbit rings compete with their outlines; some light-theme accent labels are faint. Preserve functionality and meaning rather than reproducing these visual limitations. Contrast needs measurement during the redesign.

## Checks completed in this stage

- Enter selected all four projects, retained focus on the activated button, and left exactly one pressed button.
- Project case-study and walkthrough URLs matched each selected project.
- DormFix retained Collaborative capstone / Feature developer; the other three retained their documented independent/school context and sole-developer credit.
- Pausing persisted from homepage to Explore and back. Selecting DormFix while paused updated its details while `data-stopped` remained true.
- Explore's Laravel 11 control returned IsdaLog and wrote `?tech=Laravel+11` to the URL.
- At 1440px, document and scroll widths both measured 1430px. At 390px, both measured 380px on homepage and Explore.
- Both themes were captured; inspected Explore warning/error logs were empty. Original dark theme and unpaused setting were restored after capture.
- All 12 screenshot files were decoded and their metadata checked; representative desktop and phone images were visually inspected.

Not established by this stage: measured frame rate or CPU/GPU cost, physical-phone performance, screen-reader speech, actual reduced-motion preference emulation, actual browser-zoom behavior, or quantitative color contrast. Lifecycle and reduced-motion preservation requirements above are based on source inspection where no browser check is listed. Screenshots do not prove motion timing or performance. Runtime tests/builds were not rerun for this documentation-only change.

## Implementation milestones and acceptance criteria

| Stage | Status | Required outcome |
| --- | --- | --- |
| 1. Scope and baseline | Complete | Bounded first release, preservation checklist, source revision, 12 captures, and recorded checks |
| 2. Project scene data | Complete | Identity-keyed scenes supply symbols, accents, existing positions/labels, maintained workflow copy, destinations, and provisional future label anchors; existing rendering preserved |
| 3. Static composition | Complete | Larger symbols, quieter surroundings, separate project controls, linked workflow labels, theme-aware accent text, and responsive compact/full layouts |
| 4. Subtle depth | Complete | Three restrained layers and bounded fine-pointer movement; no required hover/touch gesture or second continuous loop |
| 5. Selection transitions | Complete | Immediate text/control updates, finite decoration, latest-selection interruption, stable keyboard focus, no automatic cycling |
| 6. Workflow connections | Next | At most three meaningful labels, valid destinations, no unsupported live-activity implications |
| 7. Motion/accessibility | Planned | Paused/static operation, preference-change handling, suspension/cleanup, accessible content and controls |
| 8. Responsive refinement | Planned | Narrow and short viewports, compact/full variants, no clipping/overflow, ordinary scrolling |
| 9. Performance review | Planned | Measured results on representative hardware; tune density before expanding effects; record limitations |
| 10. Release verification | Planned | Relevant tests, type/build/static checks, keyboard/theme/device review, scoped commits, deployment and live-route verification |

The static composition is the first visual review milestone. A full 3D engine or drawing playground requires a separate scope decision; it is not an automatic continuation of this plan.

## Stage 2: project scene data — 16 October 2026

[atlasScenes.ts](../../src/data/atlasScenes.ts) now defines the four visual identities and builds scene records from the maintained projects. Each scene contains its project reference, normalized symbol points, accent, domain label, existing percentage node position, case-study/walkthrough destinations, first four technologies, and up to three workflow entries. Workflow titles/details are derived from the project record; each entry has a link to that project's workflow explanation and a provisional percentage anchor for the next design stage. These anchors are not rendered or visually approved yet.

[ProjectAtlas.tsx](../../src/components/ProjectAtlas.tsx) uses the model for canvas targets/colors, connections, controls, selection, and displayed content. Selection now stores the project ID rather than an array index. Scene order remains IsdaLog, DormFix, CentraLog, PharmaLink regardless of the input record order. A missing/duplicate project or missing case-study destination fails explicitly rather than silently pairing the wrong identity with a symbol. No CSS, symbol geometry, particle count, cadence, motion preference, or suspension behavior was changed.

Validation: 105 tests, TypeScript, production build, and 28-page static verification passed. Three new model tests cover record reordering, derived content/routes without source mutation, and invalid identity/destination inputs. Browser checks covered all four keyboard selections with matching accents/positions/credits/destinations, paused selection and pause persistence between variants, all maintained workflow labels, the Laravel 11 Explore filter, baseline desktop appearance, light-theme phone appearance, and 320px reflow (310px document and scroll width). Inspected Explore warning/error logs were empty. Actual reduced-motion preference emulation, screen-reader speech, and physical-device performance remain pending as recorded above. The original baseline captures remain unchanged.

## Stage 3: static composition — 16 October 2026

The Atlas now separates project selection, the illustration, workflow explanations, and selected-project information. Project buttons sit above the scene. Larger symbols sit in front of quieter surrounding particles and a fixed halo; the old orbit animations and hub-to-button signal paths have been removed. Up to three maintained workflow labels are accessible links below the illustration, visible in both variants. Normal-flow labels replace the provisional floating-label layout to avoid collisions. Project metadata, case-study/walkthrough destinations, technology filtering, and pause persistence remain available.

Light-theme accent colors now have darker equivalents. Measured project-kicker contrast against the actual flat detail backgrounds ranged from 6.39:1 to 9.44:1 across all four projects and both themes. This is a check of those labels, not a whole-site accessibility certification. Container-based layout switches keep buttons and links readable when the compact Atlas occupies a narrow desktop column as well as on phones.

The composition was reviewed with motion paused. Existing canvas motion and selection morphing remain available; no new depth movement or animation loop was added. Particle counts, pixel-density cap, and frame gate remain unchanged. Normalized symbol geometry is unchanged; rendering scale and foreground dot size increased.

| Surface | Dark | Light |
| --- | --- | --- |
| Homepage desktop | [View](composition/home-desktop-dark.jpg) | [View](composition/home-desktop-light.jpg) |
| Homepage phone | [View](composition/home-phone-dark.jpg) | [View](composition/home-phone-light.jpg) |
| Explore desktop | [View](composition/explore-desktop-dark.jpg) | [View](composition/explore-desktop-light.jpg) |
| Explore phone | [View](composition/explore-phone-dark.jpg) | [View](composition/explore-phone-light.jpg) |

[Composition manifest](composition/manifest.json) records the eight captures, computed accent contrast, keyboard/control references, project destinations, and layout measurements. Phone captures show the scene/workflow area of the taller widget. Boundary checks allow 0.01 CSS pixels for floating-point rounding between adjacent rectangles; measured differences were approximately ±0.00003px.

Validation: all 105 tests, TypeScript, production build, and 28-page static verification passed. Browser checks covered all project identities in both themes, compact/full variants, workflow-link fitting, 320px phone and 1040px narrow-column layouts, valid control references, and keyboard order from the final project button into the workflow links. Enter opened the CentraLog workflow explanation at its existing heading; Laravel 11 filtering still returned IsdaLog. Document/scroll widths matched at 310px for a 320px viewport and at 1030px for a 1040px viewport. Inspected console logs were empty. Actual reduced-motion emulation, screen-reader speech, physical-device performance, and wider zoom review remain pending. Next: subtle depth.

## Stage 4: subtle depth — 17 October 2026

The existing canvas loop now renders three restrained depths: background constellation (0.2), middle halo (0.55), and foreground symbol (1). Normalized fine-pointer input eases toward bounded offsets of at most six horizontal and four vertical CSS pixels at the foreground. The halo moves at 55% of that distance; controls, workflow links, captions, and project details remain stationary. Foreground scale breathes within ±0.6%. Smaller background dots and halved ambient drift keep the surroundings quieter. Particle counts, pixel-density cap, and 32ms frame gate are unchanged; there is no additional continuous loop or dependency.

Pointer leave, offscreen/background suspension, and input-capability changes clear the pointer target. Touch events and devices without a fine hover pointer do not drive parallax. Pause/reduced motion freezes the current pose, with static selection/theme/resize redraws still available. Existing observers and listeners are cleaned up, including the new input-capability listener and halo style properties.

Validation: all 107 tests, TypeScript, production build, and 28-page static verification passed. Two focused tests cover finite bounded input handling, layer ordering, symmetry, and neutral origin. Browser checks observed the middle halo settle to 2.730px / −1.761px, return to 0.000px / −0.000px after leaving, and hold the same offsets while paused. Project-control and workflow rectangles remained identical during movement. All four paused keyboard selections retained their matching workflow destinations. Pause persisted from homepage to Explore; both variants had 310px document/scroll widths at a 320px viewport. Both themes were visually reviewed, offscreen state changed to suspended after technology filtering, and inspected warning/error logs were empty. Original light theme and paused preference were restored.

Actual reduced-motion preference emulation, physical touch/coarse-input testing, background-tab timing, screen-reader speech, and device CPU/GPU/frame-rate measurements remain pending. Source inspection supports those lifecycle/input safeguards; responsive viewport testing does not emulate a physical touch device. Static screenshots cannot demonstrate motion timing. Next: selection transitions.

## Stage 5: selection transitions — 17 October 2026

Project selection now uses a finite 480ms cubic ease-out symbol morph rather than an asymptotic chase. Each interruption snapshots the currently rendered normalized points and replaces the pending target; no queued selections or automatic cycling are introduced. A restrained ring expands and fades during that same finite transition in the existing canvas loop. The exact destination geometry is assigned at completion, and no transition sampling or ring drawing continues after settlement. Particle count, cadence, depth behavior, and density limits are unchanged.

Selected text, credits, workflow destinations, technology controls, and pressed state update immediately. The old detail-copy entrance animation was removed so information and actions are fully visible during the decorative transition. Stable selection buttons retain keyboard focus. Pausing (including a reduced-motion change) settles the symbol immediately; selecting while stopped or while the scene is offscreen/backgrounded also draws the final symbol directly. Resuming does not replay a completed selection. An in-progress visible transition uses the existing lifecycle suspension; it does not add timers or another frame loop.

Validation: all 109 tests, TypeScript, production build, and 28-page static verification passed. Two new tests cover finite exact completion, immutable source scene points, and interruption continuity toward only the latest target. Browser checks observed morphing then settled states, rapid CentraLog → PharmaLink → IsdaLog selection with immediate matching routes, full-opacity detail text without animation, one pressed button, and retained keyboard focus. Pausing during a morph settled immediately; a paused PharmaLink selection stayed settled, and Play did not replay it. Tab from PharmaLink moved into its first workflow link. Both themes, compact/full variants, and 320px layouts were reviewed (310px document and scroll widths); a compact offscreen selection settled directly. DormFix retained Collaborative capstone / Feature developer. Inspected browser warning/error logs were empty. Original light theme and paused preference were restored.

The 480ms value is active animation time; the existing frame gate and suspension affect wall-clock timing. Actual reduced-motion preference emulation, background-tab timing, screen-reader speech, physical touch input, and device-performance measurements remain pending. Next: workflow connections.
