import React from "react"
import { createRoot } from "react-dom/client"
import ProjectAtlas from "../../src/components/ProjectAtlas"
import "../../src/index.css"

// Browser integration fixture: only this document sees the simulated APIs.
const reduced = document.querySelector<HTMLInputElement>("#reduced")!
const hidden = document.querySelector<HTMLInputElement>("#hidden")!
const blocked = document.querySelector<HTMLInputElement>("#blocked")!
const mount = document.querySelector<HTMLButtonElement>("#mount")!
const frames = document.querySelector<HTMLOutputElement>("#frames")!
const listeners = document.querySelector<HTMLOutputElement>("#listeners")!
const nativeMatchMedia = window.matchMedia.bind(window)
const preferenceEvents = new EventTarget()
const preferenceListeners = new Set<EventListenerOrEventListenerObject>()
const preference = {
  get matches() {
    return reduced.checked
  },
  media: "(prefers-reduced-motion: reduce)",
  addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
    preferenceEvents.addEventListener(type, listener)
    preferenceListeners.add(listener)
    listeners.value = String(preferenceListeners.size)
  },
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
  ) {
    preferenceEvents.removeEventListener(type, listener)
    preferenceListeners.delete(listener)
    listeners.value = String(preferenceListeners.size)
  },
}
window.matchMedia = (query) =>
  query === preference.media
    ? preference as unknown as MediaQueryList
    : nativeMatchMedia(query)
reduced.addEventListener("change", () =>
  preferenceEvents.dispatchEvent(new Event("change")),
)
Object.defineProperty(document, "hidden", { get: () => hidden.checked })
hidden.addEventListener("change", () =>
  document.dispatchEvent(new Event("visibilitychange")),
)
let savedPause = "false"
Object.defineProperty(window, "localStorage", {
  value: {
    getItem() {
      if (blocked.checked) throw new Error("Storage unavailable")
      return savedPause
    },
    setItem(_key: string, value: string) {
      if (blocked.checked) throw new Error("Storage unavailable")
      savedPause = value
    },
  },
})
const nativeRequest = window.requestAnimationFrame.bind(window)
const nativeCancel = window.cancelAnimationFrame.bind(window)
const pending = new Set<number>()
window.requestAnimationFrame = (callback) => {
  const id = nativeRequest((time) => {
    pending.delete(id)
    frames.value = String(pending.size)
    callback(time)
  })
  pending.add(id)
  frames.value = String(pending.size)
  return id
}
window.cancelAnimationFrame = (id) => {
  pending.delete(id)
  frames.value = String(pending.size)
  nativeCancel(id)
}
const root = createRoot(document.querySelector("#fixture")!)
let mounted = true
const render = () =>
  root.render(
    <React.StrictMode>{mounted && <ProjectAtlas />}</React.StrictMode>,
  )
mount.addEventListener("click", () => {
  mounted = !mounted
  mount.textContent = mounted ? "Unmount Atlas" : "Mount Atlas"
  render()
})
document.body.style.cssText = "max-width:900px;margin:24px auto;padding:16px"
document.querySelector<HTMLElement>("#fixture")!.style.marginTop = "24px"
render()
