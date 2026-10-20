import { motion } from "motion/react"
import { usePortfolioReducedMotion as useReducedMotion } from "../lib/usePortfolioReducedMotion"
import { projects } from "../data/projects"
import ProjectAtlas from "./ProjectAtlas"
import "./Hero.css"
import { motionTiming } from "../lib/motionTiming"

export default function Hero() {
  const reduced = useReducedMotion()

  function fadeUp(delay: number) {
    if (reduced)
      return {
        initial: false,
        animate: { opacity: 1 },
        transition: { duration: 0 },
      }
    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: motionTiming.reveal, delay, ease: motionTiming.ease },
    }
  }

  return (
    <section
      id="about"
      className="portfolio-hero relative z-10 min-h-[100svh] flex items-center pt-28 pb-16 lg:pt-[72px] lg:pb-0"
    >
      <div className="max-w-[1440px] mx-auto min-w-0 px-4 sm:px-6 lg:px-10 w-full grid grid-cols-1 gap-10 lg:gap-16 items-center lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)]">
        {/* Left */}
        <div className="hero-introduction flex flex-col gap-0">
          <p className="hero-coordinate">
            <span aria-hidden="true">✳</span> INDEPENDENT MIND. CONNECTED
            SYSTEMS.
          </p>
          <motion.p
            {...fadeUp(0)}
            className="text-xs tracking-widest mb-6"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-text2)",
            }}
          >
            JAMES IAN BAYONAS / FULL-STACK DEVELOPER
          </motion.p>

          <h1
            className="leading-[1.05] tracking-tight mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.125rem, 4.5vw, 4rem)",
              color: "var(--color-text1)",
            }}
          >
            I build systems that make{" "}
            <span className="hero-emphasis">complex workflows clear.</span>
          </h1>

          <p
            className="text-base leading-relaxed max-w-md mb-8"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-text2)",
            }}
          >
            Based in the Philippines, I build full-stack applications for
            fisheries, housing, asset management, and pharmacy operations. My
            focus is clear interfaces, connected workflows, and consistent data
            from the first action to the final record.
          </p>

          <motion.div
            {...fadeUp(0.12)}
            className="flex flex-col min-[400px]:flex-row flex-wrap items-stretch min-[400px]:items-center gap-3 mb-8"
          >
            <motion.a
              href="/explore/"
              className="text-sm text-center min-h-11 px-6 py-3"
              style={{
                fontFamily: "var(--font-mono)",
                backgroundColor: "var(--color-accent)",
                color: "var(--color-bg)",
                display: "inline-block",
              }}
              whileHover={
                reduced
                  ? {}
                  : {
                      y: -2,
                      boxShadow: "0 0 28px -4px var(--color-accent-shadow)",
                    }
              }
              whileTap={reduced ? {} : { scale: 0.98 }}
              transition={{ duration: motionTiming.feedback }}
            >
              Explore case studies →
            </motion.a>
            <a
              href="/lab/"
              className="text-sm text-center min-h-11 px-6 py-3 border transition-colors duration-150"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-text1)",
                borderColor: "var(--color-border)",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor =
                  "var(--color-accent)"
                ;(e.currentTarget as HTMLElement).style.color =
                  "var(--color-accent)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor =
                  "var(--color-border)"
                ;(e.currentTarget as HTMLElement).style.color =
                  "var(--color-text1)"
              }}
            >
              Try the engineering lab
            </a>
          </motion.div>

          <motion.p {...fadeUp(0.18)} className="hero-project-count font-mono">
            {projects.length} systems ·{" "}
            {
              projects.filter((project) => project.role === "Sole developer")
                .length
            }{" "}
            built independently · 1 collaborative capstone
          </motion.p>
          <motion.div {...fadeUp(0.18)} className="flex items-center gap-5">
            <a
              href="https://github.com/JamesIan-Bayonas"
              aria-label="GitHub profile"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-150"
              style={{ color: "var(--color-text2)" }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.color =
                  "var(--color-text1)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.color =
                  "var(--color-text2)"
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/james-ian-bayonas-6a556323a/"
              aria-label="LinkedIn profile"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-150"
              style={{ color: "var(--color-text2)" }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.color =
                  "var(--color-text1)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.color =
                  "var(--color-text2)"
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </motion.div>
        </div>

        {/* Interactive project discovery */}
        <motion.div
          initial={reduced ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: motionTiming.reveal, delay: 0.08, ease: motionTiming.ease }}
          className="hero-atlas-frame"
        >
          <ProjectAtlas compact />
        </motion.div>
      </div>
      <div className="hero-bottom-rail">
        <span>
          BASED IN THE PHILIPPINES <span aria-hidden="true">↗</span>
        </span>
        <a href="#directory">
          SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
        </a>
        <span>CODE / SYSTEMS / CURIOSITY</span>
      </div>
    </section>
  )
}
