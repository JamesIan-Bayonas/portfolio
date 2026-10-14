import { useRef, useState } from "react"
import { notesFeedUrl, reflectionsFeedUrl } from "../lib/notesFeed"
import type { PortfolioLocale } from "../lib/locale"

export default function FollowNotes({ collection = "notes", locale = "en" }: {
  collection?: "notes" | "reflections"
  locale?: PortfolioLocale
} = {}) {
  const reflection = collection === "reflections"
  const fil = locale === "fil"
  const t = (english: string, filipino: string) => (fil ? filipino : english)
  const feedUrl = reflection ? reflectionsFeedUrl : notesFeedUrl
  const id = `${collection}-feed-url`
  const [message, setMessage] = useState("")
  const input = useRef<HTMLInputElement>(null)

  async function copyFeed() {
    try {
      await navigator.clipboard.writeText(feedUrl)
      setMessage(
        t(
          "Feed link copied. Add it to your feed reader.",
          "Nakopya ang feed link. Ilagay ito sa iyong feed reader.",
        ),
      )
    } catch {
      input.current?.focus()
      input.current?.select()
      setMessage(
        t(
          "Select and copy the feed link below.",
          "Piliin at kopyahin ang feed link sa ibaba.",
        ),
      )
    }
  }

  return (
    <aside
      className="follow-notes"
      aria-label={
        reflection
          ? t("Follow reflections", "Subaybayan ang mga pagninilay")
          : "Follow engineering notes"
      }
    >
      <details>
        <summary>
          {reflection
            ? t(
                "Follow reflections via RSS",
                "Subaybayan ang mga pagninilay sa RSS (English)",
              )
            : "Follow new notes via RSS"}
        </summary>
        <p>
          {reflection
            ? t(
                "Add this link to your feed reader to follow the English reflections.",
                "Ilagay ang link na ito sa iyong feed reader upang masundan ang mga pagninilay sa English.",
              )
            : "Add this link to your feed reader to follow new articles. The feed includes all engineering notes, regardless of archive filters."}
        </p>
        <label htmlFor={id}>Feed link</label>
        <input
          id={id}
          ref={input}
          readOnly
          value={feedUrl}
          onFocus={(event) => event.currentTarget.select()}
        />
        <div className="follow-notes-actions font-mono">
          <button type="button" onClick={copyFeed}>
            {t("Copy feed link", "Kopyahin ang feed link")}
          </button>
          <a
            href={`/${collection}/feed.xml`}
            target="_blank"
            rel="noopener noreferrer"
            hrefLang="en"
          >
            {t("Open RSS feed", "Buksan ang RSS feed")} ↗
          </a>
        </div>
        <p className="follow-notes-status" role="status">
          {message}
        </p>
      </details>
    </aside>
  )
}
