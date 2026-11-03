export const fieldbookKinds = [
  "All",
  "Systems",
  "Notes",
  "Reflections",
  "Lab",
  "Tools",
] as const
export type FieldbookKind = typeof fieldbookKinds[number]

export interface FieldbookRecord {
  kind: Exclude<FieldbookKind, "All">
  title: string
  summary: string
  tags: string[]
}

export function filterFieldbook<T extends FieldbookRecord>(
  entries: readonly T[],
  kind: FieldbookKind,
  query: string,
  topic = "",
): T[] {
  const words = query
    .normalize("NFKC")
    .toLocaleLowerCase("en")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  return entries.filter((entry) => {
    if (kind !== "All" && entry.kind !== kind) return false
    if (
      topic &&
      !entry.tags.some((tag) => tag.toLowerCase() === topic.toLowerCase())
    )
      return false
    const text = [entry.title, entry.summary, entry.kind, ...entry.tags]
      .join(" ")
      .normalize("NFKC")
      .toLocaleLowerCase("en")
    return words.every((word) => text.includes(word))
  })
}

export function fieldbookTopics(entries: readonly FieldbookRecord[]) {
  const topics = new Map<string, { label: string; count: number }>()
  for (const entry of entries) {
    for (const tag of new Set(entry.tags.map((tag) => tag.toLowerCase()))) {
      const existing = topics.get(tag)
      if (existing) existing.count++
      else
        topics.set(tag, {
          label: entry.tags.find((label) => label.toLowerCase() === tag)!,
          count: 1,
        })
    }
  }
  return [...topics.values()].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label),
  )
}

export function readFieldbookView(search: string, topics: readonly string[]) {
  const params = new URLSearchParams(search)
  const kind = params.get("fb-kind")
  const tag = params.get("fb-topic") ?? ""
  return {
    kind: fieldbookKinds.includes(kind as FieldbookKind)
      ? kind as FieldbookKind
      : "All" as FieldbookKind,
    query: params.get("fb-q") ?? "",
    topic:
      topics.find((topic) => topic.toLowerCase() === tag.toLowerCase()) ?? "",
    view:
      params.get("fb-view") === "index" ? "index" as const : "gallery" as const,
    sort:
      params.get("fb-sort") === "title" ? "title" as const : "curated" as const,
  }
}

