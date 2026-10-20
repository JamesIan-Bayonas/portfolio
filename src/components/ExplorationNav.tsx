import { currentLocale, localizeCoreHref } from "../lib/locale"
import "./Exploration.css"

export default function ExplorationNav({
  active,
}: {
  active: "projects" | "lab" | "notes" | "about" | "tools"
}) {
  const locale = currentLocale()
  const fil = locale === "fil"
  const sections = [
    {
      id: "projects",
      href: "/explore/",
      label: fil ? "Mga sistema" : "The systems",
    },
    {
      id: "lab",
      href: "/lab/",
      label: fil ? "Subukan (English)" : "The experiments",
    },
    {
      id: "notes",
      href: "/notes/",
      label: fil ? "Mga tala (English)" : "The thinking",
    },
    {
      id: "about",
      href: "/about/",
      label: fil ? "Ang developer" : "The developer",
    },
    { id: "tools", href: "/tools/", label: fil ? "Mga tool (English)" : "The tools" },
  ]
  return (
    <nav
      className="exploration-nav"
      aria-label={fil ? "Tuklasin ang portfolio" : "Explore the portfolio"}
    >
      <span className="exploration-nav-label">
        <i aria-hidden="true" />
        {fil ? "TUKLASIN" : "EXPLORE"}
      </span>
      {sections.map((section, index) => (
        <a
          key={section.id}
          href={localizeCoreHref(section.href, locale)}
          aria-current={active === section.id ? "page" : undefined}
        >
          <span aria-hidden="true">0{index + 1}</span>
          {section.label}
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </nav>
  )
}
