import { useEffect, useRef, useState } from "react"

export interface GalleryScreenshot {
  id: string
  src: string
  width: number
  height: number
  alt: string
  title: string
  caption: string
}

interface ScreenshotViewerProps {
  images: GalleryScreenshot[]
  initialIndex: number
  onClose: () => void
}

export default function ScreenshotViewer({ images, initialIndex, onClose }: ScreenshotViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [stage, setStage] = useState({ width: 0, height: 0 })
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const image = images[index]
  const fit = Math.min(stage.width / image.width, stage.height / image.height, 1)
  const width = Math.max(1, image.width * fit * zoom)
  const height = Math.max(1, image.height * fit * zoom)

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
    const element = stageRef.current!
    const observer = new ResizeObserver(() => setStage({ width: element.clientWidth, height: element.clientHeight }))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  function select(next: number) {
    setIndex((next + images.length) % images.length)
    setZoom(1)
    setLoaded(false)
    setFailed(false)
    stageRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }

  return (
    <dialog
      ref={dialogRef}
      className="screenshot-viewer"
      aria-labelledby="screenshot-viewer-title"
      aria-describedby="screenshot-viewer-caption"
      onCancel={event => { event.preventDefault(); onClose() }}
      onClick={event => { if (event.target === event.currentTarget) onClose() }}
      onKeyDown={event => {
        if (event.key === "Tab") {
          const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]'))
          const first = controls[0]
          const last = controls[controls.length - 1]
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
          if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
          return
        }
        if (event.altKey || event.ctrlKey || event.metaKey) return
        if (event.key === "ArrowRight" && images.length > 1) { event.preventDefault(); select(index + 1) }
        if (event.key === "ArrowLeft" && images.length > 1) { event.preventDefault(); select(index - 1) }
        if (event.key === "+" || event.key === "=") { event.preventDefault(); setZoom(value => Math.min(3, value + 0.5)) }
        if (event.key === "-") { event.preventDefault(); setZoom(value => Math.max(1, value - 0.5)) }
        if (event.key === "0") { event.preventDefault(); setZoom(1) }
      }}
    >
      <header className="screenshot-viewer-header">
        <div>
          <p className="project-eyebrow font-mono">SCREENSHOT {index + 1} / {images.length}</p>
          <h2 id="screenshot-viewer-title">{image.title}</h2>
        </div>
        <button type="button" onClick={onClose} autoFocus aria-label="Close screenshot viewer">Close ×</button>
      </header>
      <div className="screenshot-viewer-toolbar" aria-label="Screenshot controls">
        <button type="button" onClick={() => select(index - 1)} disabled={images.length < 2} aria-label="Previous screenshot">← Previous</button>
        <button type="button" onClick={() => select(index + 1)} disabled={images.length < 2} aria-label="Next screenshot">Next →</button>
        <button type="button" onClick={() => setZoom(value => Math.max(1, value - 0.5))} disabled={zoom === 1} aria-label="Zoom out">−</button>
        <button type="button" onClick={() => setZoom(value => Math.min(3, value + 0.5))} disabled={zoom === 3} aria-label="Zoom in">+</button>
        <button type="button" onClick={() => setZoom(1)} aria-label="Fit screenshot to viewer">Fit</button>
        <span className="font-mono" role="status">{Math.round(zoom * 100)}% of fit</span>
        <a href={image.src} target="_blank" rel="noopener noreferrer">Open original ↗</a>
      </div>
      <div ref={stageRef} className="screenshot-viewer-stage" tabIndex={0} aria-label="Screenshot image; scroll to inspect when zoomed">
        <div className="screenshot-viewer-canvas" style={{ width: Math.max(stage.width, width), height: Math.max(stage.height, height) }}>
          <img
            key={image.id}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            style={{ width, height, visibility: loaded ? "visible" : "hidden" }}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        </div>
        {!loaded && <p className="screenshot-viewer-loading" role="status">{failed ? "The screenshot could not load. You can open the original or try another image." : "Loading the original screenshot…"}</p>}
      </div>
      <footer className="screenshot-viewer-footer">
        <p id="screenshot-viewer-caption" aria-live="polite">{image.caption}</p>
        <p className="font-mono">← → Browse · + − Zoom · 0 Fit · Esc Close</p>
      </footer>
    </dialog>
  )
}
