import { useRef, useState } from "react"
import { projects } from "../data/projects"
import {
  answerPortfolioQuestion,
  questionProjectDestination,
  suggestedQuestions,
} from "../lib/portfolioQuestions"
import type { QuestionAnswer } from "../lib/portfolioQuestions"

export default function PortfolioQuestions() {
  const [question, setQuestion] = useState("")
  const [answeredQuestion, setAnsweredQuestion] = useState("")
  const [answer, setAnswer] = useState<QuestionAnswer>()
  const input = useRef<HTMLInputElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)

  function ask(value: string) {
    const next = value.trim()
    if (!next || next.length > 240) return
    setQuestion(next)
    setAnsweredQuestion(next)
    setAnswer(answerPortfolioQuestion(next, projects))
    requestAnimationFrame(() => heading.current?.focus())
  }

  function clear() {
    setQuestion("")
    setAnsweredQuestion("")
    setAnswer(undefined)
    input.current?.focus()
  }

  return (
    <div className="explore-page questions-page px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <header className="explore-header">
          <a className="case-study-breadcrumb font-mono" href="/explore/">
            ← Explore the projects
          </a>
          <p className="project-eyebrow font-mono">
            ASK / PUBLISHED PORTFOLIO CONTENT
          </p>
          <h1>Start with a question.</h1>
          <p>
            Ask about the projects, James's contributions, technologies, or
            engineering evidence. Each answer points to the published
            explanation.
          </p>
        </header>
        <form
          className="portfolio-question-form"
          onSubmit={(event) => {
            event.preventDefault()
            ask(question)
          }}
        >
          <label htmlFor="portfolio-question">
            What would you like to know?
          </label>
          <input
            id="portfolio-question"
            autoComplete="off"
            ref={input}
            value={question}
            maxLength={240}
            placeholder="Which projects use .NET?"
            onChange={(event) => setQuestion(event.target.value)}
            aria-describedby="portfolio-question-help"
          />
          <p id="portfolio-question-help">
            Answers cover this portfolio's published content. Your question
            stays in this page and is cleared when you leave or reset it.
          </p>
          <div className="question-actions font-mono">
            <button type="submit" disabled={!question.trim()}>
              Find an answer
            </button>
            <button
              type="button"
              onClick={clear}
              disabled={!question && !answer}
            >
              Clear question
            </button>
          </div>
        </form>
        <section
          className="question-examples"
          aria-labelledby="question-examples-title"
        >
          <h2 id="question-examples-title">Try a question</h2>
          <div className="question-suggestions">
            {suggestedQuestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => ask(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </section>
        {answer && (
          <section
            className="question-answer"
            aria-labelledby="question-answer-title"
          >
            <p className="question-asked">Your question: {answeredQuestion}</p>
            <h2 id="question-answer-title" ref={heading} tabIndex={-1}>
              {answer.heading}
            </h2>
            <p>{answer.summary}</p>
            <div className="professional-project-links font-mono">
              {answer.links.map((link) => (
                <a href={link.href} key={link.href}>
                  {link.label} ↗
                </a>
              ))}
            </div>
            <div className="question-projects">
              {answer.projects.map((project) => (
                <article key={project.id}>
                  <p className="project-eyebrow font-mono">
                    {project.context} / {project.role}
                  </p>
                  <h3>{project.name}</h3>
                  <p>
                    {answer.kind === "contribution"
                      ? project.caseStudy.contribution
                      : project.description}
                  </p>
                  <p className="question-technologies">
                    Case-study technologies: {project.tech.join(" · ")}
                  </p>
                  <p className="question-version">{project.versionSummary}</p>
                  {project.demoAvailable === false && (
                    <p>
                      Live demo marked unavailable. The case study and sample
                      walkthrough remain available.
                    </p>
                  )}
                  <a
                    className="font-mono"
                    href={questionProjectDestination(project, answer.kind)}
                  >
                    Read the{" "}
                    {answer.kind === "source"
                      ? "source references"
                      : answer.kind === "tests"
                        ? "test evidence"
                        : answer.kind === "demos"
                          ? "walkthrough"
                          : "case study"}{" "}
                    ↗
                  </a>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
