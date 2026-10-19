import { portfolioMotionQuery } from "../lib/motionPreference"
import { useEffect, useRef } from "react"
import "./DecodeText.css"

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#<>"

interface DecodeTextProps {
  text: string
}

export default function DecodeText({ text }: DecodeTextProps) {
  const root = useRef<HTMLSpanElement>(null)
  const visual = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = root.current
    const label = visual.current
    if (!element || !label) return
    const media = portfolioMotionQuery()
    const characters = Array.from(text)
    let frame = 0
    let started = false
    let start = 0
    let lastPaint = 0
    function finish() {
      cancelAnimationFrame(frame)
      frame = 0
      label!.textContent = text
      element!.dataset.decoding = "false"
    }
    function tick(now: number) {
      frame = 0
      const progress = Math.min(1, (now - start) / 620)
      if (progress >= 1 || media.matches || document.hidden) {
        finish()
        return
      }
      if (now - lastPaint >= 50) {
        lastPaint = now
        const resolved = Math.floor(progress * characters.length)
        label!.textContent = characters
          .map((character, index) =>
            index < resolved || /\s|[.,!?–—·]/.test(character)
              ? character
              : glyphs[Math.floor(Math.random() * glyphs.length)],
          )
          .join("")
      }
      frame = requestAnimationFrame(tick)
    }
    function settle() {
      if (media.matches || document.hidden) finish()
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          finish()
          return
        }
        if (started) return
        started = true
        if (media.matches || document.hidden) return
        start = performance.now()
        lastPaint = 0
        element.dataset.decoding = "true"
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    finish()
    observer.observe(element)
    media.addEventListener("change", settle)
    document.addEventListener("visibilitychange", settle)
    return () => {
      finish()
      observer.disconnect()
      media.removeEventListener("change", settle)
      document.removeEventListener("visibilitychange", settle)
    }
  }, [text])

  return (
    <span ref={root} className="decode-text">
      <span className="decode-text-layout" aria-hidden="true">
        {text}
      </span>
      <span ref={visual} className="decode-text-visual" aria-hidden="true">
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  )
}
