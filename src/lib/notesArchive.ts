import type { EngineeringNote } from "../data/notes"

export interface NotesFilters {
  query: string
  topic: string
  project: string
}

export const emptyNotesFilters: NotesFilters = {
  query: "",
  topic: "",
  project: "",
}

export function noteTopicId(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function filterNotes<T extends EngineeringNote & {
  projectName?: string
},>(notes: T[], filters: NotesFilters): T[] {
  const terms = filters.query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  return notes.filter((note) => {
    const text = [
      note.title,
      note.summary,
      note.topic,
      note.projectId,
      note.projectName ?? "",
      ...note.flow,
      ...note.sections.flatMap((section) => [
        section.title,
        ...section.paragraphs,
      ]),
    ]
      .join(" ")
      .toLowerCase()
    return (
      (!filters.topic || noteTopicId(note.topic) === filters.topic) &&
      (!filters.project || note.projectId === filters.project) &&
      terms.every((term) => text.includes(term))
    )
  })
}

export function readNotesFilters(
  search: string,
  topicIds: string[],
  projectIds: string[],
): NotesFilters {
  const params = new URLSearchParams(search)
  const topic = params.get("topic") ?? ""
  const project = params.get("project") ?? ""
  return {
    query: params.get("q") ?? "",
    topic: topicIds.includes(topic) ? topic : "",
    project: projectIds.includes(project) ? project : "",
  }
}

export function notesFilterSearch(filters: NotesFilters): string {
  const params = new URLSearchParams()
  if (filters.query.trim()) params.set("q", filters.query.trim())
  if (filters.topic) params.set("topic", filters.topic)
  if (filters.project) params.set("project", filters.project)
  return params.size ? `?${params}` : ""
}
