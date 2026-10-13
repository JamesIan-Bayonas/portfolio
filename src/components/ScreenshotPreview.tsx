import { lazy, Suspense, useState, type ReactNode } from "react"
import type { GalleryScreenshot } from "./ScreenshotViewer"
import LoadingState from "./LoadingState"

const ScreenshotViewer = lazy(() => import("./ScreenshotViewer"))

interface ScreenshotPreviewProps {
  images: GalleryScreenshot[]
  selectedId: string
  label: string
  className?: string
  children: ReactNode
}

export default function ScreenshotPreview({ images, selectedId, label, className = "", children }: ScreenshotPreviewProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" className={`screenshot-preview ${className}`} onClick={() => setOpen(true)} aria-label={label} aria-haspopup="dialog">
        {children}
        <span className="screenshot-preview-hint font-mono" aria-hidden="true">Inspect screenshot ↗</span>
      </button>
      {open && <Suspense fallback={<LoadingState label="Opening screenshot viewer…" variant="compact" />}>
        <ScreenshotViewer images={images} initialIndex={Math.max(0, images.findIndex(image => image.id === selectedId))} onClose={() => setOpen(false)} />
      </Suspense>}
    </>
  )
}
