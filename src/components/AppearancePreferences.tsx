import { useThemePreference, useResolvedTheme } from "../lib/useThemePreference"
import {
  setThemePreference,
  type ThemePreference,
} from "../lib/themePreference"
import { currentLocale } from "../lib/locale"
import "./AppearancePreferences.css"

interface AppearanceChoice {
  value: ThemePreference
  title: string
  detail: string
}

export default function AppearancePreferences() {
  const preference = useThemePreference()
  const theme = useResolvedTheme()
  const fil = currentLocale() === "fil"
  const t = (en: string, translated: string) => (fil ? translated : en)
  const choices: AppearanceChoice[] = [
    {
      value: "auto",
      title: t("Follow device theme", "Sundin ang tema ng device"),
      detail: t("Changes with your system", "Kasabay ng setting ng system"),
    },
    {
      value: "light",
      title: t("Light", "Maliwanag"),
      detail: t("A lighter reading surface", "Mas maliwanag na pahina"),
    },
    {
      value: "dark",
      title: t("Dark", "Madilim"),
      detail: t("A darker space to explore", "Mas madilim na pahina"),
    },
  ]
  return (
    <fieldset className="appearance-preferences">
      <legend>{t("Choose your atmosphere", "Piliin ang iyong tema")}</legend>
      <div className="appearance-preference-options">
        {choices.map((choice) => (
          <label
            key={choice.value}
            className="appearance-preference-option"
            data-selected={preference === choice.value}
          >
            <span
              className="appearance-preview"
              data-preview={choice.value}
              aria-hidden="true"
            >
              <i />
              <span>
                <i />
                <i />
                <i />
              </span>
            </span>
            <span className="appearance-option-label">
              <input
                type="radio"
                aria-label={choice.title}
                name="portfolio-appearance"
                value={choice.value}
                checked={preference === choice.value}
                onChange={() => setThemePreference(choice.value)}
              />
              <strong>{choice.title}</strong>
            </span>
            <small>{choice.detail}</small>
          </label>
        ))}
      </div>
      <p role="status" aria-atomic="true">
        {preference === "auto"
          ? t(
              `Following your device · ${theme} theme is active.`,
              `Sinusunod ang device · aktibo ang ${
                theme === "dark" ? "madilim" : "maliwanag"
              } na tema.`,
            )
          : t(
              `${
                theme === "dark" ? "Dark" : "Light"
              } theme is active. Your choice is saved in this browser.`,
              `Aktibo ang ${
                theme === "dark" ? "madilim" : "maliwanag"
              } na tema. Naka-save ang pinili mo sa browser na ito.`,
            )}
      </p>
    </fieldset>
  )
}
