import type { EngineeringNote } from "../data/notes"
import type { RelatedNoteConnection } from "../data/relatedNotes"

export function relatedNotes<T extends Pick<EngineeringNote, "id" | "path">>(
  current: T,
  notes: T[],
  connections: Record<string, RelatedNoteConnection[]>,
) {
  const seen = new Set([current.id])
  return (connections[current.id] ?? [])
    .flatMap((connection) => {
      const note = notes.find((note) => note.id === connection.noteId)
      if (!note?.path || seen.has(note.id) || !connection.reason.trim())
        return []
      seen.add(note.id)
      return [{ note, reason: connection.reason }]
    })
    .slice(0, 2)
}
