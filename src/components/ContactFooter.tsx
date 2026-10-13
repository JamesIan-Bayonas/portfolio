import { motion, useReducedMotion } from "motion/react"
import SpotlightCard from "./ui/SpotlightCard"

const cards = [
  {
    label: "Direct Email",
    sub: "jamesianbayonas21@gmail.com",
    href: "mailto:jamesianbayonas21@gmail.com",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    sub: "github.com/JamesIan-Bayonas",
    href: "https://github.com/JamesIan-Bayonas",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    sub: "linkedin.com/in/james-ian-bayonas",
    href: "https://www.linkedin.com/in/james-ian-bayonas-6a556323a/",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

const VIEW = { once: true, margin: "-80px" } as const
const EASE = [0.16, 1, 0.3, 1] as const

interface ContactCardProps {
  card: typeof cards[number]
  index: number
}

function ContactCard({ card, index }: ContactCardProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.1, ease: EASE }}
      whileHover={reduced ? {} : { y: -4 }}
    >
      <SpotlightCard
        className="border p-5 sm:p-6 lg:p-8 flex flex-col gap-0 group h-full"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          borderRadius: "4px",
          transition: "border-color 0.2s ease",
        }}
      >
        <a
          href={card.href}
          target={card.href.startsWith("http") ? "_blank" : undefined}
          rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="flex flex-col h-full"
          style={{ textDecoration: "none" }}
          onMouseEnter={(e) => {
            const card = e.currentTarget.closest(
              ".border",
            ) as HTMLElement | null
            if (card) card.style.borderColor = "var(--color-accent)"
          }}
          onMouseLeave={(e) => {
            const card = e.currentTarget.closest(
              ".border",
            ) as HTMLElement | null
            if (card) card.style.borderColor = "var(--color-border)"
          }}
        >
          <div className="flex items-start justify-between">
            <span style={{ color: "var(--color-text1)" }}>{card.icon}</span>
            <motion.span
              className="text-xl"
              style={{ color: "var(--color-text2)", display: "inline-block" }}
              whileHover={
                reduced ? {} : { x: 4, y: -4, color: "var(--color-accent)" }
              }
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              →
            </motion.span>
          </div>
          <p
            className="text-lg mt-4 mb-1"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text1)",
            }}
          >
            {card.label}
          </p>
          <p
            className="text-xs min-w-0 [overflow-wrap:anywhere]"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-text2)",
            }}
          >
            {card.sub}
          </p>
        </a>
      </SpotlightCard>
    </motion.div>
  )
}

export default function ContactFooter() {
  return (
    <section
      id="contact"
      className="relative z-10 px-4 pt-16 sm:px-6 sm:pt-20 lg:px-10 lg:pt-24"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-[1440px] mx-auto min-w-0">
        {/* Status header */}
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEW}
          transition={{ duration: 0.55 }}
        >
          <span className="relative flex w-2 h-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: "var(--color-diff-add)" }}
            />
            <span
              className="relative inline-flex rounded-full w-2 h-2"
              style={{ backgroundColor: "var(--color-diff-add)" }}
            />
          </span>
          <p
            className="text-sm"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-text2)",
            }}
          >
            Open for new projects & roles
          </p>
        </motion.div>

        <motion.h2
          className="mb-6 leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 3vw, 48px)",
            color: "var(--color-text1)",
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEW}
          transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
        >
          {"Let's build something that matters."}
        </motion.h2>

        <a
          href={`${import.meta.env.BASE_URL}RESUME.pdf`}
          download="James_Ian_Bayonas_Resume.pdf"
          className="contact-resume font-mono"
        >
          Download my resume <span aria-hidden="true">↓</span>
        </a>

        {/* 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 lg:mb-24">
          {cards.map((card, i) => (
            <ContactCard key={card.label} card={card} index={i} />
          ))}
        </div>

        {/* Footer bar */}
        <motion.div
          className="flex flex-col items-start gap-5 md:flex-row md:flex-wrap md:items-center md:justify-between py-8 border-t"
          style={{ borderColor: "var(--color-border)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEW}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <span
            className="text-xs"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-text2)",
            }}
          >
            © 2026 Bayonas. All rights reserved.
          </span>
          <span
            className="text-xs tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-text2)",
            }}
          >
            Full-Stack Developer
          </span>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/JamesIan-Bayonas"
              aria-label="GitHub profile"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-150 inline-flex w-11 h-11 items-center justify-center"
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
                width="20"
                height="20"
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
              className="transition-colors duration-150 inline-flex w-11 h-11 items-center justify-center"
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
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
