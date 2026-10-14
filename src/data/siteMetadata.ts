import { professionalContent } from "./professionalProfile.ts"
import pages from "./sitePages.json" with { type: "json" }
import { engineeringNotes } from "./notes.ts"
import filipinoPages from "./filipinoPages.json" with { type: "json" }
import { reflectionPages } from "./reflectionPages.ts"

// Article metadata follows the editable title and summary automatically.
export const siteMetadata = [
  ...[...pages, ...filipinoPages].map((page) => {
    const language = page.path.startsWith("/fil/") ? "fil" : "en"
    const route = language === "fil" ? page.path.slice(4) : page.path
    const copy =
      professionalContent[language].pages[
        (route as keyof typeof professionalContent.en.pages)
      ]
    return copy ? { ...page, ...copy.metadata } : page
  }),
  ...reflectionPages,
  ...engineeringNotes.map((note) => ({
    path: note.path,
    title: `${note.title} | James Ian Bayonas`,
    description: note.summary,
  })),
]
