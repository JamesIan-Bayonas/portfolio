# English and Filipino

English remains the default. The user selected Filipino for the first additional language on 14 October 2026.

## Published coverage

| English destination | Filipino destination | Coverage |
| --- | --- | --- |
| `/` | `/fil/` | Filipino introduction, four project summaries, contributions, version scope, and links into English evidence |
| `/about/` | `/fil/about/` | Education and project journey |
| `/now/` | `/fil/now/` | Dated current work and learning themes |
| `/work-with-me/` | `/fil/work-with-me/` | Supported work discussions, examples, process, and contact controls |

Detailed case studies, the project explorer, notes, labs, question guide, screenshots, source files, resume, and PDF briefs remain in English. Filipino entry points label these English destinations. The prepared email retains its English template labels and the visitor's original description; the Filipino contact panel explains this before review.

## Navigation behavior

- The desktop header exposes the other language. On small screens it appears in the navigation menu.
- Language selection uses explicit URLs; no automatic browser-language redirect is applied.
- Switching a professional page preserves its counterpart and section fragment.
- Switching from an English case study opens the matching project card in the Filipino overview. Notes switch to the overview's English-resource explanation.
- Internal links between translated pages retain Filipino. Choosing an explicitly labelled English resource opens its English page, whose language switch provides a route back.
- Filipino pages are discoverable in portfolio search, with language tags on the search results. English search shortcuts keep their original order.

## Copy and metadata sources

- `src/data/filipino.ts`: Filipino professional copy, project summaries, and version explanations.
- `src/data/filipinoPages.json`: static Filipino page metadata.
- `src/lib/locale.ts`: supported route pairs and language-link behavior.
- `src/data/filipinoTranslationSources.json`: hashes of the English project and professional source files reviewed for these translations.

Names, institution, degree title, project identifiers, technology names, source references, and dates retain their meaning. The official degree title is displayed in English. Source context continues to distinguish the historical DormFix pipeline, IsdaLog's illustrative split, and reviewed versus documented implementations.

Each static page sets its HTML language. The `fil` language tag is registered for Filipino in the [IANA language registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry). Search alternatives use `en` and `tl` for this Tagalog-based Filipino copy, with English as `x-default`; the two-letter annotations follow [Google's supported hreflang language format](https://developers.google.com/search/docs/specialty/international/localized-versions). These annotations do not establish search indexing or ranking.

## Maintaining translations

1. Review Filipino copy whenever the English project or professional source changes, especially contribution credits, dates, current work, and version scope.
2. Update the copy and relevant page metadata. Review visible English-resource labels if translation coverage changes.
3. After that review, update the source hashes in `filipinoTranslationSources.json`. Hash UTF-8 source text with SHA-256 after normalizing CRLF to LF. Build verification rejects changed source files until their translations have been reviewed and the recorded hashes updated.
4. Run the normal checks and inspect both languages on desktop and mobile before publishing.

The local content workspace currently edits the existing English notes and milestones. It does not edit these Filipino professional translations. Updating an English note keeps its English RSS and metadata in sync; it does not create a translated article.
