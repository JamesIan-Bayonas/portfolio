# Accessibility review — 15 October 2026

This review separates source/structure checks from interaction checks. It does not claim a complete WCAG audit or PDF/UA certification.

| Area | Evidence | Status |
| --- | --- | --- |
| Focus and keyboard structure | Shared visible focus styles, focusable main landmark, skip link, labelled fields, and case-study section focus were inspected. The 14 October browser review verified editor fields and section/answer focus. | Source reviewed; earlier interaction evidence retained |
| Reduced motion | Shared CSS disables animations/transitions and smooth scrolling under the preference. Homepage MotionConfig and useReducedMotion handling remain present; the scroll indicator is hidden from assistive technology. | Source reviewed; preference emulation unverified |
| Actual 200%/400% zoom | Native Edge inspection stopped before input because the active browser URL could not be verified by the control tool. No substitute CSS scaling was counted as browser zoom. | Pending direct review |
| Screen-reader speech | No running screen-reader window was exposed by app discovery. No spoken reading or screen-reader navigation was captured. | Pending direct review |
| PDF language and title | All four regenerated briefs use `/Lang (en)` and display the existing meaningful document title. | Structurally verified |
| PDF headings and reading order | One H1, H2 section labels, paragraph tags, and explicit MCIDs follow the header and complete-column reading sequence. Decorative shapes and page number are artifacts. Marked-content boundaries and parent mappings are validated after writing. | Structurally verified |
| PDF links and tab order | Four labelled annotations have `/Link` elements, object references, parent-tree entries, and page `/Tabs /S`. Original destinations remain unchanged. | Structurally verified |
| PDF visual layout | All four one-page PDFs were rendered with bundled Poppler and visually inspected: no clipping, overlap, missing text, or broken link-area layout. Poppler emitted fallback-font warnings for Symbol/ArialUnicode; the required visible text rendered correctly. | Visually reviewed |
| New Filipino DormFix layout | It reuses the case-study renderer; automated checks cover content/evidence identity, credits, route/language pairs, and emitted assets. New live browser/mobile interaction was unavailable after native browser control stopped. | Automated/source checks only |

The PDF generator implements structure during authoring rather than guessing paragraph order after layout. Its validator compares the written structure tree with the recorded draw-order roles, checks every visible text operation is tagged or marked as an artifact, and validates link ownership. Source paragraphs, one-page output, canonical destinations, and the delivered PDF 1.7 header are still checked independently. All four deployed PDF hashes matched the reviewed files in the 15 October live verification.

Design references: [W3C PDF3: reading and tab order](https://www.w3.org/WAI/WCAG22/Techniques/pdf/PDF3), [PDF9: headings](https://www.w3.org/WAI/WCAG22/Techniques/pdf/PDF9), and [PDF11: links](https://www.w3.org/WAI/WCAG22/Techniques/pdf/PDF11). These techniques do not, by themselves, certify the finished documents. Actual assistive-technology behavior and the existing standard-font choice remain outside this structural check.

## Next direct checks

Review all new interactions at actual 200% and 400% browser zoom; traverse navigation, search, dialogs, and editor forms with a screen reader; exercise the real reduced-motion preference; and inspect the PDF heading/link navigation in a supported reader. Record the tool, pages, observed behavior, and fixes. Do not mark these checks complete based on source inspection or the earlier 320px reflow results.
