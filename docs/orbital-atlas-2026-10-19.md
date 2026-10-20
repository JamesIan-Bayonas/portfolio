# Orbital atlas

Ready locally, 19 October 2026. This completes the dimensional-scene alternative from the visual reference plan. No deployment, commit, or push was performed.

## Experience and scope

The homepage and Explore atlas now offer Orbit and Constellation views. Orbit is the default: four project-colored orbital planes rotate slowly around the selected project symbol, with perspective-scaled particles and front/back drawing order. Fine-pointer motion adds a small bounded change in viewpoint. Constellation retains the previous presentation. Changing views preserves the selected project, contribution credit, and destinations.

Both views share the existing pause and reduced-motion controls. A reduced-motion view is static but still selectable. The mobile header places pause alongside its title, with the two appearance options below and 44px-high controls.

The scene keeps sixty background particles, ninety-six symbol points, a 1.5× pixel-density cap, a 32ms draw gate, and one scheduled canvas loop. The orbital view uses sixty precomputed edges instead of searching for nearby particle pairs. No WebGL engine, new package, additional particle population, or production performance probe was added.

The implementation is in `src/components/ProjectAtlas.tsx`, `src/components/ProjectAtlas.css`, and `src/lib/atlasOrbit.ts`. Three new geometry tests cover closed project-local edges, finite/bounded projection, deterministic geometry, preserved inputs, and perspective depth.

## Local measurements

Raw reports: `output/orbital-atlas/measurements.json`.

The existing real-component development fixture was captured for five seconds before changing the renderer and again with Orbit. Environment: local Windows Chromium 155, device pixel ratio 1.25, 1280 × 720 viewport. Full scene: 622 × 340 CSS pixels; compact scene: 598 × 180. Each table entry represents one capture, not a statistical comparison.

| Scene | Previous constellation | New orbit |
| --- | --- | --- |
| Full draws/second | 28.59 | 28.80 |
| Full callback median / p95 | 0.3 / 0.5 ms | 0.2 / 0.4 ms |
| Compact draws/second | 28.58 | 28.79 |
| Compact callback median / p95 | 0.3 / 0.5 ms | 0.2 / 0.3 ms |
| Distance calculations per draw | 420 | 0 |

Separate five-second captures recorded zero callbacks, draws, distance calculations, and pending frames while paused and while genuinely offscreen. The offscreen capture kept motion enabled and the scene outside the viewport.

The measurements support retaining the new presentation within the existing local JavaScript drawing budget. Small timing differences are noisy; they do not establish a general speedup. Callback measurements exclude GPU execution, paint/compositing, displayed frame rate, and battery cost. No physical-phone, production-page, or sustained thermal performance claim is made.

## Validation

- Type checking passed.
- All 145 tests passed, including the three new geometry tests.
- Production build passed.
- Build verification passed: 30 static pages, 14 shared entry assets, 33 responsive screenshots, four briefs, fonts, metadata, favicon, and resume.
- Browser: keyboard switching preserves focus, project selection, credit, and links. DormFix retains collaborative-capstone/feature-developer credit.
- 320px and 390px layouts fit without horizontal document overflow; the mobile appearance buttons measure 44px high.
- At 1024 × 600, the primary homepage action ends around 531px with the page at scroll position zero.
- Light-theme fixture and dark-theme homepage were inspected. Constellation background particles now use the darker project accents in light mode as well.
- Lifecycle fixture: reduced-motion project selection settles with zero pending frames; switching view stays static. Simulated background state, unavailable-storage pause, and unmount cleanup also leave zero pending frames. Unmount leaves zero tracked preference listeners.
- The final inspected homepage error log was empty. Temporary viewport overrides were reset, and pause testing returned stored pause to its original playing setting.

Screenshots are in `output/orbital-atlas/`. Spoken screen-reader output, native phone gestures, and broader hardware/performance testing remain unverified.
