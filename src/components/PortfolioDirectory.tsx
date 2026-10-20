import PortfolioTerminal from "./PortfolioTerminal"
import { motion } from "motion/react"
import { usePortfolioReducedMotion as useReducedMotion } from "../lib/usePortfolioReducedMotion"
import "./PortfolioDirectory.css"
import { motionTiming } from "../lib/motionTiming"

const destinations = [
  {
    command: "projects",
    number: "01",
    title: "Built for the real world.",
    label: "SELECTED SYSTEMS",
    description:
      "Four applications. Different industries. Connected workflows from the first action to the final record.",
    href: "/explore/",
    detail: "IsdaLog / DormFix / PharmaLink / CentraLog",
    symbol: "⌘",
  },
  {
    command: "lab",
    number: "02",
    title: "Go beyond the screenshot.",
    label: "ENGINEERING LAB",
    description:
      "Step into interactive demonstrations. Follow a payment, review a receipt, or explore how an asset changes in value.",
    href: "/lab/",
    detail: "Explore working demonstrations",
    symbol: "↗",
  },
  {
    command: "notes",
    number: "03",
    title: "The thinking behind it.",
    label: "FIELD NOTES",
    description:
      "Decisions, tradeoffs, and lessons from building the systems. A closer look at how the pieces fit together.",
    href: "/notes/",
    detail: "Read the engineering notes",
    symbol: "≡",
  },
  {
    command: "about",
    number: "04",
    title: "Meet the person building.",
    label: "ABOUT & JOURNEY",
    description:
      "My background, the tools I work with, and the path that brought me to full-stack development.",
    href: "/about/",
    detail: "Background / approach / experience",
    symbol: "◎",
  },
] as const

export default function PortfolioDirectory() {
  const reduced = useReducedMotion()
  return (
    <section
      className="portfolio-directory"
      aria-labelledby="directory-title"
      id="directory"
    >
      <div className="directory-heading">
        <div>
          <p className="directory-eyebrow">
            A SMALL UNIVERSE OF SYSTEMS & IDEAS
          </p>
          <h2 id="directory-title">
            Follow your curiosity<span>.</span>
          </h2>
        </div>
        <p>
          Explore what I build, how it works,
          <br />
          and what I learn along the way.
        </p>
      </div>
      <div className="directory-grid">
        {destinations.map((destination, index) => (
          <motion.a
            href={destination.href}
            key={destination.command}
            className="directory-card"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: motionTiming.reveal, delay: index * 0.04, ease: motionTiming.ease }}
          >
            <div className="directory-card-top">
              <span>
                {destination.number} / {destination.label}
              </span>
              <span aria-hidden="true">↗</span>
            </div>
            <span className="directory-symbol" aria-hidden="true">
              {destination.symbol}
            </span>
            <h3>{destination.title}</h3>
            <p>{destination.description}</p>
            <span className="directory-detail">{destination.detail}</span>
          </motion.a>
        ))}
      </div>
      <a className="directory-tools-entry" href="/tools/"><span>DEVELOPER TOOLS / 01—02</span><strong>A workbench for your data.</strong><span>JSON Workbench · Regex Lab</span><span aria-hidden="true">↗</span></a>
      <PortfolioTerminal />
    </section>
  )
}
