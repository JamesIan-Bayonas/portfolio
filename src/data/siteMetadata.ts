import pages from "./sitePages.json" with { type: "json" }
import { engineeringNotes } from "./notes.ts"

// Article metadata follows the editable title and summary automatically.
export const siteMetadata = [
  ...pages,
  ...engineeringNotes.map((note) => ({
    path: note.path,
    title: `${note.title} | James Ian Bayonas`,
    description: note.summary,
  })),
]
