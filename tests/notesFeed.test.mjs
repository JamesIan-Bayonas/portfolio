import test from "node:test"
import assert from "node:assert/strict"
import { engineeringNotes } from "../src/data/notes.ts"
import { notesFeedUrl, notesFeedXml } from "../src/lib/notesFeed.ts"

test("feed contains every note once with stable canonical identities and summaries", () => {
  const feed = notesFeedXml(engineeringNotes)
  assert.equal((feed.match(/<item>/g) ?? []).length, engineeringNotes.length)
  for (const note of engineeringNotes) {
    const url = `https://jamesian-portfolio.vercel.app${note.path}`
    assert.ok(feed.includes(`<guid isPermaLink="true">${url}</guid>`))
    assert.ok(feed.includes(`<link>${url}</link>`))
  }
  assert.ok(feed.includes(`href="${notesFeedUrl}" rel="self"`))
  const edited = engineeringNotes.map((note) => ({
    ...note,
    summary: "Revised explanation",
  }))
  assert.deepEqual(
    [...notesFeedXml(edited).matchAll(/<guid[^>]*>(.*?)<\/guid>/g)].map(
      (match) => match[1],
    ),
    [...feed.matchAll(/<guid[^>]*>(.*?)<\/guid>/g)].map((match) => match[1]),
  )
  assert.ok(!feed.includes("<pubDate>"), "Do not invent publication dates")
})

test("feed escapes markup and preserves Unicode in titles, summaries, and categories", () => {
  const feed = notesFeedXml([
    {
      path: "/notes/example/",
      title: 'A & B <review> "yes"',
      summary: "₱75 — author's ]]> <script> &",
      topic: "API & data",
    },
  ])
  assert.ok(feed.includes("A &amp; B &lt;review&gt; &quot;yes&quot;"))
  assert.ok(feed.includes("₱75 — author&apos;s ]]&gt; &lt;script&gt; &amp;"))
  assert.ok(feed.includes("<category>API &amp; data</category>"))
  assert.ok(!feed.includes("<script>"))
})

test("feed rejects duplicate identities and paths outside published article structure", () => {
  assert.throws(
    () => notesFeedXml([engineeringNotes[0], engineeringNotes[0]]),
    /duplicate/,
  )
  for (const path of [
    "https://example.com/notes/example/",
    "/notes/",
    "/notes/example/?topic=api",
    "/notes/../about/",
  ]) {
    assert.throws(
      () => notesFeedXml([{ ...engineeringNotes[0], path }]),
      /Invalid/,
    )
  }
  assert.ok(notesFeedXml([]).includes("<channel>"))
})
