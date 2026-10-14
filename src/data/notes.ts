import notesContent from "./notesContent.json" with { type: "json" }

export interface EngineeringNoteSection {
  id: string
  title: string
  paragraphs: string[]
}
export interface EngineeringNote {
  id: string
  path: string
  projectId: string
  title: string
  summary: string
  topic: string
  flow: string[]
  flowCaption: string
  demoLabel: string
  sourceContext: string
  sections: EngineeringNoteSection[]
}

export const engineeringNotes: EngineeringNote[] = notesContent

export function noteReadingMinutes(note: EngineeringNote): number {
  const words = [
    note.title,
    note.summary,
    ...note.sections.flatMap((section) => [
      section.title,
      ...section.paragraphs,
    ]),
  ]
    .join(" ")
    .trim()
    .split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}
