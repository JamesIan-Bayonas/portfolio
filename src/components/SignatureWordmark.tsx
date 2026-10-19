import { portfolioMotionQuery } from "../lib/motionPreference"
import { useEffect, useId, useRef, useState } from "react"
import "./SignatureWordmark.css"

// Start with readable code; the visible animation gradually scrambles small patches.
const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]<>/\\:;=+-_*&#@$%"
const codeLines = [
  "const developer = 'James Ian'; // build with purpose; <workflow />",
  "React<TypeScript> :: Laravel -> ASP.NET Core :: { systems: true }",
  "[IsdaLog, DormFix, CentraLog, PharmaLink].map(project => build(project));",
  "git diff + architecture / data / interfaces; if (idea) { create(); }",
  "export { curiosity, craft, iteration }; // learn -> build -> refine",
  "01001010 :: API<T> => Promise<System>; SELECT evidence FROM projects;",
]

export default function SignatureWordmark() {
  const id = useId().replace(/:/g, "")
  const host = useRef<HTMLDivElement>(null)
  const light = useRef<SVGRadialGradientElement>(null)
  const texture = useRef<SVGPatternElement>(null)
  const elapsed = useRef(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(
    () => portfolioMotionQuery().matches,
  )

  useEffect(() => {
    const media = portfolioMotionQuery()
    const update = () => setReduced(media.matches)
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const element = host.current
    if (!element) return
    const pointerMedia = window.matchMedia("(hover: hover) and (pointer: fine)")
    let frame = 0
    let previous = 0
    let visible = false
    let nextScramble = elapsed.current + .1
    const rows = [...(texture.current?.querySelectorAll("text") ?? [])]
    let pointer: { x: number; y: number } | null = null
    function paint(x = 700, y = 150) {
      light.current?.setAttribute("cx", String(x))
      light.current?.setAttribute("cy", String(y))
    }
    function stop() {
      cancelAnimationFrame(frame)
      frame = 0
    }
    function schedule() {
      if (!frame && visible && !document.hidden && !paused && !reduced)
        frame = requestAnimationFrame(tick)
    }
    function tick(now: number) {
      frame = 0
      if (now - previous >= 40) {
        elapsed.current += Math.min(now - previous, 64) / 1000
        previous = now
        const time = elapsed.current
        paint(
          pointer?.x ?? 700 + Math.sin(time * 0.45) * 650,
          pointer?.y ?? 150 + Math.cos(time * 0.6) * 35,
        )
        if (time >= nextScramble) {
          nextScramble = time + .1
          for (const row of rows) {
            if (Math.random() > .55) continue
            row.textContent = (row.textContent ?? "").replace(/\S/g, character =>
              Math.random() < .08 ? glyphs[Math.floor(Math.random() * glyphs.length)] : character,
            )
          }
        }
      }
      schedule()
    }
    function visibility() {
      stop()
      previous = performance.now()
      schedule()
    }
    function move(event: PointerEvent) {
      if (
        paused ||
        reduced ||
        !pointerMedia.matches ||
        event.pointerType !== "mouse"
      )
        return
      const rect = element!.getBoundingClientRect()
      pointer = {
        x: ((event.clientX - rect.left) / rect.width) * 1400,
        y: ((event.clientY - rect.top) / rect.height) * 300,
      }
    }
    function leave() {
      pointer = null
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      element!.dataset.animating = String(
        visible && !document.hidden && !paused && !reduced,
      )
      visibility()
    })
    function changedVisibility() {
      element!.dataset.animating = String(
        visible && !document.hidden && !paused && !reduced,
      )
      visibility()
    }
    paint()
    observer.observe(element)
    element.addEventListener("pointermove", move, { passive: true })
    element.addEventListener("pointerleave", leave)
    document.addEventListener("visibilitychange", changedVisibility)
    return () => {
      stop()
      observer.disconnect()
      element.removeEventListener("pointermove", move)
      element.removeEventListener("pointerleave", leave)
      document.removeEventListener("visibilitychange", changedVisibility)
    }
  }, [paused, reduced])

  return (
    <div className="signature-block">
      <div className="signature-caption font-mono">
        <span>BUILT WITH INTENTION.</span>
        <span>JIB / SYSTEMS & INTERFACES</span>
        <button
          type="button"
          disabled={reduced}
          aria-pressed={paused || reduced}
          onClick={() => setPaused((value) => !value)}
        >
          {reduced
            ? "Static signature · reduced motion"
            : paused
              ? "Play signature animation ▷"
              : "Pause signature animation Ⅱ"}
        </button>
      </div>
      <div ref={host} className="signature-wordmark" aria-hidden="true">
        <svg viewBox="0 0 1400 300" fill="none" focusable="false">
          <defs>
            <text
              id={`${id}-name`}
              x="700"
              y="257"
              textAnchor="middle"
              textLength="1370"
              lengthAdjust="spacingAndGlyphs"
              className="signature-lettering"
            >
              JAMES IAN
            </text>
            <clipPath id={`${id}-clip`} clipPathUnits="userSpaceOnUse">
              <text
                x="700"
                y="257"
                textAnchor="middle"
                textLength="1370"
                lengthAdjust="spacingAndGlyphs"
                className="signature-lettering"
                fill="white"
              >
                JAMES IAN
              </text>
            </clipPath>
            <pattern
              ref={texture}
              id={`${id}-code`}
              width="440"
              height="66"
              patternUnits="userSpaceOnUse"
              patternContentUnits="userSpaceOnUse"
            >
              {codeLines.map((line, index) => (
                <text
                  key={line}
                  x={index % 2 ? -24 : 0}
                  y={8 + index * 11}
                  className="signature-code"
                  fill="currentColor"
                >
                  {`${line} ${line}`}
                </text>
              ))}
            </pattern>
            <radialGradient
              ref={light}
              id={`${id}-light`}
              gradientUnits="userSpaceOnUse"
              cx="700"
              cy="150"
              r="340"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="black" />
            </radialGradient>
            <mask
              id={`${id}-spot`}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1400"
              height="300"
            >
              <rect width="1400" height="300" fill={`url(#${id}-light)`} />
            </mask>
          </defs>
          <g clipPath={`url(#${id}-clip)`}>
            <rect
              width="1400"
              height="300"
              fill="currentColor"
              opacity=".035"
            />
            <rect
              width="1400"
              height="300"
              fill={`url(#${id}-code)`}
              opacity=".4"
            />
            <rect
              width="1400"
              height="300"
              fill={`url(#${id}-code)`}
              mask={`url(#${id}-spot)`}
              opacity=".85"
            />
          </g>
          <use
            href={`#${id}-name`}
            stroke="currentColor"
            strokeWidth="1"
            opacity=".45"
          />
        </svg>
      </div>
    </div>
  )
}
