export const notesFeedUrl =
  "https://jamesian-portfolio.vercel.app/notes/feed.xml"
export const reflectionsFeedUrl =
  "https://jamesian-portfolio.vercel.app/reflections/feed.xml"

interface FeedNote {
  path: string
  title: string
  summary: string
  topic: string
}

function escapeXml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[character]!,
  )
}

// Canonical article URLs stay stable across edits, filters, and rebuilds.
// Publication dates are omitted until the content has confirmed date metadata.
export function notesFeedXml(notes: readonly FeedNote[]): string {
  return publicationFeedXml(notes, "notes")
}
export function reflectionsFeedXml(reflections: readonly FeedNote[]): string {
  return publicationFeedXml(reflections, "reflections")
}
function publicationFeedXml(
  notes: readonly FeedNote[],
  collection: "notes" | "reflections",
): string {
  const title = collection === "notes" ? "Engineering Notes" : "Reflections"
  const description =
    collection === "notes"
      ? "Engineering decisions and trade-offs from James Ian Bayonas's projects."
      : "Reflections on contribution, collaboration, and explaining engineering decisions through documented projects."
  const feedUrl = collection === "notes" ? notesFeedUrl : reflectionsFeedUrl
  const seen = new Set<string>()
  const items = notes
    .map((note) => {
      if (
        !new RegExp(`^/${collection}/[a-z0-9-]+/$`).test(note.path) ||
        seen.has(note.path)
      ) {
        throw new Error(`Invalid or duplicate note path: ${note.path}`)
      }
      seen.add(note.path)
      const url = `https://jamesian-portfolio.vercel.app${note.path}`
      return `    <item>
      <title>${escapeXml(note.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(note.summary)}</description>
      <category>${escapeXml(note.topic)}</category>
    </item>`
    })
    .join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title} | James Ian Bayonas</title>
    <link>https://jamesian-portfolio.vercel.app/${collection}/</link>
    <description>${description}</description>
    <language>en</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}
