import { useRef, type ReactNode } from "react"
import { useInView } from "motion/react"
import { usePortfolioReducedMotion } from "../lib/usePortfolioReducedMotion"
import "./HomeChapter.css"

export default function HomeChapter({ number, label, children }: {
  number: string
  label: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reached = useInView(ref, { once: true, margin: "0px 0px -12% 0px" })
  const reduced = usePortfolioReducedMotion()
  return (
    <div ref={ref} className="home-chapter" data-reached={reached} data-static={reduced}>
      <div className="home-chapter-signal" aria-hidden="true">
        <span className="home-chapter-marker">{number}</span>
        <span className="home-chapter-label">{label}</span>
        <span className="home-chapter-line" />
        <span className="home-chapter-end">+</span>
      </div>
      {children}
    </div>
  )
}
