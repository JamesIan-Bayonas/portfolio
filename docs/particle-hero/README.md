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
| 6. Workflow connections | Complete | At most three meaningful labels, valid destinations, no unsupported live-activity implications |
| 7. Motion/accessibility | Implemented; manual checks remain | Paused/static operation, preference-change handling, suspension/cleanup, accessible content and controls |
| 8. Responsive refinement | Complete | Narrow and short viewports, compact/full variants, no clipping/overflow, ordinary scrolling |
| 9. Performance review | Local review complete; device checks pending | Measured results on representative hardware; tune density before expanding effects; record limitations |
| 10. Release verification | Next | Relevant tests, type/build/static checks, keyboard/theme/device review, scoped commits, deployment and live-route verification |

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

## Stage 6: workflow connections — 17 October 2026

The selected symbol's halo now connects to its three maintained workflow links. Wide layouts use a shared branching line terminating at the center of each card; phone and narrow-container layouts use a left rail with individual spurs. CSS follows the actual grid/card dimensions, avoiding absolute label placement, DOM measurements, new observers, and another animation loop. The old bottom caption was removed to leave a clear route between illustration and links. Existing project data, routes, selection behavior, and at-most-three labels are unchanged; provisional scene-data anchors remain unused because labels use normal flow.

Connections have a finite 480ms opacity reveal when new project links appear. Text and destinations remain immediately visible; the lines communicate documented relationships without travelling signals or operational status. Hover/keyboard focus emphasizes the corresponding branch while the native link retains its normal focus outline. Paused and reduced-motion styles explicitly disable pseudo-element animations and show the complete lines; existing offscreen/background state explicitly pauses those animations. Decorative pseudo-elements do not add accessible announcements or intercept input.

Validation: all 109 existing tests, TypeScript, production build, and 28-page static verification passed. Browser checks matched all twelve workflow titles/routes across four keyboard selections. Tab from PharmaLink reached its first workflow link with visible focus and branch opacity 1; Enter opened the existing PharmaLink workflow heading. Unpaused branch opacity was observed during the reveal and at its final 0.45, with 0.48s duration and one iteration; text opacity remained 1. Paused branches had no animation. Offscreen state was false with branch playback paused. Compact/full phone layouts at 320px had 310px document/scroll widths and 232px link/scroll widths; a 1040px viewport had matching 1030px document/scroll widths and a 397px compact Atlas using the rail. Both themes and both Atlas variants were visually reviewed. Inspected warning/error logs were empty; original light theme and paused preference were restored.

Actual reduced-motion preference emulation, background-tab timing, spoken screen-reader output, physical-device interaction/performance, and wider browser-zoom review remain pending. No new unit tests were added for this presentation-only change; existing content/route tests and browser layout/interaction checks cover the relevant behavior. Next: motion/accessibility review.

## Stage 7: motion and accessibility — 17 October 2026

Reviewed the complete hero and closed three gaps: the motion control now uses action semantics instead of mixing a changing action label with a pressed toggle; a concise polite selection status replaces announcements of the whole detail panel; and static offscreen/background resize redraws no longer advance depth, breathing, or the animation clock. Reduced motion keeps its explained, unavailable control keyboard focusable, without allowing activation to change the saved pause. All project controls and destinations remain available. Added explicit selected borders/system focus colors for forced-colors mode and keyboard scroll margins for sticky-navigation clearance.

A reusable development fixture mounts the real component under StrictMode with isolated simulated preference, visibility, and storage APIs. Browser integration checks covered reduced motion at mount and during playback, static project selection, preservation of a saved pause through preference changes, storage read/write failures, background resize freezing, resume, and active unmount/remount cleanup. Running mounts had one pending frame and preference listener; stopped/backgrounded states had no pending frame; unmount removed both. These are simulated lifecycle checks, not actual OS preference or background timing tests.

All 109 existing tests, TypeScript, production build, and 28-page static verification passed. Real-route browser review covered valid control targets, concise matching announcements, keyboard focus/order, paused selection/persistence, both themes/variants, and 320px reflow. Full evidence, reproduction steps, and remaining manual checks: [motion/accessibility checks](accessibility-checks.md). Actual OS reduced-motion/forced-colors rendering, screen-reader speech, physical-device input/performance, background timing, and broader zoom review remain pending. Next implementation stage: responsive refinement; measured performance and final release verification follow.

## Stage 8: responsive refinement — 17 October 2026

Short homepage viewports now align the introduction and Atlas at the top of their grid instead of vertically centering the introduction against the taller widget. At a 1040×600 viewport, the heading's document top moved from approximately 338px to 136px. The hero retains ordinary document scrolling and does not impose a viewport-height content limit. At viewport heights up to 600px, decorative scene height adapts between 180px and 240px; foreground geometry continues to scale from the available canvas dimensions.

The halo now derives its width from its constrained height with a 1:1 aspect ratio. This replaces the stretched 190×165.6px phone halo with a circle and keeps the connection stem aligned to its lower edge. Narrow compact containers stack the two project actions even on desktop; technology links/buttons now have a minimum 44px width as well as height. Project content, workflow links, keyboard order, stored pause, and animation budgets remain intact.

Validation: all 109 existing tests, TypeScript, production build, and 28-page static verification passed. A 64-case browser matrix covered all four projects on homepage/Explore at 320×568, 390×844, 568×320, 844×390, 768×1024, 1040×600, 1280×720, and 1440×1000. Every case had matching document/scroll widths, no clipped control text, targets at least 44px in both dimensions, exactly one pressed project, circular halo dimensions, and no scene/workflow overlap. On the 568×320 Explore layout, keyboard focus traversed all three workflow links, both project actions, and the first technology control; each focused target was fully within the viewport below navigation. Both themes were visually reviewed. Inspected warning/error logs were empty; original light theme and paused preference were restored.

[Responsive measurements](responsive/manifest.json) record the source base, working-tree scope, requested viewport dimensions, 64 cases, and short-screen keyboard rectangles. Representative captures: [short desktop](responsive/home-short-desktop-light.jpg), [phone](responsive/home-phone-dark.jpg). Still images show the visible portion of a normally scrolling page. CSS viewport resizing is not physical-device or browser-zoom emulation. Actual zoom, OS accessibility preferences, screen-reader speech, and physical input/performance checks remain pending as recorded in the accessibility review. Next: measured performance review, followed by release verification.

## Stage 9: performance review — 17 October 2026

Completed local instrumented component measurements and two scoped optimizations. Cross-project particle pairs are rejected before calculating distance, reducing distance calls from 1,770 to 420 per draw without changing visual output or density. Immediate selection redraws now use real timestamps rather than moving the frame gate 33ms into the future; rapid-selection draw-interval p95 improved from 69.6ms to 36.5ms in the recorded samples.

Steady rendering measured approximately 29 draws/second, with drawing callback p95 of 0.6ms on desktop and 0.5ms at phone size after the group-check optimization. Desktop callback timing was unchanged; small sub-millisecond differences do not prove a general speedup. Eight rapid selections after the timestamp fix had a maximum click-to-DOM-update time of 6.7ms. Paused and genuinely offscreen five-second captures each recorded zero callbacks, draws, distance calls, and pending frames. Simulated background/reduced motion and cleanup were rechecked with the existing lifecycle fixture.

All 109 existing tests, TypeScript, production build, and 28-page static verification passed. Keep the current particle, density, cadence, and single-loop budgets. [Performance report](performance/README.md) and [eight recorded samples](performance/measurements.json) describe the environment, instrumentation, source phases, reproduction, and limits. These isolated development measurements exclude GPU/presentation and do not establish physical-phone or full-page production performance. Representative hardware, high-DPR, sustained load/battery, and full-page production profiling remain pending. Next: final release verification.
