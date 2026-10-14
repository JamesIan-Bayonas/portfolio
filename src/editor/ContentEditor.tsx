import { useEffect, useId, useMemo, useState } from "react"
import { validateEditableContent } from "../lib/contentEditing"
import type { ContentKind, EditableContent } from "../lib/contentEditing"

type Workspace = {
  notes: {
    value: EditableContent["notes"]
    version: string
  }
  milestones: {
    value: EditableContent["milestones"]
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
  const [projectId, setProjectId] = useState("dormfix")
  const [milestoneIndex, setMilestoneIndex] = useState(0)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const dirty = Boolean(
    draft &&
      workspace &&
      (JSON.stringify(draft.notes) !== JSON.stringify(workspace.notes.value) ||
        JSON.stringify(draft.milestones) !==
          JSON.stringify(workspace.milestones.value)),
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

  async function load() {
    setBusy(true)
    try {
      const response = await fetch("/api/content-editor", { cache: "no-store" })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setWorkspace(result)
      setDraft({
        notes: result.notes.value,
        milestones: result.milestones.value,
      })
      setMessage("Loaded repository content.")
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
          Maintain the existing notes and project milestones. Preview your
          changes, then save them in the repository for review.
        </p>
        <p className="editor-hint">
          Saving updates local content. Publishing follows the portfolio's
          release process. Routes, section anchors, and reviewed commit
          references remain fixed here.
        </p>
      </header>
      <div className="editor-toolbar">
        <button
          disabled={busy || !currentDirty || Boolean(issue)}
          onClick={save}
        >
          Save {kind === "notes" ? "notes" : "milestones"}
        </button>
        <button disabled={busy} onClick={load}>
          {dirty ? "Discard edits and reload" : "Reload from repository"}
        </button>
        <span>
          {busy ? "Working…" : dirty ? "Unsaved changes" : "No unsaved changes"}
        </span>
      </div>
      <p className="editor-status" role="status">
        {message}
      </p>
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
          </nav>
          <fieldset disabled={busy}>
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
                      {item.title}
                    </option>
                  ))}
                </select>
              </>
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
            <div className="editor-layout">
              <section aria-label="Content fields">
                {kind === "notes" && note && (
                  <>
                    <p className="editor-hint">
                      Project: {note.projectId} · Route: {note.path}
                    </p>
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
                className="editor-preview"
                aria-labelledby="draft-preview-title"
              >
                <p className="editor-eyebrow">DRAFT PREVIEW</p>
                <h2 id="draft-preview-title">
                  {kind === "notes" ? note?.title : milestone?.title}
                </h2>
                <a
                  href={
                    kind === "notes"
                      ? note?.path
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
                        <h3>{section.title}</h3>
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
