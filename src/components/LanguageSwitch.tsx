import { currentLocale, languageDestination } from "../lib/locale"
import { useEffect, useState } from "react"

export default function LanguageSwitch() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const updateHash = () => setHash(window.location.hash)
    window.addEventListener("hashchange", updateHash)
    return () => window.removeEventListener("hashchange", updateHash)
  }, [])
  const filipino = currentLocale() === "fil"
  return (
    <a
      className="language-switch font-mono"
      lang={filipino ? "en" : "fil"}
      hrefLang={filipino ? "en" : "fil"}
      href={languageDestination(
        window.location.pathname + hash,
        filipino ? "en" : "fil",
      )}
      aria-label={filipino ? "Read in English" : "Basahin sa Filipino"}
    >
      {filipino ? "English" : "Filipino"}
    </a>
  )
}
