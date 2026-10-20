# Article reading position — 19 October 2026

Status: ready locally; not published. The user chose another visual feature after the original visual plan was completed.

## Visitor need and scope

Long case studies and engineering notes now show an article-position percentage and matching track in their existing contents navigation. The existing global page-progress line remains unchanged. The percentage describes scroll position, not proof that a visitor has read or completed the material.

The shared `ReadingProgress` component measures the containing case-study article, or the note's `.note-body` so related reading and subscription sections do not extend the note's reading range. It clamps to 0–100, handles short content, and recalculates after content resizing. A native, labelled progress element exposes the current value without repeatedly announcing scroll updates. The case-study label is translated on Filipino pages.

Updates are event-driven and coalesced into one pending frame. There is no continuous animation loop or easing, including when reduced motion is selected. Hidden-document work is cancelled, and listeners and the resize observer are cleaned up on unmount.

## Validation

- Type checking, all 146 existing tests, production build, and static verification passed.
- Local production HTTP verification passed for 30 routes and 94 built assets, four PDFs, both feeds, execution evidence, and excluded owner/development routes.
- Production-browser checks observed 0% at the case-study start and 100% at its end; the engineering section showed 45% on desktop.
- At 320px, the case-study controls fit without horizontal overflow and section navigation left the target below the sticky contents bar.
- The Filipino DormFix page exposed the label “Posisyon sa artikulo” and fit at 320px.
- The DormFix note showed 0% initially, 54% at the business-rules section, and 100% at the end; it fit at 320px.
- Browser evidence and screenshot: `output/reading-progress/`.

The native progress appearance follows the existing theme tokens. Physical-device and assistive-technology checks remain manual. Note contents retain their existing responsive behavior; this addition does not introduce a separate floating mobile overlay.
