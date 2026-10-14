import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { projects } from "../data/projects"
import { contactEmail, inquiryKinds, prepareInquiry, type InquiryKind } from "../lib/contact"
import { currentLocale } from "../lib/locale"

interface ContactPanelProps {
  projectId?: string
  onClose: () => void
}

export default function ContactPanel({ projectId, onClose }: ContactPanelProps) {
  const fil = currentLocale() === "fil"
  const t = (english: string, filipino: string) => fil ? filipino : english
  const filipinoKinds: Record<string,string> = {build:"Bumuo ng system",improve:"Pagbutihin ang umiiral na system",opportunity:"Pag-usapan ang oportunidad"}
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
      setStatus(t("Message copied. Paste it into an email to James when you are ready.", "Nakopya ang mensahe. Ilagay ito sa email para kay James kapag handa ka na."))
      setManualCopy(false)
    } catch {
      setReviewOpen(true)
      setManualCopy(true)
      setStatus(t("Automatic copying is unavailable. The prepared message is selected below; use your device's Copy command.", "Hindi magamit ang awtomatikong pagkopya. Napili ang mensahe sa ibaba; gamitin ang Copy command ng iyong device."))
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
      <div><p className="project-eyebrow font-mono">{t("LET'S TALK ABOUT YOUR SYSTEM", "PAG-USAPAN ANG IYONG SYSTEM")}</p><h2 id="contact-panel-title">{t("Start a conversation.", "Magsimula ng pag-uusap.")}</h2></div>
      <button type="button" autoFocus onClick={onClose} aria-label={t("Close contact panel", "Isara ang contact panel")}>{t("Close", "Isara")} ×</button>
    </header>
    <div className="contact-panel-body">
      <p id="contact-panel-intro">{t("Describe what you have in mind. Review the prepared email, then open it in your email app or copy the message.", "Ilarawan ang iyong layunin. Suriin ang email draft, pagkatapos ay buksan ito sa email app o kopyahin ang mensahe. Nasa English ang mga pananda ng email draft.")}</p>
      <p className="contact-panel-recipient font-mono">{t("To", "Para kay")}: {contactEmail}</p>
      <form onSubmit={event => {
        event.preventDefault()
        if (!draft) return
        setStatus(t("Review and send the draft in your email app. If no app opens, use Copy message.", "Suriin at ipadala ang draft sa email app. Kung walang bumukas na app, gamitin ang Kopyahin ang mensahe."))
        window.location.assign(draft.mailto)
      }}>
        <label htmlFor="inquiry-project">{t("Project reference", "Kaugnay na proyekto")}</label>
        <select id="inquiry-project" value={selectedProject} onChange={event => { setSelectedProject(event.target.value); clearFeedback() }}>
          <option value="">{t("General inquiry", "Pangkalahatang tanong")}</option>
          {projects.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <label htmlFor="inquiry-kind">{t("What would you like to discuss?", "Ano ang nais mong pag-usapan?")}</label>
        <select id="inquiry-kind" value={kind} onChange={event => { setKind(event.target.value as InquiryKind); clearFeedback() }}>
          {Object.entries(inquiryKinds).map(([value, label]) => <option key={value} value={value}>{fil ? filipinoKinds[value] : label}</option>)}
        </select>
        <label htmlFor="inquiry-description">{t("A short description", "Maikling paglalarawan")} <span>({t("required", "kailangan")})</span></label>
        <textarea id="inquiry-description" rows={4} required maxLength={1000} value={description} aria-describedby="inquiry-description-help" placeholder={t("What does your system need to do, or what opportunity would you like to discuss?", "Ano ang kailangang gawin ng system, o anong oportunidad ang gusto mong pag-usapan?")} onChange={event => { setDescription(event.target.value); clearFeedback() }} />
        <p id="inquiry-description-help" className="contact-panel-help">{description.length}/1000 {t("characters. Your draft stays here until you open or copy it. Closing this panel clears it.", "karakter. Nananatili rito ang draft hanggang buksan o kopyahin mo ito. Mabubura ito kapag isinara ang panel.")}</p>
        <details open={reviewOpen} onToggle={event => setReviewOpen(event.currentTarget.open)} className="contact-draft-review">
          <summary>{t("Review prepared email", "Suriin ang email draft (English)")}</summary>
          {draft ? <>
            <textarea ref={draftRef} aria-label={t("Prepared email message", "Nakahandang mensahe ng email")} lang="en" rows={8} readOnly value={draft.copyText} />
            <button type="button" onClick={() => { draftRef.current?.focus(); draftRef.current?.select(); setStatus(t("Prepared message selected. Use your device's Copy command, then paste it into an email.", "Napili ang mensahe. Gamitin ang Copy command ng iyong device at ilagay ito sa email.")) }}>{t("Select message for manual copying", "Piliin ang mensahe para makopya")}</button>
          </> : <p>{t("Add a short description to prepare your email.", "Magdagdag ng maikling paglalarawan upang maihanda ang email.")}</p>}
        </details>
        <div className="contact-panel-actions">
          <button type="submit" disabled={!draft}>{t("Open email draft", "Buksan ang email draft")} ↗</button>
          <button type="button" disabled={!draft} onClick={copyMessage}>{t("Copy message", "Kopyahin ang mensahe")}</button>
        </div>
        <p className="contact-panel-status" role="status">{status}</p>
        <p className="contact-panel-help">{t("You review and send the email yourself. This panel does not submit a message.", "Ikaw ang susuri at magpapadala ng email. Walang ipinapadalang mensahe ang panel na ito.")}</p>
      </form>
    </div>
  </dialog>, document.body)
}
