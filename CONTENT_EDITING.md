# Local content workspace

The workspace maintains existing Engineering Notes, bilingual reflections, and project milestones through labelled fields and draft previews. It runs on your computer and saves into this repository. It is excluded from the public portfolio build.

## Open the workspace

From the portfolio folder, run:

```powershell
npm run content:edit
```

Open [the local content workspace](http://127.0.0.1:4186/editor/). Keep the process running while editing. Stop it with Ctrl+C when finished. The address uses `127.0.0.1`; the server listens only on that local interface.

## Edit and review

1. Choose **Engineering Notes**, **Project milestones**, or **Reflections · English / Filipino**, then choose a record.
2. Edit the labelled fields. The draft preview follows your changes. Separate note paragraphs with a blank line and put each workflow step on its own line.
3. Select **Save notes**, **Save milestones**, or **Save reflections**. This saves the selected collection. Other unsaved drafts remain in the workspace. Reflection saves include both languages together.
4. Use **Open saved content in the local portfolio** to inspect the actual page. Reload a previously opened preview to see subsequent saves.
5. Review the repository changes before publishing. Saved notes automatically feed article metadata, search, reading times, and the RSS output at the next build.

Routes, project identities, section anchors, and reviewed milestone dates, commits, and evidence paths stay fixed in this editor. New publications, new milestones, reordered sections, or revised evidence should follow the repository review workflow, including related-note curation and source verification.

## Bilingual reflections

English and Filipino fields appear side by side on desktop and stack on mobile. Each version has a draft preview and a link to its saved local page. Edit the title, summary, topic, supporting context, section titles, and paragraphs. Review both languages before saving; a missing or blank required field in either language blocks the save.

Article routes, writing dates, paired section anchors, and supporting reference labels/links remain fixed. Use the repository review process to add articles or change these structures. Saving updates the maintained copy for both versions; the next portfolio build derives their metadata, search entries, reading estimates, and English reflections RSS from that copy.

## Draft and save behavior

- Unsaved drafts remain in the current page when switching records or collections. A navigation warning protects against leaving with unsaved edits. Closing the page does not preserve drafts.
- **Discard edits and reload** replaces the drafts with repository content. Copy any work you need before using it.
- Empty required text and invalid structures block saving. Save errors preserve the draft for correction.
- If repository content changed outside the workspace, saving is rejected. Copy your draft, reload, then apply it to the latest content. This also applies when two editor tabs try to save the same collection.
- Saving uses a temporary file and a rename within the content directory. Git remains the review and recovery mechanism for saved edits.
- The server accepts only the three named content collections. Saving requires the local origin and a session token; the token changes when the editor process restarts. Reload the editor after restarting it.

## Content sources

- `src/data/notesContent.json`: note copy and existing section content.
- `src/data/projectEvolutionContent.json`: milestone explanations and their fixed reviewed evidence.
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
