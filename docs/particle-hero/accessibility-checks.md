# Particle hero motion and accessibility checks

Reviewed 17 October 2026. This records implementation and local checks, not a whole-site accessibility certification.

## Reproduce the lifecycle checks

Start the normal development server and open `/tests/fixtures/atlas-accessibility.html`. The fixture mounts the real `ProjectAtlas` under React StrictMode and imports the site's styles. Its controls simulate JavaScript media-query changes, document visibility, and unavailable storage within that document. Saved preferences in the real portfolio are unaffected. Frame and preference-listener counters expose cleanup without a separate polling loop.

The fixture is development source, excluded from the production build entry points. Do not treat its simulated preference as actual operating-system or CSS media emulation.

| Action | Observed result |
| --- | --- |
| Initial visible, unpaused mount | One pending animation frame and one reduced-motion listener after StrictMode setup/cleanup |
| Enable simulated reduced motion | Zero pending frames, settled symbol, connector animation `none`, focusable motion button with `aria-disabled=true` and an explanation |
| Select DormFix with reduced motion | Exact static selection, zero pending frames, matching contribution announcement |
| Disable reduced motion with no saved pause | Animation resumes with one pending frame |
| Pause, enable reduced motion, then disable it | Saved pause retained; Play motion shown and zero pending frames |
| Enable unavailable storage and operate motion control | Pause/play still works despite write failure |
| Unmount and remount with unavailable storage | Read failure falls back to unpaused operation; one frame/listener after remount |
| Simulate background while running, then resize to 1040px | Zero pending frames; CSS connector playback paused; halo pose unchanged at 2.427px / −1.675px |
| Return from simulated background | One pending frame resumes |
| Unmount while running | Zero pending frames and zero reduced-motion listeners |
| Mount with reduced motion already enabled | Zero pending frames and Reduced motion control from first render |

The pending-frame count is a scheduling/cleanup observation, not a frame-rate or CPU/GPU measurement. Other observers/listeners are disconnected in source cleanup; the fixture counts only reduced-motion listeners and animation-frame handles.

## Portfolio checks

- The motion button exposes an action rather than combining changing action text with a pressed toggle state. Its description explains playing, paused, or device-requested static operation. Under reduced motion it stays keyboard focusable for its explanation and ignores activation.
- One concise polite status region reports selected identity, contribution context/role, and updated details. The entire detail panel is no longer a live region. Decorative canvas/scene content remains hidden from accessibility APIs.
- All project buttons resolve both `aria-controls` targets. Enter retains focus on the selected button and leaves exactly one pressed project. Tab from PharmaLink reaches its first maintained workflow link with a visible solid outline.
- The 320px homepage had matching document/scroll widths of 310px, including keyboard selection and workflow focus. Explore retained paused selection, the matching workflow links and contribution announcement, and the same phone reflow.
- Both themes were inspected. Original light theme and paused preference were restored. Inspected browser warning/error logs were empty.
- Forced-colors CSS now supplies an explicit selected border and system-color focus outline. Keyboard scroll margins reserve space for the sticky navigation. Forced-colors rendering itself was not emulated.
- All 109 existing tests, TypeScript, production build, and 28-page static verification passed. The fixture supplies browser integration coverage; it does not increase the Node unit-test count.

## Remaining manual checks

Actual OS/browser reduced-motion and forced-colors rendering, spoken screen-reader output, physical touch/coarse input, background-tab timing, representative-device performance, and a wider zoom review remain unverified. The simulated lifecycle checks above complement those checks; they do not replace them. Responsive refinement, measured performance review, and final release verification remain separate roadmap stages.
