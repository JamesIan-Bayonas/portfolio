import { useRef, useState, type MouseEvent, type ReactNode } from "react"
import { usePortfolioReducedMotion as useReducedMotion } from "../lib/usePortfolioReducedMotion"

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  glowColor?: string
}

export default function SpotlightCard({
  children,
  className = "",
  style,
  glowColor = "var(--color-spotlight-glow)",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const reduced = useReducedMotion()

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
        boxShadow: hovered && !reduced ? "0 0 20px -5px var(--color-card-shadow)" : "none",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!reduced && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, ${glowColor}, transparent 80%)`,
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  )
}
