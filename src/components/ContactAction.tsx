import { lazy, Suspense, useState } from "react"
import LoadingState from "./LoadingState"
import { currentLocale } from "../lib/locale"

const ContactPanel = lazy(() => import("./ContactPanel"))

interface ContactActionProps {
  projectId?: string
  label?: string
  className?: string
}

export default function ContactAction({ projectId, label = "Discuss a similar system", className = "case-study-contact font-mono" }: ContactActionProps) {
  const [open, setOpen] = useState(false)
  return <>
    <button type="button" className={className} aria-haspopup="dialog" onClick={() => setOpen(true)}>
      {label} <span aria-hidden="true">↗</span>
    </button>
    {open && <Suspense fallback={<LoadingState label={currentLocale() === "fil" ? "Binubuksan ang contact panel…" : "Opening contact panel…"} variant="compact" />}>
      <ContactPanel projectId={projectId} onClose={() => setOpen(false)} />
    </Suspense>}
  </>
}
