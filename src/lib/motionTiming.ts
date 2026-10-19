// Seconds for Motion; convert to milliseconds for the Web Animations API.
export const motionTiming = {
  feedback: 0.16,
  panel: 0.28,
  reveal: 0.44,
  signal: 0.56,
  ease: [0.2, 0.7, 0.2, 1] as const,
  cssEase: "cubic-bezier(.2,.7,.2,1)",
}
