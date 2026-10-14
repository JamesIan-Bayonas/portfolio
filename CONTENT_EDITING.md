# Local content workspace

The workspace creates Engineering Notes and maintains existing notes, bilingual professional pages and reflections, and project milestones through labelled fields and previews. It runs on your computer and saves into this repository. It is excluded from the public portfolio build.

## Open the workspace

From the portfolio folder, run:

```powershell
npm run content:edit
```

Open [the local content workspace](http://127.0.0.1:4186/editor/). Keep the process running while editing. Stop it with Ctrl+C when finished. The address uses `127.0.0.1`; the server listens only on that local interface.

## Edit and review

1. Choose **Engineering Notes**, **Project milestones**, **Reflections · English / Filipino**, or **Professional pages · English / Filipino**, then choose a record.
2. Edit the labelled fields. The draft preview follows your changes. Separate note paragraphs with a blank line and put each workflow step on its own line.
3. Select **Save notes**, **Save milestones**, **Save reflections**, or **Save professional pages**. This saves the selected collection. Other unsaved drafts remain in the workspace. Reflection and professional-page saves include both languages together.
4. Use **Open saved content in the local portfolio** to inspect the actual page. Reload a previously opened preview to see subsequent saves.
5. Review the repository changes before publishing. Saved notes automatically feed article metadata, search, reading times, and the RSS output at the next build.

Published routes, project identities, section anchors, and reviewed milestone dates, commits, and evidence paths stay fixed in this editor. New milestones and revised evidence still follow repository review. New Engineering Notes can be created as drafts as described below.

## Create an Engineering Note

1. Choose **Engineering Notes → Create a note**. Select the existing project and choose a unique article slug of up to 80 characters. The slug determines `/notes/<slug>/`; `feed` is reserved.
2. Write the title, summary, topic, workflow, source context, and sections. **Add a section**, its anchor field, and **Remove section** are available while the note is a draft. Anchors must be unique and cannot collide with page controls. **Remove this draft** removes an unpublished note; save the collection to persist that removal.
3. **Save notes** accepts incomplete draft text. Closing and reopening the editor loads saved drafts from the repository. Drafts have no public route and are excluded from search, RSS, metadata, and public JavaScript, including their text.
4. Use **Open saved content in the local portfolio** to open `/editor/?preview=<slug>`. This uses the real article layout with saved local content. Save first and reload the preview after further edits.
5. Choose **Mark for publication** after reviewing the content and evidence. Required fields must be complete before saving. Before the first publication save, **Keep as draft** remains available. After saving as published, the route, project, and section anchors become protected.
6. Run the release checks below and review the built article. Published records automatically enter the archive, search, case-study links, metadata, and RSS at build time. New notes receive related reading from the same project when available; existing curated recommendations retain their order. Curate cross-project connections in the repository when appropriate.

Marking and saving publication status includes the note in the next build. It does not commit, push, or deploy anything. Withdrawing an already published article requires repository review so existing links are considered.

## Bilingual reflections

English and Filipino fields appear side by side on desktop and stack on mobile. Each version has a draft preview and a link to its saved local page. Edit the title, summary, topic, supporting context, section titles, and paragraphs. Review both languages before saving; a missing or blank required field in either language blocks the save.

Article routes, writing dates, paired section anchors, and supporting reference labels/links remain fixed. Use the repository review process to add articles or change these structures. Saving updates the maintained copy for both versions; the next portfolio build derives their metadata, search entries, reading estimates, and English reflections RSS from that copy.

## Professional pages

Choose About, Now, or How I can help. Paired fields maintain page introductions, search titles/descriptions, journey explanations, expected-completion wording, current focus, learning themes, work areas, and discussion steps. The shared update date applies to both languages. Editing current focus also updates the Now introduction. Static navigation, section labels outside the editable records, shared identity, record counts/order, page addresses, and project links stay protected or repository-maintained. Review degree/institution changes and resume consistency in the repository.

The embedded preview follows unsaved edits using the public page renderer. Choose its English or Filipino version to review each language; links leave the draft preview for saved local pages. Blank required text or an invalid/mismatched date blocks saving. Incomplete edits can still be recovered. Earlier recovery copies are upgraded with the current saved professional collection, preserving their existing note/reflection/milestone drafts.

Saving both languages is atomic and does not translate automatically. Review both versions and their dates before release. Professional search/share metadata derives from the paired record at build time. Do not update the old sitePages/filipinoPages metadata copies for these six routes.

## Draft and save behavior

- Unsaved drafts remain when switching records or collections. A navigation warning protects against leaving with unsaved edits. The browser also keeps a recovery copy after edits, including incomplete fields. On reopening, choose **Restore drafts**, **Export recovery copy**, or **Discard recovery copy and reload**. Normal fields are disabled until a pending recovery copy is resolved.
- Recovery uses this browser's local storage at the editor origin. Clearing browser storage, private browsing, storage failure, or switching browser profiles can remove or prevent recovery. **Export drafts** creates an additional JSON copy. The recovery copy is shared across editor tabs; use one active editing tab. Saved content and Git remain the durable recovery mechanism.
- If repository versions changed since recovery was saved, automatic restoration is blocked for those changed collections. Export the copy, reload the current content, and reapply the edits. Malformed recovery copies can be exported or discarded but are not rendered.
- **Discard edits and reload** replaces the drafts with repository content. Copy any work you need before using it.
- Empty required text and invalid structures block saving. Save errors preserve the draft for correction.
- If repository content changed outside the workspace, saving is rejected. Copy your draft, reload, then apply it to the latest content. This also applies when two editor tabs try to save the same collection.
- Saving uses a temporary file and a rename within the content directory. Git remains the review and recovery mechanism for saved edits.
- The server accepts only the four named content collections. Saving requires the local origin and a session token; the token changes when the editor process restarts. Reload the editor after restarting it.

## Content sources

- `src/data/notesContent.json`: note copy and existing section content.
- `src/data/projectEvolutionContent.json`: milestone explanations and their fixed reviewed evidence.
- `src/data/professionalContent.json`: paired English/Filipino professional copy, shared update dates, protected links/identity, and page search metadata.
- `src/data/reflectionsContent.json`: paired English/Filipino reflection copy with fixed article identities and references.
- Typed wrappers retain the public components' existing interfaces. Article metadata is derived from the same note title and summary, rather than a second editable copy.

## Before publishing

```powershell
npm run check
npm test
npm run build
npm run verify:build
```

Review the built pages and resulting content changes, then use the established repository/Vercel release process. **Save** does not commit, push, or deploy the portfolio.
