import { lazy, Suspense } from "react"
import LoadingState from "./LoadingState"

export interface WalkthroughCompletionProps {
  projectId: "isdalog" | "dormfix" | "centralog" | "pharmalink"
  outcome: string
  onReplay: () => void
}

const CompletionPanel = lazy(() => import("./WalkthroughCompletionPanel"))

export default function WalkthroughCompletion(props: WalkthroughCompletionProps) {
  return <Suspense fallback={<LoadingState label="Preparing walkthrough next steps…" variant="compact" />}>
    <CompletionPanel {...props} />
  </Suspense>
}
