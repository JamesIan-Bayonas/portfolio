export interface SearchEntry {
  id: string
  label: string
  description: string
  category: string
  target: string
  keywords: string[]
  expandCaseStudy?: boolean
  path?: string
  language?: string
}

export function searchDestination(entry: SearchEntry): string {
  return `${entry.path ?? "/"}${entry.target === "case-study" ? "" : `#${encodeURIComponent(entry.target)}`}`
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .trim()
}

export function searchEntries(
  entries: SearchEntry[],
  query: string,
): SearchEntry[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return entries
  return entries
    .map((entry, index) => {
      const label = normalize(entry.label)
      const haystack = normalize(
        [entry.label, entry.description, ...entry.keywords].join(" "),
      )
      const score = terms.every((term) => haystack.includes(term))
        ? terms.reduce(
            (total, term) =>
              total +
              (label.startsWith(term) ? 4 : label.includes(term) ? 2 : 1),
            0,
          )
        : 0
      return { entry, score, index }
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((result) => result.entry)
}
