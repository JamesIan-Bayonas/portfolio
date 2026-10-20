import { evaluateRegex, type RegexRequest } from "../lib/regexWorkbench"

self.addEventListener("message", (event: MessageEvent<RegexRequest>) => {
  self.postMessage(evaluateRegex(event.data))
})
