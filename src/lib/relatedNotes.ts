import type { EngineeringNote } from "../data/notes"
import type { RelatedNoteConnection } from "../data/relatedNotes"

export function relatedNotes<T extends Pick<EngineeringNote, "id" | "path"> & Partial<Pick<EngineeringNote, "projectId" | "topic">>,>(
  current: T,
  notes: T[],
  connections: Record<string, RelatedNoteConnection[]>,
) {
  const seen = new Set([current.id])
  const recommendations = (connections[current.id] ?? [])
    .flatMap((connection) => {
      const note = notes.find((note) => note.id === connection.noteId)
      if (!note?.path || seen.has(note.id) || !connection.reason.trim())
        return []
      seen.add(note.id)
      return [{ note, reason: connection.reason }]
    })
    .slice(0, 2)
  if (recommendations.length || !current.projectId) return recommendations
  return notes
    .filter(
      (note) =>
        note.id !== current.id &&
        note.path &&
        note.projectId === current.projectId,
    )
    .slice(0, 2)
    .map((note) => ({
      note,
      reason:
        "Both articles examine the same project's workflows and engineering decisions. Follow the case study for their shared implementation context.",
    }))
}
