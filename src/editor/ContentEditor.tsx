import { useEffect, useId, useMemo, useState } from "react"
import { createNoteDraft, validateEditableContent } from "../lib/contentEditing"
import type { ContentKind, EditableContent } from "../lib/contentEditing"
import ProfessionalEditor from "./ProfessionalEditor"
import ReflectionEditor from "./ReflectionEditor"
import {
  parseRecovery,
  recoveryConflicts,
  recoveryKey,
  type Recovery,
} from "../lib/editorRecovery"
import projectPages from "../data/caseStudyPages.json"

type Workspace = {
  professional: {
    value: EditableContent["professional"]
    version: string
  }
  notes: {
    value: EditableContent["notes"]
    version: string
  }
  milestones: {
    value: EditableContent["milestones"]
    version: string
  }
  reflections: {
    value: EditableContent["reflections"]
    version: string
  }
  token: string
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  hint?: string
}) {
  const id = useId()
  return (
    <div className="editor-field">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          rows={5}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {hint && <p className="editor-hint">{hint}</p>}
    </div>
  )
}

export default function ContentEditor() {
  const [workspace, setWorkspace] = useState<Workspace>()
  const [draft, setDraft] = useState<EditableContent>()
  const [kind, setKind] = useState<ContentKind>("notes")
  const [noteIndex, setNoteIndex] = useState(0)
  const [reflectionIndex, setReflectionIndex] = useState(0)
  const [projectId, setProjectId] = useState("dormfix")
  const [milestoneIndex, setMilestoneIndex] = useState(0)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const [recovery, setRecovery] = useState<Recovery>()
  const [recoveryRaw, setRecoveryRaw] = useState("")
  const [recoveryChecked, setRecoveryChecked] = useState(false)
  const [recoveryError, setRecoveryError] = useState("")
  const dirty = Boolean(
    draft &&
      workspace &&
      (JSON.stringify(draft.notes) !== JSON.stringify(workspace.notes.value) ||
        JSON.stringify(draft.milestones) !==
          JSON.stringify(workspace.milestones.value) ||
        JSON.stringify(draft.reflections) !==
          JSON.stringify(workspace.reflections.value) ||
        JSON.stringify(draft.professional) !==
          JSON.stringify(workspace.professional.value)),
  )
  const currentDirty = Boolean(
    draft &&
      workspace &&
      JSON.stringify(draft[kind]) !== JSON.stringify(workspace[kind].value),
  )
  const issue = useMemo(() => {
    if (!draft || !workspace) return ""
    try {
      validateEditableContent(kind, draft[kind], workspace[kind].value)
      return ""
    } catch (error) {
      return (error as Error).message
    }
  }, [draft, kind, workspace])

  async function load(discard = false) {
    setBusy(true)
    try {
      const response = await fetch("/api/content-editor", { cache: "no-store" })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setWorkspace(result)
      setNoteIndex(0)
      setReflectionIndex(0)
      setMilestoneIndex(0)
      setDraft({
        notes: result.notes.value,
        milestones: result.milestones.value,
        reflections: result.reflections.value,
        professional: result.professional.value,
      })
      setMessage("Loaded repository content.")
      if (discard) {
        localStorage.removeItem(recoveryKey)
        setRecovery(undefined)
        setRecoveryRaw("")
        setRecoveryError("")
      } else {
        try {
          const raw = localStorage.getItem(recoveryKey)
          setRecoveryRaw(raw ?? "")
          setRecovery(parseRecovery(raw, result.professional))
        } catch (error) {
          setRecoveryError((error as Error).message)
        }
      }
      setRecoveryChecked(true)
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setBusy(false)
    }
  }
  useEffect(() => {
    void load()
  }, [])
  useEffect(() => {
    if (
      !draft ||
      !workspace ||
      !recoveryChecked ||
      recovery ||
      recoveryRaw ||
      recoveryError
    )
      return
    try {
      if (dirty)
        localStorage.setItem(
          recoveryKey,
          JSON.stringify({
            schema: 1,
            savedAt: new Date().toISOString(),
            draft,
            versions: {
              notes: workspace.notes.version,
              milestones: workspace.milestones.version,
              reflections: workspace.reflections.version,
              professional: workspace.professional.version,
            },
          }),
        )
      else localStorage.removeItem(recoveryKey)
    } catch {
      setRecoveryError(
        "Automatic draft recovery is unavailable. Keep this page open or export your changes before leaving.",
      )
    }
  }, [
    draft,
    workspace,
    dirty,
    recoveryChecked,
    recovery,
    recoveryRaw,
    recoveryError,
  ])
  useEffect(() => {
    if (!dirty) return
    function warn(event: BeforeUnloadEvent) {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])

  async function save() {
    if (!draft || !workspace || issue || !currentDirty) return
    setBusy(true)
    try {
      const response = await fetch(`/api/content-editor/${kind}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Editor-Token": workspace.token,
        },
        body: JSON.stringify({
          value: draft[kind],
          version: workspace[kind].version,
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setWorkspace((previous) =>
        previous ? { ...previous, [kind]: result } : previous,
      )
      setMessage(
        "Saved in the repository. Preview the portfolio before publishing.",
      )
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setBusy(false)
    }
  }
  function editNote(field: string, value: unknown) {
    setDraft((previous) =>
      previous
        ? {
            ...previous,
            notes: previous.notes.map((note, index) =>
              index === noteIndex ? { ...note, [field]: value } : note,
            ),
          }
        : previous,
    )
    setMessage("")
  }
  function editMilestone(field: string, value: string) {
    setDraft((previous) =>
      previous
        ? {
            ...previous,
            milestones: {
              ...previous.milestones,
              [projectId]: previous.milestones[projectId].map(
                (milestone, index) =>
                  index === milestoneIndex
                    ? { ...milestone, [field]: value }
                    : milestone,
              ),
            },
          }
        : previous,
    )
    setMessage("")
  }
  const note = draft?.notes[noteIndex]
  const milestone = draft?.milestones[projectId]?.[milestoneIndex]
  const reflection = draft?.reflections[reflectionIndex]
  const conflicts =
    recovery && workspace ? recoveryConflicts(recovery, workspace) : []
  function exportDraft() {
    const blob = new Blob([recoveryRaw || JSON.stringify(draft, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "portfolio-draft-recovery.json"
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="content-workspace">
      <header>
        <p className="editor-eyebrow">
          JAMES IAN BAYONAS / LOCAL CONTENT WORKSPACE
        </p>
        <h1>
          Edit the explanation.
          <br />
          Keep the evidence.
        </h1>
        <p>
          Create Engineering Notes and maintain bilingual professional pages,
          reflections, and project milestones. Preview your changes, then save
          them in the repository for review.
        </p>
        <p className="editor-hint">
          Saving updates local content. Publishing follows the portfolio's
          release process. Published routes, section anchors, and reviewed
          commit references remain fixed. New drafts can have their own
          sections.
        </p>
      </header>
      <div className="editor-toolbar">
        <button
          disabled={
            busy || !currentDirty || Boolean(issue) || Boolean(recoveryRaw)
          }
          onClick={save}
        >
          Save {kind === "professional" ? "professional pages" : kind}
        </button>
        <button disabled={busy} onClick={() => void load(true)}>
          {dirty ? "Discard edits and reload" : "Reload from repository"}
        </button>
        <button disabled={!draft && !recoveryRaw} onClick={exportDraft}>
          Export drafts
        </button>
        <span>
          {busy ? "Working…" : dirty ? "Unsaved changes" : "No unsaved changes"}
        </span>
      </div>
      <p className="editor-status" role="status">
        {message}
      </p>
      {(recoveryRaw || recoveryError) && (
        <aside className="editor-error" aria-label="Draft recovery">
          <h2>Recover your previous edits</h2>
          <p>
            {recoveryError ||
              `A recovery copy was saved ${new Date(recovery!.savedAt).toLocaleString()}.`}
          </p>
          {conflicts.length > 0 && (
            <p>
              Repository content changed in {conflicts.join(", ")}. Export the
              recovery copy, reload the current content, and reapply your
              changes before saving.
            </p>
          )}
          <button
            disabled={!recovery || conflicts.length > 0}
            onClick={() => {
              setDraft(recovery!.draft)
              setRecovery(undefined)
              setRecoveryRaw("")
              setRecoveryError("")
              setMessage("Restored previous edits. Review them before saving.")
            }}
          >
            Restore drafts
          </button>
          <button onClick={exportDraft}>Export recovery copy</button>
          <button disabled={busy} onClick={() => void load(true)}>
            Discard recovery copy and reload
          </button>
        </aside>
      )}
      {issue && (
        <p className="editor-error" role="alert">
          {issue}
        </p>
      )}
      {!draft ? (
        <p>Use Reload from repository if the workspace did not load.</p>
      ) : (
        <>
          <nav className="editor-tabs" aria-label="Content collections">
            <button
              disabled={busy}
              aria-pressed={kind === "professional"}
              onClick={() => setKind("professional")}
            >
              Professional pages · English / Filipino
            </button>
            <button
              disabled={busy}
              aria-pressed={kind === "notes"}
              onClick={() => setKind("notes")}
            >
              Engineering Notes
            </button>
            <button
              disabled={busy}
              aria-pressed={kind === "milestones"}
              onClick={() => setKind("milestones")}
            >
              Project milestones
            </button>
            <button
              disabled={busy}
              aria-pressed={kind === "reflections"}
              onClick={() => setKind("reflections")}
            >
              Reflections · English / Filipino
            </button>
          </nav>
          <fieldset disabled={busy || Boolean(recoveryRaw)}>
            <legend className="editor-sr-only">Edit {kind}</legend>
            {kind === "notes" ? (
              <>
                <label htmlFor="choose-note">Choose a note</label>
                <select
                  id="choose-note"
                  value={noteIndex}
                  onChange={(event) => setNoteIndex(Number(event.target.value))}
                >
                  {draft.notes.map((item, index) => (
                    <option key={item.id} value={index}>
                      {item.title || `Untitled draft (${item.id})`}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    let id = "new-note"
                    let suffix = 2
                    while (draft.notes.some((item) => item.id === id))
                      id = `new-note-${suffix++}`
                    setNoteIndex(draft.notes.length)
                    setDraft({
                      ...draft,
                      notes: [
                        ...draft.notes,
                        createNoteDraft(id, projectPages[0].projectId),
                      ],
                    })
                  }}
                >
                  Create a note
                </button>
              </>
            ) : kind === "reflections" ? (
              <>
                <label htmlFor="choose-reflection">Choose a reflection</label>
                <select
                  id="choose-reflection"
                  value={reflectionIndex}
                  onChange={(event) =>
                    setReflectionIndex(Number(event.target.value))
                  }
                >
                  {draft.reflections.map((item, index) => (
                    <option key={item.id} value={index}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </>
            ) : kind === "professional" ? (
              <p className="editor-hint">
                Maintain both languages together. Page addresses, shared
                identity, and project links are protected.
              </p>
            ) : (
              <div className="editor-selection">
                <div>
                  <label htmlFor="choose-project">Choose a project</label>
                  <select
                    id="choose-project"
                    value={projectId}
                    onChange={(event) => {
                      setProjectId(event.target.value)
                      setMilestoneIndex(0)
                    }}
                  >
                    {Object.keys(draft.milestones).map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="choose-milestone">Choose a milestone</label>
                  <select
                    id="choose-milestone"
                    value={milestoneIndex}
                    onChange={(event) =>
                      setMilestoneIndex(Number(event.target.value))
                    }
                  >
                    {draft.milestones[projectId].map((item, index) => (
                      <option key={item.id} value={index}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div
              className={
                kind === "reflections" || kind === "professional"
                  ? "editor-reflections-layout"
                  : "editor-layout"
              }
            >
              <section aria-label="Content fields">
                {kind === "professional" && (
                  <ProfessionalEditor
                    content={draft.professional}
                    change={(professional) => {
                      setDraft({ ...draft, professional })
                      setMessage("")
                    }}
                  />
                )}
                {kind === "reflections" && reflection && (
                  <ReflectionEditor
                    reflection={reflection}
                    change={(value) => {
                      setDraft((previous) =>
                        previous
                          ? {
                              ...previous,
                              reflections: previous.reflections.map(
                                (item, index) =>
                                  index === reflectionIndex ? value : item,
                              ),
                            }
                          : previous,
                      )
                      setMessage("")
                    }}
                  />
                )}
                {kind === "notes" && note && (
                  <>
                    <p className="editor-hint">
                      Project: {note.projectId} · Route: {note.path}
                    </p>
                    {note.status === "draft" && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setDraft({
                              ...draft,
                              notes: draft.notes.filter(
                                (_, index) => index !== noteIndex,
                              ),
                            })
                            setNoteIndex(0)
                            setMessage(
                              "Draft removed from the workspace. Save notes to update the repository.",
                            )
                          }}
                        >
                          Remove this draft
                        </button>
                        <Field
                          label="Article slug"
                          value={note.id}
                          hint="This becomes the permanent article URL when published."
                          onChange={(id) => {
                            setDraft({
                              ...draft,
                              notes: draft.notes.map((item, index) =>
                                index === noteIndex
                                  ? { ...item, id, path: `/notes/${id}/` }
                                  : item,
                              ),
                            })
                          }}
                        />
                        <label htmlFor="note-project">Project</label>
                        <select
                          id="note-project"
                          value={note.projectId}
                          onChange={(event) =>
                            editNote("projectId", event.target.value)
                          }
                        >
                          {projectPages.map((page) => (
                            <option key={page.projectId} value={page.projectId}>
                              {page.projectId}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                    <p className="editor-hint">
                      Status: {note.status ?? "published"}. Publishing is
                      included in the next repository release.
                    </p>
                    {(workspace?.notes.value.find((item) => item.id === note.id)
                      ?.status === "draft" ||
                      !workspace?.notes.value.some(
                        (item) => item.id === note.id,
                      )) && (
                      <button
                        type="button"
                        onClick={() =>
                          editNote(
                            "status",
                            note.status === "draft" ? "published" : "draft",
                          )
                        }
                      >
                        {note.status === "draft"
                          ? "Mark for publication"
                          : "Keep as draft"}
                      </button>
                    )}
                    <Field
                      label="Title"
                      value={note.title}
                      onChange={(value) => editNote("title", value)}
                    />
                    <Field
                      label="Summary"
                      value={note.summary}
                      onChange={(value) => editNote("summary", value)}
                      multiline
                    />
                    <Field
                      label="Topic"
                      value={note.topic}
                      onChange={(value) => editNote("topic", value)}
                    />
                    <Field
                      label="Workflow steps"
                      value={note.flow.join("\n")}
                      onChange={(value) => editNote("flow", value.split("\n"))}
                      multiline
                      hint="One step per line."
                    />
                    <Field
                      label="Workflow explanation"
                      value={note.flowCaption}
                      onChange={(value) => editNote("flowCaption", value)}
                      multiline
                    />
                    <Field
                      label="Demo link label"
                      value={note.demoLabel}
                      onChange={(value) => editNote("demoLabel", value)}
                    />
                    <Field
                      label="Source context and limits"
                      value={note.sourceContext}
                      onChange={(value) => editNote("sourceContext", value)}
                      multiline
                    />
                    {note.sections.map((section, index) => (
                      <div className="editor-section" key={section.id}>
                        <h2>Section {index + 1}</h2>
                        {note.status === "draft" && (
                          <>
                            <Field
                              label={`Section ${index + 1} anchor`}
                              value={section.id}
                              onChange={(id) =>
                                editNote(
                                  "sections",
                                  note.sections.map((item, i) =>
                                    i === index ? { ...item, id } : item,
                                  ),
                                )
                              }
                            />
                            <button
                              type="button"
                              disabled={note.sections.length === 1}
                              onClick={() =>
                                editNote(
                                  "sections",
                                  note.sections.filter((_, i) => i !== index),
                                )
                              }
                            >
                              Remove section {index + 1}
                            </button>
                          </>
                        )}
                        <Field
                          label={`Section ${index + 1} title`}
                          value={section.title}
                          onChange={(value) =>
                            editNote(
                              "sections",
                              note.sections.map((item, i) =>
                                i === index ? { ...item, title: value } : item,
                              ),
                            )
                          }
                        />
                        <Field
                          label={`Section ${index + 1} paragraphs`}
                          value={section.paragraphs.join("\n\n")}
                          onChange={(value) =>
                            editNote(
                              "sections",
                              note.sections.map((item, i) =>
                                i === index
                                  ? { ...item, paragraphs: value.split("\n\n") }
                                  : item,
                              ),
                            )
                          }
                          multiline
                          hint="Separate paragraphs with a blank line."
                        />
                      </div>
                    ))}
                    {note.status === "draft" && (
                      <button
                        type="button"
                        onClick={() => {
                          let id = `section-${note.sections.length + 1}`
                          while (
                            note.sections.some((section) => section.id === id)
                          )
                            id += "-new"
                          editNote("sections", [
                            ...note.sections,
                            { id, title: "", paragraphs: [""] },
                          ])
                        }}
                      >
                        Add a section
                      </button>
                    )}
                  </>
                )}
                {kind === "milestones" && milestone && (
                  <>
                    <p className="editor-hint">
                      Reviewed commit: {milestone.commit}
                      <br />
                      Committed: {milestone.committedAt}
                    </p>
                    <Field
                      label="Milestone title"
                      value={milestone.title}
                      onChange={(value) => editMilestone("title", value)}
                    />
                    <Field
                      label="What changed"
                      value={milestone.change}
                      onChange={(value) => editMilestone("change", value)}
                      multiline
                    />
                    <Field
                      label="Design context"
                      value={milestone.reason}
                      onChange={(value) => editMilestone("reason", value)}
                      multiline
                    />
                    <Field
                      label="Outcome and trade-off"
                      value={milestone.outcome}
                      onChange={(value) => editMilestone("outcome", value)}
                      multiline
                    />
                  </>
                )}
              </section>
              <section
                hidden={kind === "reflections" || kind === "professional"}
                className="editor-preview"
                aria-labelledby="draft-preview-title"
              >
                <p className="editor-eyebrow">DRAFT PREVIEW</p>
                <h2 id="draft-preview-title">
                  {kind === "notes"
                    ? note?.title || "Untitled draft"
                    : milestone?.title}
                </h2>
                <a
                  href={
                    kind === "notes"
                      ? `/editor/?preview=${encodeURIComponent(note?.id ?? "")}`
                      : `/projects/${projectId}/#${projectId}-evolution`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open saved content in the local portfolio ↗
                </a>
                {kind === "notes" && note && (
                  <>
                    <p>{note.summary}</p>
                    <p className="editor-hint">{note.topic}</p>
                    <ol>
                      {note.flow.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                    <p>{note.flowCaption}</p>
                    {note.sections.map((section) => (
                      <section key={section.id}>
                        <h3>{section.title || "Untitled section"}</h3>
                        {section.paragraphs.map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </section>
                    ))}
                    <h3>Project context</h3>
                    <p>{note.sourceContext}</p>
                  </>
                )}
                {kind === "milestones" && milestone && (
                  <>
                    <h3>What changed</h3>
                    <p>{milestone.change}</p>
                    <h3>Design context</h3>
                    <p>{milestone.reason}</p>
                    <h3>Outcome and trade-off</h3>
                    <p>{milestone.outcome}</p>
                    <h3>Reviewed evidence</h3>
                    <ul>
                      {milestone.evidencePaths.map((reference) => (
                        <li key={reference}>{reference}</li>
                      ))}
                    </ul>
                  </>
                )}
              </section>
            </div>
          </fieldset>
        </>
      )}
    </main>
  )
}
