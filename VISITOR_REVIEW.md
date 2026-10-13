# Visitor journey and accessibility review

Reviewed on 13 October 2026. This was an agent-led task walkthrough, visual inspection, source review, and browser verification. No recruiters or other human participants were tested, and no comprehension or completion-time results are claimed.

## Journey reviewed

Home → Explore → DormFix case study → written explanation or project-specific contact. The gallery was also reviewed on IsdaLog, where several images make keyboard navigation and panning important.

| Finding | Change |
| --- | --- |
| The homepage's “Explore case studies” button opened the long home project section instead of Explore. | It now opens `/explore/`; the home projects remain available through navigation. |
| Contact required scrolling past the walkthrough and written narrative. | Each case-study header now offers the project-aware contact panel. |
| Readers had to pass the interactive walkthrough to reach the written explanation. | A “Read the case study” link jumps directly to `#engineering`, below the fixed header. |
| “My contribution” was followed only by a role name. | The header labels this “My role”; the narrative retains the actual contribution and project context. DormFix's introduction credits the classmate's proposal and James's feature development. |
| Overview captions repeated project descriptions rather than explaining the displayed interface. | Captions now identify the harvester dashboard, landlord overview, asset register, and checkout catalog/cart, with descriptions based on the actual captures. |
| Arrow keys changed the image when a zoomed gallery region had focus. | Focused, zoomed images use arrow keys for native panning; Previous/Next controls continue gallery navigation. |
| Screenshot position/title changes had no explicit announcement together. | A polite status includes the position and image title. The focused image region references context-sensitive keyboard help. Actual spoken output needs a human check. |

## Verification

- All 12 routes were inspected at 320 × 760. Each had one H1, no duplicate IDs, no missing image alt attributes, no unlabelled form fields, and no document-level horizontal overflow in the inspected DOM.
- The corrected Home → Explore → DormFix path worked, including direct access to the header contact panel with DormFix preselected.
- The written case-study jump landed at 88 pixels below the viewport top, clearing the fixed navigation.
- Desktop and 320-pixel gallery checks confirmed that a zoomed image remained selected while arrow keys panned it; Next still switched the image. Gallery captions and announcement markup matched the selection, and the close control remained visible.
- Contact keyboard focus wrapped within its panel; Escape restored focus to the header trigger and removed the background scroll lock.
- TypeScript, all 46 tests, the production build, static route/dependency checks, and all 33 image variants passed. No browser console errors appeared during the review.
- DormFix, CentraLog, and PharmaLink public URLs returned HTTP 200. IsdaLog returned 404 and remains labelled unavailable. These are availability checks, not verification of authenticated application workflows.

## Human checks still needed

Actual browser zoom could not be exercised with the available browser control; the zoom shortcut failed without changing the viewport or computed heading size. The 320-pixel reflow check is recorded separately and is not a substitute for text enlargement or 200%/400% zoom testing. Reduced-motion handling was reviewed in source; preference emulation was unavailable. No screen-reader speech was captured.

On a device with your usual screen reader, verify that opening a gallery announces its title, Next announces the new image position/title once, and Escape returns to the opening button. In the contact panel, verify project/type labels, required description, draft review, and copy-result announcements. Also check actual browser zoom and the operating system's reduced-motion preference.

For a human recruiter-style check, ask someone unfamiliar with these projects to find one relevant system, explain what James personally built, identify one engineering decision, and prepare an inquiry without sending it. Record where they hesitate and any terms they cannot explain. Use that feedback to prioritize subsequent changes.
