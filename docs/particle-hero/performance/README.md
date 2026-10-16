# Particle hero performance review

Local review: 17 October 2026. [Recorded samples](measurements.json) identify the baseline revision and each optimization phase.

## Findings and changes

The renderer calculated distance for all 1,770 pairs among 60 background points before rejecting points from different project groups. Moving that rejection before the distance calculation reduces calls to 420 per draw: four groups × 105 eligible pairs. This removes 1,350 unnecessary calculations (76.27%) without changing eligible connections, thresholds, colors, density, or geometry.

Rapid selections also exposed a scheduling gap. Immediate redraws previously used `performance.now() + 33`, putting the frame gate ahead of actual time. Forced redraws now use the real timestamp, bypass the frame gate once, and do not advance the animation clock twice. The existing scheduled loop continues normally afterward. Latest-selection interruption and static selection remain intact.

## Local measurements

The fixture at `/tests/fixtures/atlas-performance.html` runs the real component under React StrictMode on the Vite development server. Each capture lasts five seconds. The recorded environment was local Windows Chromium 155 through the in-app browser, with approximately 1× device pixel ratio and no configured throttling. Phone-size results use the same desktop hardware. Full/compact canvas dimensions were 622×340 and 346×230 respectively.

| Scenario | Before | After |
| --- | --- | --- |
| Full desktop steady draws/second | 28.80 | 28.59 |
| Full desktop drawing callback median / p95 | 0.4 / 0.6ms | 0.4 / 0.6ms |
| Compact phone-size steady draws/second | 28.79 | 28.78 |
| Compact phone-size drawing callback median / p95 | 0.4 / 0.6ms | 0.3 / 0.5ms |
| Distance calculations per draw | 1,770 | 420 |
| Eight rapid selections: draw-interval p95 | 69.6ms before timestamp fix | 36.5ms after timestamp fix |
| Eight rapid selections: DOM-commit median / maximum | 5.9 / 7.9ms before timestamp fix | 4.9 / 6.7ms after timestamp fix |

The rapid-selection captures include eight input events near the beginning and steady rendering for the rest of the window. Draw counts include immediate redraws; callback timings cover scheduled callbacks that actually draw. The two steady post-change samples precede the timestamp-only fix, which affects immediate selection redraws rather than steady scheduling.

A paused five-second sample recorded zero callbacks, draws, distance calls, and pending frames. A separate genuinely offscreen five-second sample recorded the same zeros while motion remained enabled. The existing lifecycle fixture also rechecked simulated background and reduced-motion states (zero pending frames), static project selection, and unmount cleanup (zero frames and preference listeners).

These samples do not establish a statistically significant steady-state speedup: desktop callback timings were unchanged, and sub-millisecond differences are noisy. The deterministic reduction in distance calculations and the corrected selection scheduling are the supported improvements.

## Budget decision and limits

Keep 60 background points, 96 foreground points, the 1.5× pixel-density cap, the 32ms draw gate, and one scheduled canvas loop. No measured local issue justifies expanding density or adding another engine/loop. The review adds no production measurement API, dependency, or perpetual probe. The fixture is excluded from production build entry points.

The probe measures instrumented JavaScript callback time, including canvas command submission. It excludes GPU execution, paint/compositing, display presentation, full-page loading, and battery/thermal cost. Draws/second is not a presented-screen FPS measurement. Selection timing is click-to-DOM-update, not INP or click-to-paint. Long-task arrays contain collected entries only; API support was not recorded in these samples, so empty arrays are not a general no-jank guarantee.

Representative physical phones, slower hardware, higher pixel densities, browser/OS reduced-motion settings, production full-page profiling, and sustained thermal/battery tests remain pending. They must precede any claim of broad device performance. All 109 existing tests, TypeScript, production build, and 28-page static verification passed after the production changes. Final release verification is the next roadmap stage.

To reproduce: open the fixture locally, choose full or compact, enable motion, and use Capture 5 seconds. Click the four project buttons twice during a capture for the selection case. For offscreen idle, first activate Offscreen checkpoint, then Capture offscreen 5 seconds. Wait for Capture complete and read the report. Leave sources unchanged during captures so development reloads cannot invalidate the sample.
