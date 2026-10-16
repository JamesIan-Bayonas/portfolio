# Animation reference review

Inspected 16 October 2026. Reference: https://universodrago.com/.

## Scope and evidence

Live browser inspection covered Home, Tools, Services, and About. Actions included skipping the ASCII introduction; opening the particle figure menu and choosing Galaxy; opening/closing the custom-figure dialog; filtering tools to Media Editor; and switching the Services workflow from Invoices to Mail. No accounts, messages, drawings, or uploads were submitted. The local portfolio's Hero, ProjectAtlas, Toolbox, Process, footer signature, and walkthrough source were compared with the observed behavior.

## Observed effects and proposed adaptations

| Observed reference behavior | Portfolio placement | Adaptation | Priority |
| --- | --- | --- | --- |
| Tools header has circuit traces with moving luminous signals and connected tool labels. | Selected Toolbox architecture panel | Animate the actual Interface → API → Domain/Data access → Persistence layers from the selected project's records. Draw connectors and send a short signal on selection; use a vertical layout on phones. | 1 |
| Home tools strip has bright vertical scanning bands, code previews, entry motion, and icon line drawing. | Four Toolbox cards | A brief scan on hover, keyboard focus, or selection, plus a one-time icon stroke reveal. Keep descriptions and actions readable. Use existing project/version labels rather than invented operational telemetry. | 1 |
| Hero slogan and small section labels scramble, then resolve into readable words. | Toolbox heading and small section labels | A short, one-time text decode on entry or selection. Keep a stable accessible label and layout. Avoid scrambling long explanatory copy. | 2 |
| Technology strip moves horizontally through repeated technology labels/logos. | Boundary between About/Skills or above Toolbox | Derive labels from maintained project technology records; link to existing Explore filters. Pause for hover/focus and offer a static reduced-motion layout. | 2 |
| Services workflow switches between examples, then reveals stages, field chips, scan lines, review state, and execution in sequence. | Existing Lab walkthroughs | Animate connectors and result fields after the user's existing Next/Review/Checkout actions. Emphasize the current stage and preserve validation, credits, and sample-data notices. | 3 |
| Hero particle figures automatically change and can be selected from a menu. The drawing dialog previews custom-shape controls. | Existing ProjectAtlas | Extend the current project symbols only if a larger hero treatment is needed. Keep project selection stable while the visitor reads its summary. | Later |
| About terminal presents a staged boot/demo sequence with a skip control and command shortcuts. | Optional ProfileExplorer | A short optional introduction or output reveal could fit, but the maintained profile content and immediate command access take priority. | Later |

## Existing foundations

The portfolio already has selectable particle symbols, moving atlas connections, pointer spotlights/tilt, card corner frames, entry transitions, terminal-style search, a profile command panel, and the JAMES IAN code texture with random character changes and pause support. The next work should add feedback to the stack and workflow, rather than repeat those effects.

## Recommended implementation sequence

1. Upgrade the selected Toolbox architecture list with a circuit/flow reveal. Keep the existing project data, credits, case study, and Lab destinations. Replay the brief sequence when the selected tool changes, with an optional replay action.
2. Add short scan and icon-stroke effects to Toolbox cards. Keep the persistent selected glow, keyboard state, and touch behavior.
3. Add short decoding reveals to small headings and a technology strip if the page still needs motion between sections.
4. Enhance Lab diagrams using their existing application states. User actions continue to control the workflow.

Implementation can use the existing React, CSS, SVG, and canvas stack. Continuous effects should pause offscreen/backgrounded and expose motion controls. Reduced-motion rendering must show complete content immediately. Decorative motion must not announce random characters, create keyboard traps, change credit, invent metrics, or imply real network activity.

This review records observed behavior and proposed adaptations. It does not claim access to the reference site's implementation internals, device performance, or accessibility behavior. The inspection phase made no animation changes; subsequent implementation is recorded below. All local changes remain uncommitted; no commit or push was performed.

## Implemented locally — 16 October 2026

The first stage adds a data-driven architecture circuit inside the Toolbox. Selecting a project mounts its documented layers, draws the connections, pulses light through them, and briefly highlights each node. A replay button restarts only the decorative sequence and retains keyboard focus. The sequence starts when the diagram enters view and pauses offscreen/backgrounded. Reduced-motion CSS shows the complete static diagram and replaces replay with a static-view label. Tool cards also have short scan and icon-stroke effects for selection, hover, and keyboard focus.

TypeScript, all 102 existing tests, the production build, and 28-page static verification passed. Browser checks verified keyboard selection, correct DormFix credit/stack, replay focus and animation styles, settled signal state, offscreen suspension, 320px reflow, light theme, and empty inspected warning/error logs. Reduced-motion rules were source reviewed; actual preference emulation and screen-reader speech remain manual checks.

Heading decoding, the technology strip, and Lab workflow enhancements remain later stages. No commit or push was performed.

## Text-decoding stage — 16 October 2026

Added a short 620ms decoding reveal to the Toolbox heading and selected tool titles. A stable full-text layer reserves space, while the decorative overlay resolves from random characters; accessible text remains constant. Keyboard/desktop/mobile checks and the standard build/test checks passed. The technology strip and Lab workflow enhancements remain later stages. No commit or push was performed.

## Technology-strip stage — 16 October 2026

Added the moving technology strip above Toolbox, using 29 maintained project technologies and their project counts. Every label opens its Explore filter. Pause/Play, hover/focus suspension, Show all technologies, offscreen/background suspension, and static reduced-motion rendering are included. Keyboard and desktop/mobile checks passed along with the standard type/test/build/static checks. The next queued stage is Lab workflow animation. No commit or push was performed.

## Lab workflow stage — 16 October 2026

Added finite state-driven stage connectors and changed-output highlights to the Lab walkthroughs, calculator, and shared CentraLog lifecycle example. The effects follow existing user actions; progression, validation, exact values, and sample decision rules remain under the existing application logic. Desktop/mobile interaction checks and standard type/test/build/static checks passed. This completes the four recommended implementation stages above. Remaining manual accessibility checks are listed in QUALITY_REVIEW.md. No commit or push was performed.

## Interactive valuation chart — 16 October 2026

Added day-by-day chart exploration with pointer selection, a native range slider, arrow/Home/End keyboard controls, exact adjusted/baseline/repair-day readouts, and return to evaluation day. The original evaluation marker and calculator inputs remain independent. The accessible table includes the explored day. Curve updates use a brief opacity reveal, disabled for reduced motion; calculations update immediately using the existing strategy functions.

Browser checks verified keyboard day 0/1 and endpoint navigation, day-400 repair pause (35 days), direct chart selection, both strategies, return/reset behavior, and 320px reflow. No inspected browser warning/error logs. Native phone gestures and spoken screen-reader output remain manual checks. All 102 existing tests passed. Final type checking, production build, and 28-page static verification passed after the responsive spacing and table-label adjustments. No commit or push performed.

## DormFix receipt illustration — 16 October 2026

Replaced the separate receipt/field views with a connected, state-driven receipt → extracted text → structured fields → reviewer illustration. The extraction stage plays a finite scan and line highlight; parsing sends a short connector signal and reveals field cards in sequence. The original sample text remains visible beside the fields. Pending/unavailable values and explicit reviewer decisions follow the unchanged reducer. Reduced-motion CSS removes the scans and reveals while keeping all current-stage content visible. The illustration stacks vertically on narrow screens.

Browser checks covered all four receipt samples, expected flags, pending decisions, explicit sample rejection, keyboard sample selection, light/dark themes, 320px reflow without horizontal overflow, and empty inspected warning/error logs. Type checking, all 102 existing tests, production build and 28-page static verification passed. Actual phone gestures and spoken screen-reader output remain manual checks. No commit or push performed.

## IsdaLog custody and settlement illustration — 16 October 2026

Added a delivery marker that moves only when sample checkpoints advance, plus current custody and a separate catch-price balance panel. Held-fund and payout states receive a brief finite highlight. The diagram uses the existing reducer and balance calculation; failed codes preserve custody/funds, verified delivery leaves funds held, and only buyer inspection releases settlement. Reviewing an earlier step preserves and explicitly labels the current simulation state. Reduced-motion styling removes decorative transitions and highlights. Mobile layout stacks fund cards without horizontal overflow.

The owner now authorizes scoped commits and pushing the completed animation work to GitHub, superseding the previous local-only instruction. Unrelated desktop metadata and repository-dump files are excluded.

## PharmaLink sale and inventory illustration — 16 October 2026

Added a state-driven cart → sale record → inventory diagram. Successful checkout sends short connector signals and highlights the record and stock together; the unit grid reflects exact remaining stock. Failed checkout displays blocked/unchanged states with zero sale/history writes. A void highlights restored units while retaining the original total and showing the separate adjustment count and zero effective total. Values update immediately from the existing reducer. Reduced-motion CSS hides signals and removes highlights; narrow layouts stack the cards vertically.

Browser checks covered failed checkout/retry, three-unit success (7 remaining, ₱75 original/effective), invalid void reason, reasoned void (10 restored stock, ₱75 original, ₱0 effective, 2 history entries), ten-unit checkout (0 remaining, ₱250), reset, light/dark themes, and 320px reflow without horizontal overflow. Type checking, 102 existing tests, production build, and 28-page static verification passed. Spoken screen-reader output and actual reduced-motion preference emulation remain manual checks. The remaining project-specific illustration is CentraLog's asset lifecycle.

## CentraLog asset-lifecycle illustration — 16 October 2026

Added a state-driven laptop illustration with procurement → active → repair → restored milestones and connected equipment, custody, and maintenance cards. Finite signals and card highlights follow the existing user actions. Current records update immediately; transfer preserves joint custody/location history, repair resolution retains 30 completed days, and reporting preserves all five history entries. Reset, keyboard activation, both themes, and 320px reflow were browser verified. CSS removes signals and highlights for reduced motion; actual preference emulation and screen-reader speech remain manual checks. Standard type/test/build/static checks passed. This completes the queued project-specific Lab illustration sequence.

## Smoother panel and filter transitions — 16 October 2026

Added a finite 280ms Toolbox height transition and position-based Explore result transitions. Visible project cards retain their identity across filters; newly visible cards fade and excluded cards leave immediately. Wrappers preserve existing hover transforms. Controls and new content remain immediately available. Resize, backgrounding, and reduced-motion preference changes cancel transitions. Browser verification covered interpolation/settling, rapid tool selection, search focus, filter results/removal, empty-state recovery, comparison/URL restoration, both themes, and 320px reflow. Standard checks passed. Process progression is the next feature in the discussed sequence; actual preference emulation and screen-reader speech remain manual checks.

## Process progression — 16 October 2026

Added a five-stage vertical Process narrative with linked project examples, scroll-linked connector fill, and current-stage emphasis. The desktop reading summary stays alongside the cards; mobile and short-screen layouts remain in ordinary flow. Progress follows measured node positions and reverses when scrolling upward. There is no continuous animation loop: passive scroll events schedule a frame only while the section is visible, and backgrounding cancels work. All text remains visible throughout. Reduced motion uses a static connected list and disables scroll tracking and card transitions. Browser checks covered all stages, backward progression, keyboard links, a workflow destination, both themes, and 320 CSS-pixel reflow. Standard checks passed; actual preference emulation and screen-reader speech remain manual checks.

## Transforming tool previews — 16 October 2026

Added a selected-tool source → result illustration for all four Toolbox tools. A finite source scan and travelling signal introduce result fields; the valuation preview draws a curve computed from the existing sample calculation. The final amounts remain exact, and all previews are explicitly fixed illustrations. Playback starts on entry, pauses offscreen/backgrounded, and runs once unless replayed. Replay retains keyboard focus, while Show result immediately settles the static scene. Reduced motion uses the complete result without decorative effects; the stable accessible summary is separate from the aria-hidden scene. Browser review covered all four results, keyboard controls, pause/resume, one-iteration playback, both themes, and 320px reflow. Standard checks passed; actual preference emulation and screen-reader speech remain manual checks.

## Richer particle hero stage 1 — 16 October 2026

Scope/baseline stage completed in docs/particle-hero/README.md. Twelve paused stills document the current two Atlas variants across desktop/phone and light/dark themes. The preservation checklist covers maintained project information, keyboard selection, destinations/filtering, pause persistence, static reduced motion, suspension, and cleanup. Source cadence/particle limits are recorded as implementation constraints, not measured performance. No richer-scene effects or runtime changes were introduced. Next: prepare project scene data, then review a static composition before adding depth and transitions.

## Particle hero scene data — 16 October 2026

Prepared the richer hero's identity-keyed scene model and connected the existing Atlas to it. Project selection no longer depends on project-array indices. Symbols, accents, node positions, maintained text/routes, and technology controls keep their current behavior. Future workflow-label anchors are data only at this stage. All 105 tests and type/build/static checks passed, with browser coverage of both Atlas variants, keyboard identity selection, pause persistence/paused selection, workflows/filtering, and phone reflow. No new motion, geometry, or style changes were introduced. Next: review a static layered composition.

## Particle hero static composition — 16 October 2026

Completed the first visible redesign stage: larger foreground symbols, subdued background particles, fixed halo, separate project controls, and linked workflow labels outside the illustration. Removed the old orbit and connection-signal animations. Both variants support responsive button/link layouts and darker light-theme accent text. The paused view was reviewed across projects and themes; existing canvas motion remains available without a new loop. All 105 tests and type/build/static checks passed. Keyboard destinations, technology filtering, phone/narrow-column reflow, and computed accent-label contrast were checked. Evidence is in docs/particle-hero/composition/. New depth/parallax effects remain the next stage.

## Particle hero subtle depth — 17 October 2026

Added background/middle/foreground depth weights (0.2/0.55/1) inside the existing canvas loop. Fine-pointer input eases toward at most ±6px horizontal / ±4px vertical foreground offsets; the middle halo uses CSS properties set by that same draw. Foreground breathing stays within ±0.6%; background drift is halved. Controls and workflow labels stay stationary. Pause freezes the current pose; pointer leave, visibility suspension, and capability changes reset the input target. Touch input is ignored. No new loop, dependency, particle count, or DPR/cadence increase.

All 107 tests and type/build/static checks passed. Browser observations confirmed bounded halo settling, neutral return, pause freezing, fixed label rectangles, four paused keyboard selections, persisted pause across routes, both themes, offscreen suspension, and 320px reflow. Actual reduced-motion emulation, physical touch/coarse input, background-tab timing, assistive-technology speech, and measured device performance remain pending. Next: selection transitions.

## Particle hero selection transitions — 17 October 2026

Replaced exponential symbol chasing with a finite 480ms cubic ease-out morph and expanding/fading ring in the existing draw loop. Interruption snapshots the displayed points; the latest selection replaces the target without queuing. Completion assigns exact geometry and stops transition-specific work. Removed the detail entrance animation so information/actions remain immediately visible. Pause/reduced motion settles directly, offscreen/background selection draws a static destination, and existing lifecycle scheduling suspends ongoing work. Play does not replay settled selections.

All 109 tests and type/build/static checks passed. Browser checks observed finite morphing/settled states, rapid latest-selection behavior, immediate full-opacity copy/routes, retained keyboard focus, pause mid-morph, paused selection, no replay on resume, workflow keyboard order, both themes and variants, and 320px reflow. Actual preference emulation, background-tab timing, spoken screen-reader output, physical touch input, and measured performance remain pending. Next: workflow connections.
