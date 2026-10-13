interface LoadingStateProps {
  label: string
  variant?: "page" | "section" | "panel" | "compact"
}

export default function LoadingState({ label, variant = "panel" }: LoadingStateProps) {
  return <div className={`loading-state loading-state-${variant}`} role="status" aria-busy="true">
    <div>
      <p className="font-mono">{label}</p>
      {variant !== "compact" && <div className="loading-state-shape" aria-hidden="true"><span /><span /><span /></div>}
    </div>
  </div>
}
