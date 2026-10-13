import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import SpotlightCard from "./ui/SpotlightCard"

const capabilities = ["01", "02", "03", "04"]
const capabilityLabels = [
  "Full-Stack Web Development",
  "API & Database Design",
  "Interactive Frontend Systems",
  "Performance & Deployment",
]
const pills = ["RESTful APIs", "Database Architecture", "Component Systems", "Responsive UI"]

const VIEW = { once: true, margin: "-80px" } as const

export default function About() {
  const reduced = useReducedMotion()
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  return (
    <section
      id="about-section"
      className="relative z-10 px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-[1440px] mx-auto min-w-0">
        {/* Section header */}
        <motion.p
          className="text-xs tracking-widest mb-12"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-text2)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEW}
          transition={{ duration: 0.6 }}
        >
          00 — ABOUT
        </motion.p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,60fr)_minmax(0,40fr)]">
          {/* Left card — slides from left */}
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEW}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <SpotlightCard
              className="border p-5 sm:p-6 lg:p-8 flex flex-col justify-between h-full"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                borderRadius: "4px",
              }}
            >
              <div>
                <h2
                  className="leading-tight mb-6"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(28px, 2.8vw, 40px)",
                    color: "var(--color-text1)",
                  }}
                >
                  Systems thinking applied to every line of code.
                </h2>
                <p
                  className="text-base leading-relaxed mb-8 max-w-lg"
                  style={{ fontFamily: "var(--font-body)", color: "var(--color-text2)" }}
                >
                  I work across React, TypeScript, Node.js, Laravel, and ASP.NET Core.
                  My projects connect people and records: a catch moving through auction and delivery,
                  a tenant waiting for approval, or an asset changing custody. I focus on the data
                  models and business rules underneath each interface, and explain the choices behind them.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {pills.map((pill, i) => (
                  <motion.span
                    key={pill}
                    className="text-xs px-3 py-1 border cursor-default"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--color-text2)",
                      borderColor: "var(--color-border)",
                      borderRadius: "4px",
                      display: "inline-block",
                    }}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEW}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                    whileHover={reduced ? {} : { scale: 1.06, borderColor: "var(--color-accent)", color: "var(--color-text1)" }}
                  >
                    {pill}
                  </motion.span>
                ))}
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Right card — slides from right */}
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEW}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <SpotlightCard
              className="border p-5 sm:p-6 lg:p-8 flex flex-col justify-between h-full"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                borderRadius: "4px",
              }}
            >
              <p
                className="text-xs tracking-widest mb-8"
                style={{ fontFamily: "var(--font-mono)", color: "var(--color-text2)" }}
              >
                CORE DISCIPLINES
              </p>
              <div className="flex flex-col gap-6 flex-1 justify-center">
                {capabilities.map((num, i) => (
                  <div key={num}>
                    <motion.div
                      className="flex gap-4 items-start cursor-default"
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={VIEW}
                      transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
                      onHoverStart={() => setHoveredRow(i)}
                      onHoverEnd={() => setHoveredRow(null)}
                      animate={reduced ? {} : { x: hoveredRow === i ? 4 : 0 }}
                    >
                      <span
                        className="text-xs shrink-0 mt-0.5 transition-colors duration-200"
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: hoveredRow === i && !reduced ? "var(--color-accent)" : "var(--color-text2)",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {num}
                      </span>
                      <p
                        className="text-sm"
                        style={{ fontFamily: "var(--font-body)", color: "var(--color-text1)" }}
                      >
                        {capabilityLabels[i]}
                      </p>
                    </motion.div>
                    {i < capabilities.length - 1 && (
                      <div
                        className="mt-6 h-px w-full"
                        style={{ backgroundColor: "var(--color-border)" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
