import { useRef, useState } from "react"
import { notesFeedUrl } from "../lib/notesFeed"

export default function FollowNotes() {
  const [message, setMessage] = useState("")
  const input = useRef<HTMLInputElement>(null)

  async function copyFeed() {
    try {
      await navigator.clipboard.writeText(notesFeedUrl)
      setMessage("Feed link copied. Add it to your feed reader.")
    } catch {
      input.current?.focus()
      input.current?.select()
      setMessage("Select and copy the feed link below.")
    }
  }

  return (
    <aside className="follow-notes" aria-label="Follow engineering notes">
      <details>
        <summary>Follow new notes via RSS</summary>
        <p>
          Add this link to your feed reader to follow new articles. The feed
          includes all engineering notes, regardless of archive filters.
        </p>
        <label htmlFor="notes-feed-url">Feed link</label>
        <input
          id="notes-feed-url"
          ref={input}
          readOnly
          value={notesFeedUrl}
          onFocus={(event) => event.currentTarget.select()}
        />
        <div className="follow-notes-actions font-mono">
          <button type="button" onClick={copyFeed}>
            Copy feed link
          </button>
          <a href="/notes/feed.xml" target="_blank" rel="noopener noreferrer">
            Open RSS feed ↗
          </a>
        </div>
        <p className="follow-notes-status" role="status">
          {message}
        </p>
      </details>
    </aside>
  )
}
