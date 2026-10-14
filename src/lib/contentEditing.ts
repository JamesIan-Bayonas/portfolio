import type { EngineeringNote } from "../data/notes"
import type { ProjectMilestone } from "../data/projectEvolution"
import type { Reflection } from "../data/reflections"

export type EditableContent = {
  notes: EngineeringNote[]
  milestones: Record<string, ProjectMilestone[]>
  reflections: Reflection[]
}
export type ContentKind = keyof EditableContent

const slug = /^[a-z][a-z0-9-]*$/
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Expected a content object.")
  return value as Record<string, unknown>
}
function text(value: unknown, label: string, limit = 12000) {
  if (typeof value !== "string" || !value.trim() || value.length > limit)
    throw new Error(`${label} must contain text (up to ${limit} characters).`)
}
function list(value: unknown, label: string, limit: number): unknown[] {
  if (!Array.isArray(value) || !value.length || value.length > limit)
    throw new Error(`${label} must contain between 1 and ${limit} entries.`)
  return value
}
function unchanged(value: unknown, baseline: unknown, label: string) {
  if (JSON.stringify(value) !== JSON.stringify(baseline))
    throw new Error(
      `${label} cannot change in this editor. Update and review structural changes in the repository.`,
    )
}

// The editor maintains existing records; route identities and reviewed evidence
// remain fixed. New publications or evidence require the normal review workflow.
export function validateEditableContent(
  kind: ContentKind,
  value: unknown,
  baseline: EditableContent[ContentKind],
): void {
  if (kind === "reflections") {
    const records = list(value, "Reflections", 100)
    const original = baseline as EditableContent["reflections"]
    unchanged(
      records.map((record) => {
        const item = object(record)
        return [item.id, item.path, item.writtenAt, item.references]
      }),
      original.map((item) => [
        item.id,
        item.path,
        item.writtenAt,
        item.references,
      ]),
      "Reflection identities, writing dates, and references",
    )
    for (const [index, record] of records.entries()) {
      const reflection = object(record)
      unchanged(
        Object.keys(reflection).sort(),
        Object.keys(original[index]).sort(),
        "Reflection structure",
      )
      for (const language of ["en", "fil"] as const) {
        const copy =
          language === "en" ? reflection : object(reflection.filipino)
        const source =
          language === "en" ? original[index] : original[index].filipino
        if (language === "fil")
          unchanged(
            Object.keys(copy).sort(),
            Object.keys(source).sort(),
            "Filipino copy structure",
          )
        const label = `Reflection ${index + 1} (${
          language === "en" ? "English" : "Filipino"
        })`
        for (const field of ["title", "summary", "topic", "sourceContext"])
          text(
            copy[field],
            `${label}: ${field}`,
            field === "title" ? 300 : field === "topic" ? 200 : 12000,
          )
        const sections = list(copy.sections, `${label} sections`, 40)
        unchanged(
          sections.map((section) => object(section).id),
          source.sections.map((section) => section.id),
          `${label} section anchors`,
        )
        for (const [sectionIndex, sectionValue] of sections.entries()) {
          const section = object(sectionValue)
          unchanged(
            Object.keys(section).sort(),
            Object.keys(source.sections[sectionIndex]).sort(),
            "Section structure",
          )
          if (typeof section.id !== "string" || !slug.test(section.id))
            throw new Error("Invalid section anchor.")
          text(
            section.title,
            `${label}: section ${sectionIndex + 1} title`,
            300,
          )
          for (const paragraph of list(
            section.paragraphs,
            `${label}: section ${sectionIndex + 1} paragraphs`,
            100,
          ))
            text(paragraph, `${label}: section ${sectionIndex + 1} paragraph`)
        }
      }
      unchanged(
        object(reflection).sections &&
          (reflection.sections as { id: string }[]).map(
            (section) => section.id,
          ),
        (object(reflection.filipino).sections as { id: string }[]).map(
          (section) => section.id,
        ),
        "Paired translation anchors",
      )
    }
    return
  }
  if (kind === "notes") {
    const records = list(value, "Notes", 100)
    const original = baseline as EditableContent["notes"]
    unchanged(
      records.map((record) => {
        const item = object(record)
        return [item.id, item.path, item.projectId]
      }),
      original.map((item) => [item.id, item.path, item.projectId]),
      "Note identities",
    )
    for (const [index, record] of records.entries()) {
      const note = object(record)
      for (const field of [
        "title",
        "summary",
        "topic",
        "flowCaption",
        "demoLabel",
        "sourceContext",
      ])
        text(
          note[field],
          `Note ${index + 1}: ${field}`,
          field === "title"
            ? 300
            : field === "topic" || field === "demoLabel"
              ? 200
              : 12000,
        )
      for (const step of list(note.flow, "Flow", 12))
        text(step, "Flow step", 200)
      const sections = list(note.sections, "Sections", 40)
      unchanged(
        sections.map((section) => object(section).id),
        original[index].sections.map((section) => section.id),
        "Section anchors",
      )
      for (const sectionValue of sections) {
        const section = object(sectionValue)
        if (typeof section.id !== "string" || !slug.test(section.id))
          throw new Error("Invalid section anchor.")
        text(section.title, "Section title", 300)
        for (const paragraph of list(section.paragraphs, "Paragraphs", 100))
          text(paragraph, "Paragraph")
      }
    }
    return
  }
  if (kind !== "milestones") throw new Error("Unknown content collection.")
  const record = object(value)
  const original = baseline as EditableContent["milestones"]
  unchanged(
    Object.keys(record).sort(),
    Object.keys(original).sort(),
    "Project identities",
  )
  for (const [project, entries] of Object.entries(record)) {
    const milestones = list(entries, "Milestones", 100)
    unchanged(
      milestones.map((entry) => {
        const item = object(entry)
        return [item.id, item.committedAt, item.commit, item.evidencePaths]
      }),
      original[project].map((item) => [
        item.id,
        item.committedAt,
        item.commit,
        item.evidencePaths,
      ]),
      "Reviewed milestone evidence",
    )
    for (const entry of milestones) {
      const item = object(entry)
      for (const field of ["title", "change", "reason", "outcome"])
        text(item[field], `${project}: ${field}`)
    }
  }
}
