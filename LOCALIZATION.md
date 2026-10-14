# English and Filipino

English remains the default. The user selected Filipino for the first additional language on 14 October 2026.

## Published and locally prepared coverage

| English destination | Filipino destination | Coverage |
| --- | --- | --- |
| `/` | `/fil/` | Filipino introduction, four project summaries, contributions, version scope, and links into English evidence |
| `/about/` | `/fil/about/` | Education and project journey |
| `/now/` | `/fil/now/` | Dated current work and learning themes |
| `/work-with-me/` | `/fil/work-with-me/` | Supported work discussions, examples, process, and contact controls |
| `/reflections/` | `/fil/reflections/` | Reflection index, summaries, dates, reading estimates, and follow controls |
| `/reflections/credit-and-context/` | `/fil/reflections/credit-and-context/` | Project origins, collaboration, and contribution context |
| `/reflections/visible-decisions/` | `/fil/reflections/visible-decisions/` | Personal learning through workflow decisions and reviewable evidence |
| `/projects/centralog/` | `/fil/projects/centralog/` | Written engineering story, source/test explanations, execution scope, and milestones; published and verified on 15 October 2026 |
| `/projects/dormfix/` | `/fil/projects/dormfix/` | Written story, collaborative credit, historical OCR/model context, source/test scope, and milestones; published and verified on 15 October 2026 |

CentraLog and DormFix now have Filipino written case-study counterparts. Other detailed case studies, the project explorer, notes, labs, question guide, screenshots, source files, resume, and PDF briefs remain in English. Filipino entry points label these English destinations. The prepared email retains its English template labels and the visitor's original description; the Filipino contact panel explains this before review.

## Navigation behavior

- The desktop header exposes the other language. On small screens it appears in the navigation menu.
- Language selection uses explicit URLs; no automatic browser-language redirect is applied.
- Switching a professional page preserves its counterpart and section fragment.
- Switching CentraLog or DormFix preserves its translated case study and section fragment. Other English case studies open the matching project card in the Filipino overview. Notes switch to the overview's English-resource explanation.
- Internal links between translated pages retain Filipino. Choosing an explicitly labelled English resource opens its English page, whose language switch provides a route back.
- Filipino pages are discoverable in portfolio search, with language tags on the search results. English search shortcuts keep their original order.

## Copy and metadata sources

- `src/data/filipino.ts`: Filipino professional copy, project summaries, and version explanations.
- `src/data/filipinoPages.json`: static Filipino page metadata.
- `src/lib/locale.ts`: supported route pairs and language-link behavior.
- `src/data/filipinoTranslationSources.json`: hashes of the English project and professional source files reviewed for these translations.
- `src/data/filipinoCentralog.ts`: translated CentraLog narrative, source/test explanations, and milestones; canonical identities and evidence locations derive from the English records.
- `src/data/filipinoDormfix.ts`: translated DormFix narrative and evidence, retaining team contribution credit and historical versus later implementation scope.
- `src/lib/caseStudyCopy.ts`: shared case-study interface labels for English and Filipino.

Names, institution, degree title, project identifiers, technology names, source references, and dates retain their meaning. The official degree title is displayed in English. Source context continues to distinguish the historical DormFix pipeline, IsdaLog's illustrative split, and reviewed versus documented implementations.

Each static page sets its HTML language. The `fil` language tag is registered for Filipino in the [IANA language registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry). Search alternatives use `en` and `tl` for this Tagalog-based Filipino copy, with English as `x-default`; the two-letter annotations follow [Google's supported hreflang language format](https://developers.google.com/search/docs/specialty/international/localized-versions). These annotations do not establish search indexing or ranking.

## Maintaining translations

1. Review Filipino copy whenever the English project or professional source changes, especially contribution credits, dates, current work, and version scope.
2. Update the copy and relevant page metadata. Review visible English-resource labels if translation coverage changes.
3. After that review, update the source hashes in `filipinoTranslationSources.json`. Hash UTF-8 source text with SHA-256 after normalizing CRLF to LF. Build verification rejects changed source files until their translations have been reviewed and the recorded hashes updated.
4. Run the normal checks and inspect both languages on desktop and mobile before publishing.

The local content workspace creates and edits English notes, maintains milestones, and edits paired English/Filipino reflections. It now edits paired professional-profile copy and page search metadata too. It does not edit CentraLog/DormFix translations. Professional copy resides in professionalContent.json; both versions must be reviewed together. Their date/required-field checks run at build time. The former professionalProfile.ts source hash was removed because it is now a wrapper around that paired record. Review Filipino case-study copy after milestone/source/test changes; build verification tracks those source hashes too. Updating or publishing an English note keeps its English RSS and metadata in sync; it does not create a translated article.

Reflections are maintained in `src/data/reflectionsContent.json`, with English and Filipino copy together. The local editor provides paired fields and previews and saves both versions atomically. Review both versions when editing. Article routes, writing dates, paired section IDs, and supporting references are protected by editor validation; `writtenAt` records the reflection's writing date, not a project release date. The reflections RSS feed publishes English articles and labels that coverage explicitly on Filipino pages. Section selection updates the language-switch link so the counterpart retains the current section.
