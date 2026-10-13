import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { projects } from "../data/projects"
import { contactEmail, inquiryKinds, prepareInquiry, type InquiryKind } from "../lib/contact"

interface ContactPanelProps {
  projectId?: string
  onClose: () => void
}

export default function ContactPanel({ projectId, onClose }: ContactPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const draftRef = useRef<HTMLTextAreaElement>(null)
  const [selectedProject, setSelectedProject] = useState(projectId ?? "")
  const [kind, setKind] = useState<InquiryKind>("build")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("")
  const [reviewOpen, setReviewOpen] = useState(false)
  const [manualCopy, setManualCopy] = useState(false)
  const project = projects.find(item => item.id === selectedProject)
  const draft = description.trim() ? prepareInquiry(kind, project, description) : null

  useEffect(() => {
    const dialog = dialogRef.current!
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = "hidden"
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    if (!manualCopy) return
    draftRef.current?.focus()
    draftRef.current?.select()
  }, [manualCopy])

  function clearFeedback() { setStatus(""); setManualCopy(false) }
  async function copyMessage() {
    if (!draft) return
    try {
      await navigator.clipboard.writeText(draft.copyText)
      setStatus("Message copied. Paste it into an email to James when you are ready.")
      setManualCopy(false)
    } catch {
      setReviewOpen(true)
      setManualCopy(true)
      setStatus("Automatic copying is unavailable. The prepared message is selected below; use your device's Copy command.")
    }
  }

  return createPortal(<dialog
    ref={dialogRef}
    className="contact-panel"
    aria-labelledby="contact-panel-title"
    aria-describedby="contact-panel-intro"
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => { if (event.target === event.currentTarget) onClose() }}
    onKeyDown={event => {
      if (event.key !== "Tab") return
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), select, textarea, summary')).filter(element => element.getClientRects().length > 0)
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }}
  >
    <header className="contact-panel-heading">
      <div><p className="project-eyebrow font-mono">LET'S TALK ABOUT YOUR SYSTEM</p><h2 id="contact-panel-title">Start a conversation.</h2></div>
      <button type="button" autoFocus onClick={onClose} aria-label="Close contact panel">Close ×</button>
    </header>
    <div className="contact-panel-body">
      <p id="contact-panel-intro">Describe what you have in mind. Review the prepared email, then open it in your email app or copy the message.</p>
      <p className="contact-panel-recipient font-mono">To: {contactEmail}</p>
      <form onSubmit={event => {
        event.preventDefault()
        if (!draft) return
        setStatus("Review and send the draft in your email app. If no app opens, use Copy message.")
        window.location.assign(draft.mailto)
      }}>
        <label htmlFor="inquiry-project">Project reference</label>
        <select id="inquiry-project" value={selectedProject} onChange={event => { setSelectedProject(event.target.value); clearFeedback() }}>
          <option value="">General inquiry</option>
          {projects.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <label htmlFor="inquiry-kind">What would you like to discuss?</label>
        <select id="inquiry-kind" value={kind} onChange={event => { setKind(event.target.value as InquiryKind); clearFeedback() }}>
          {Object.entries(inquiryKinds).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <label htmlFor="inquiry-description">A short description <span>(required)</span></label>
        <textarea id="inquiry-description" rows={4} required maxLength={1000} value={description} aria-describedby="inquiry-description-help" placeholder="What does your system need to do, or what opportunity would you like to discuss?" onChange={event => { setDescription(event.target.value); clearFeedback() }} />
        <p id="inquiry-description-help" className="contact-panel-help">{description.length}/1000 characters. Your draft stays here until you open or copy it. Closing this panel clears it.</p>
        <details open={reviewOpen} onToggle={event => setReviewOpen(event.currentTarget.open)} className="contact-draft-review">
          <summary>Review prepared email</summary>
          {draft ? <>
            <textarea ref={draftRef} aria-label="Prepared email message" rows={8} readOnly value={draft.copyText} />
            <button type="button" onClick={() => { draftRef.current?.focus(); draftRef.current?.select(); setStatus("Prepared message selected. Use your device's Copy command, then paste it into an email.") }}>Select message for manual copying</button>
          </> : <p>Add a short description to prepare your email.</p>}
        </details>
        <div className="contact-panel-actions">
          <button type="submit" disabled={!draft}>Open email draft ↗</button>
          <button type="button" disabled={!draft} onClick={copyMessage}>Copy message</button>
        </div>
        <p className="contact-panel-status" role="status">{status}</p>
        <p className="contact-panel-help">You review and send the email yourself. This panel does not submit a message.</p>
      </form>
    </div>
  </dialog>, document.body)
}
