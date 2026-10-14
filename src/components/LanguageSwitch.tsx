import { currentLocale, languageDestination } from "../lib/locale"

export default function LanguageSwitch() {
  const filipino = currentLocale() === "fil"
  return (
    <a
      className="language-switch font-mono"
      lang={filipino ? "en" : "fil"}
      hrefLang={filipino ? "en" : "fil"}
      href={languageDestination(
        window.location.pathname + window.location.hash,
        filipino ? "en" : "fil",
      )}
      aria-label={filipino ? "Read in English" : "Basahin sa Filipino"}
    >
      {filipino ? "English" : "Filipino"}
    </a>
  )
}
