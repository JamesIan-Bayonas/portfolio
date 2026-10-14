import pages from "./sitePages.json" with { type: "json" }
import { engineeringNotes } from "./notes.ts"
import filipinoPages from "./filipinoPages.json" with { type: "json" }

// Article metadata follows the editable title and summary automatically.
export const siteMetadata = [
  ...pages,
  ...filipinoPages,
  ...engineeringNotes.map((note) => ({
    path: note.path,
    title: `${note.title} | James Ian Bayonas`,
    description: note.summary,
  })),
]
