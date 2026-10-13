import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"

const steps = [
  {
    num: "e2f1a9",
    title: "Requirement Architecture & Schema Design",
    sub: "Discovery · Data Modeling · API Contract",
  },
  {
    num: "91c3d4",
    title: "Component & API Construction",
    sub: "Clean Code · Scalable Architecture · Type Safety",
  },
  {
    num: "f5b072",
    title: "Production & Deployment",
    sub: "CI/CD · Monitoring · Performance Audit",
  },
]

const VIEW = { once: true, margin: "-80px" } as const
const EASE = [0.16, 1, 0.3, 1] as const

export default function Process() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const reduced = useReducedMotion()

  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="relative z-10 px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-16"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-[1440px] mx-auto min-w-0">
        <motion.h2
          id="process-title"
          className="text-xs tracking-widest mb-12"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-text2)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEW}
          transition={{ duration: 0.55 }}
        >
          HOW I WORK
        </motion.h2>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-0 items-stretch" onMouseLeave={() => setHoveredStep(null)}>
          {steps.map((step, i) => (
            <div key={step.num} className="flex min-w-0 items-start flex-1">
              <motion.div
                className="flex-1 cursor-default"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEW}
                transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
                whileHover={reduced ? {} : { y: -4 }}
                onHoverStart={() => setHoveredStep(i)}
                animate={
                  reduced
                    ? {}
                    : {
                        opacity:
                          hoveredStep === null ? 1 : hoveredStep === i ? 1 : 0.35,
                      }
                }
              >
                <motion.p
                  className="text-xs mb-2"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: hoveredStep === i && !reduced ? "var(--color-accent)" : "var(--color-text2)",
                    transition: "color 0.2s ease",
                  }}
                >
                  {step.num}
                </motion.p>
                <h3
                  className="text-sm mb-1 leading-snug"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-text1)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-xs"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--color-text2)" }}
                >
                  {step.sub}
                </p>
              </motion.div>

              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block mx-4 xl:mx-8 shrink-0 overflow-hidden"
                  style={{ width: "48px", height: "1px", marginTop: "22px", backgroundColor: "var(--color-border)" }}
                >
                  <motion.div
                    style={{ width: "100%", height: "100%", backgroundColor: "var(--color-border)", originX: 0 }}
                    initial={reduced ? {} : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={VIEW}
                    transition={{ duration: 0.5, delay: i * 0.15 + 0.3, ease: EASE }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
