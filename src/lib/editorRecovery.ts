import type { EditableContent, ContentKind } from "./contentEditing"
import projectPages from "../data/caseStudyPages.json" with { type: "json" }

export const recoveryKey = "portfolio-content-drafts-v1"
export interface Recovery {
  schema: 1
  savedAt: string
  draft: EditableContent
  versions: Record<ContentKind, string>
}
const kinds: ContentKind[] = ["notes", "milestones", "reflections"]
function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
}
function textFields(
  value: unknown,
  names: string[],
): value is Record<string, unknown> {
  return record(value) && names.every((name) => typeof value[name] === "string")
}
function strings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}
function sections(value: unknown): boolean {
  return (
    record(value) &&
    Array.isArray(value.sections) &&
    value.sections.length > 0 &&
    value.sections.every(
      (section) =>
        textFields(section, ["id", "title"]) && strings(section.paragraphs),
    )
  )
}
// Recover incomplete text, but never render a malformed collection. Publication
// validation stays separate so blank unsaved fields can still be restored.
export function parseRecovery(source: string | null): Recovery | undefined {
  if (!source) return
  const value: unknown = JSON.parse(source)
  const invalid = () =>
    new Error(
      "The recovery copy is invalid. Export or discard it before editing.",
    )
  if (
    !record(value) ||
    value.schema !== 1 ||
    typeof value.savedAt !== "string" ||
    !Number.isFinite(Date.parse(value.savedAt)) ||
    !record(value.draft) ||
    !record(value.versions) ||
    !kinds.every(
      (kind) =>
        typeof (value.versions as Record<string, unknown>)[kind] === "string",
    )
  )
    throw invalid()
  const draft = value.draft
  if (
    !Array.isArray(draft.notes) ||
    !draft.notes.every(
      (note) =>
        textFields(note, [
          "id",
          "path",
          "projectId",
          "title",
          "summary",
          "topic",
          "flowCaption",
          "demoLabel",
          "sourceContext",
        ]) &&
        strings(note.flow) &&
        sections(note),
    )
  )
    throw invalid()
  if (
    !Array.isArray(draft.reflections) ||
    !draft.reflections.length ||
    !draft.reflections.every(
      (reflection) =>
        textFields(reflection, [
          "id",
          "path",
          "writtenAt",
          "title",
          "summary",
          "topic",
          "sourceContext",
        ]) &&
        sections(reflection) &&
        textFields(reflection.filipino, [
          "title",
          "summary",
          "topic",
          "sourceContext",
        ]) &&
        sections(reflection.filipino) &&
        Array.isArray(reflection.references) &&
        reflection.references.every((reference: unknown) =>
          textFields(reference, ["label", "path"]),
        ),
    )
  )
    throw invalid()
  if (
    !record(draft.milestones) ||
    projectPages.some(
      (page) =>
        !Array.isArray(
          (draft.milestones as Record<string, unknown>)[page.projectId],
        ),
    )
  )
    throw invalid()
  if (
    !Object.values(draft.milestones).every(
      (entries) =>
        Array.isArray(entries) &&
        entries.length > 0 &&
        entries.every(
          (entry) =>
            textFields(entry, [
              "id",
              "commit",
              "committedAt",
              "title",
              "change",
              "reason",
              "outcome",
            ]) && strings(entry.evidencePaths),
        ),
    )
  )
    throw invalid()
  return value as unknown as Recovery
}
export function recoveryConflicts(
  recovery: Recovery,
  current: Record<ContentKind, {
    version: string
    value: unknown
  }>,
): ContentKind[] {
  return kinds.filter(
    (kind) =>
      recovery.versions[kind] !== current[kind].version &&
      JSON.stringify(recovery.draft[kind]) !==
        JSON.stringify(current[kind].value),
  )
}
