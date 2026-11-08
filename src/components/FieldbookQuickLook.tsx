import { useEffect, useId, useRef } from "react"
import { fieldbookEntries, type FieldbookEntry } from "../data/fieldbook"
import { cardAccentStyles } from "../lib/projectCardAccents"
import ResponsiveScreenshot from "./ResponsiveScreenshot"
import "./FieldbookQuickLook.css"

export default function FieldbookQuickLook({ entry, onClose }: { entry: FieldbookEntry; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const related = fieldbookEntries
    .filter(item => item.id !== entry.id)
    .map(item => ({ item, score: (entry.projectId && item.projectId === entry.projectId ? 10 : 0) + item.tags.filter(tag => entry.tags.some(current => current.toLowerCase() === tag.toLowerCase())).length }))
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

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

  return (
    <dialog ref={dialogRef} className="fieldbook-quicklook" aria-labelledby={titleId} aria-describedby={descriptionId}
      style={entry.projectId ? cardAccentStyles[entry.projectId] : undefined}
      onKeyDown={event => {
        if (event.key !== "Tab") return
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]'))
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }}
      onCancel={event => { event.preventDefault(); onClose() }}
      onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose() } }}>
      <header className="quicklook-bar"><span>FIELDBOOK / QUICK LOOK</span><button type="button" onClick={onClose} autoFocus aria-label="Close quick look">Close ×</button></header>
      <div className="quicklook-content">
        <p className="quicklook-meta">{entry.kind} <span> / {entry.detail}</span></p>
        <h2 id={titleId}>{entry.title}</h2>
        <p id={descriptionId} className="quicklook-summary">{entry.summary}</p>
        {entry.image && <figure><ResponsiveScreenshot asset={entry.image} alt={entry.imageAlt ?? `${entry.title} interface`} sizes="(min-width: 900px) 740px, calc(100vw - 64px)" loading="eager" /><figcaption>Project capture / {entry.title}</figcaption></figure>}
        {entry.preview?.map(section => <section className="quicklook-section" key={section.heading}><h3>{section.heading}</h3><p>{section.body}</p></section>)}
        <ul className="quicklook-tags" aria-label="Topics and technologies">{entry.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
        <a className="quicklook-primary" href={entry.href}>{entry.kind === "Systems" ? "Explore the full project" : entry.kind === "Notes" || entry.kind === "Reflections" ? "Continue reading" : "Open the interactive tool"}<span aria-hidden="true">↗</span></a>
        {related.length > 0 && <nav className="quicklook-related" aria-label="Related fieldbook entries"><h3>Follow the connection.</h3>{related.map(({item}) => <a key={item.id} href={item.href}><span>{item.kind}</span><strong>{item.title}</strong><span aria-hidden="true">↗</span></a>)}</nav>}
      </div>
    </dialog>
  )
}
