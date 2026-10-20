# Home section signal sweeps

Ready locally, 19 October 2026. Requested as a bounded home-page animation enhancement.

Four chapter markers introduce discovery, About, projects, and skills. As each chapter first enters the viewport, its accent line draws across the page, its label rises ten pixels, and its number emits one soft pulse. Existing card reveals remain intact. All new animation ends within one second; there are no new scroll listeners or continuous rendering loops.

`HomeChapter` uses the existing Motion intersection hook and the shared motion preference. Decorative elements are hidden from assistive technology and do not intercept clicks. Both device reduced motion and the saved Reduce motion choice disable the animations. Content remains visible even before a chapter is reached. The wrappers do not transform the section content.

Validation: type check, 146 tests, build, static verification, and local HTTP verification passed (30 routes, 94 assets, four PDF downloads, both feeds, execution evidence, and excluded routes). Browser review confirmed the first chapter activates while later chapters remain idle, the reduced-motion setting removes the sweep animation, and all four markers fit at 320px without horizontal overflow. Preferences and viewport were restored after review.

Evidence: `output/home-scroll/desktop.png` and `output/home-scroll/checks.json`. Preview: <http://127.0.0.1:4173/#directory>. Not published.

## Follow-up: screenshot depth

The four home project screenshot frames now drift from +8px to −8px and rotate from −0.35° to +0.35° through their viewport journey. Movement uses the existing Motion scroll values without React renders per scroll tick. The complete screenshot frame moves without cropping or zooming its contents. Keyboard focus, narrow screens below 768px, coarse pointers, and reduced motion disable the transform.

The complete release check passed again: 146 tests, type checking, build, static checks, and HTTP artifact verification. Browser measurements confirmed changing transforms across a scroll, no transform with reduced motion, and no transform or horizontal overflow at 320px. Preferences and viewport were restored. Evidence: `output/project-depth/desktop.png` and `output/project-depth/checks.json`. This addition remains local.

## Final navigation polish: back to top

The English home page now exposes a 48px circular return link after scrolling past one and a half viewports. It reuses the existing page-progress update, adding no new scroll listener. Activation focuses the main content and returns to page top; reduced motion uses an immediate return. The link is hidden at the top and while a modal dialog is open.

All 146 tests and the full production verification passed again. Browser checks confirmed keyboard activation returns focus to `main-content` and scroll position zero, plus a 48×48px target and no horizontal overflow at 320px. Evidence: `output/back-to-top/`. Changes remain local.

## Discovery-card finishing touch — 20 October 2026

Discovery cards now draw a slim accent line on hover or keyboard focus. Keyboard focus also receives the existing directional arrow feedback. Reduced motion removes the arrow movement and line transition. This CSS-only addition passed the production build and static verification; browser keyboard review confirmed a focused card's accent line fully expands. Evidence: `output/card-polish/keyboard-focus.png`. No new JavaScript or dependency was added; changes remain local.
