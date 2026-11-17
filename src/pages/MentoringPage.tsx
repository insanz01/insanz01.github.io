import { useState } from "react";
import { PROFILE } from "../data/portfolio";
import { useLanguage } from "../i18n";

const AUDIENCE = [
  {
    title: "Solo Builders & Founders",
    desc: "Ship full-stack products independently from idea to production without getting blocked by backend complexity.",
  },
  {
    title: "Developers Leveling Up",
    desc: "Transition from basic CRUD or frontend work into scalable APIs, databases, caching, and system design.",
  },
  {
    title: "Engineers Adopting AI",
    desc: "Use AI coding workflows effectively while keeping code quality, security, and architecture under control.",
  },
];

const TOPICS = [
  {
    num: "01",
    title: "AI-Native Product Development",
    desc: "Structuring specs, prompts, and review workflows so AI accelerates delivery without creating unmaintainable code.",
  },
  {
    num: "02",
    title: "Backend & API Architecture",
    desc: "Designing reliable REST/WebSocket APIs, authentication, rate limiting, and clean data models in Go, Node.js, or Python.",
  },
  {
    num: "03",
    title: "Practical AI & RAG Integration",
    desc: "Integrating Gemini/OpenAI APIs, retrieval pipelines, guardrails, and caching to control latency and token costs.",
  },
  {
    num: "04",
    title: "Deployment & Production Readiness",
    desc: "Containerization with Docker, CI/CD pipelines, environment management, and shipping confidently to production.",
  },
];

export function MentoringPage() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const mailtoHref = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
    "Private Mentoring Inquiry — Product Development"
  )}&body=${encodeURIComponent(
    "Hi Insan Kamil,\n\nI'm interested in 1-on-1 Private Mentoring.\n\n- Current role / background:\n- Product or topic I want to build/learn:\n- Preferred format (1-on-1 Session / 4-Week Sprint):\n"
  )}`;

  return (
    <>
      <section className="pb-10">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="inline-block h-3.5 w-1 bg-[var(--accent)]" aria-hidden="true" />
          <span className="font-mono text-xs font-medium tracking-widest text-[var(--text-muted)] uppercase">
            {t.mentoring.eyebrow}
          </span>
        </div>

        <h1 className="font-display mb-3 text-[28px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[36px]">
          {t.mentoring.titleStart}{" "}
          <span className="text-[var(--accent)]">{t.mentoring.titleAccent}</span>
        </h1>

        <p className="m-0 max-w-2xl text-sm text-[var(--text-muted)]">
          {t.mentoring.subtitle}
        </p>
      </section>

      {/* Who It's For */}
      <section className="border-t border-[var(--border)] py-9" aria-labelledby="who-heading">
        <h2
          id="who-heading"
          className="mb-5 font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]"
        >
          {t.mentoring.whoTitle}
        </h2>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {AUDIENCE.map((item) => (
            <div
              key={item.title}
              className="border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3.5"
            >
              <h3 className="m-0 mb-1.5 text-sm font-medium tracking-tight text-[var(--text)]">
                {item.title}
              </h3>
              <p className="m-0 text-[13px] leading-snug text-[var(--text-muted)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What We Cover */}
      <section className="border-t border-[var(--border)] py-9" aria-labelledby="topics-heading">
        <h2
          id="topics-heading"
          className="mb-5 font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]"
        >
          {t.mentoring.whatTitle}
        </h2>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {TOPICS.map((topic) => (
            <div
              key={topic.num}
              className="border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3.5"
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span className="font-mono text-xs text-[var(--accent)]">{topic.num}</span>
                <h3 className="m-0 text-sm font-medium tracking-tight text-[var(--text)]">
                  {topic.title}
                </h3>
              </div>
              <p className="m-0 text-[13px] leading-snug text-[var(--text-muted)]">{topic.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formats & Booking */}
      <section className="border-t border-[var(--border)] pt-9" aria-labelledby="format-heading">
        <h2
          id="format-heading"
          className="mb-5 font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]"
        >
          {t.mentoring.formatTitle}
        </h2>

        <div className="mb-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div className="border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-4">
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <h3 className="m-0 text-sm font-medium text-[var(--text)]">1-on-1 Deep Dive</h3>
              <span className="font-mono text-[11.5px] text-[var(--text-subtle)]">60–90 min</span>
            </div>
            <p className="m-0 text-[13px] text-[var(--text-muted)]">
              Focused architecture review, debugging session, AI workflow setup, or technical
              roadmap planning for your product.
            </p>
          </div>

          <div className="border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-4">
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <h3 className="m-0 text-sm font-medium text-[var(--text)]">Build Sprint Mentorship</h3>
              <span className="font-mono text-[11.5px] text-[var(--text-subtle)]">4 weeks</span>
            </div>
            <p className="m-0 text-[13px] text-[var(--text-muted)]">
              Weekly 1-on-1 sessions + async code &amp; architecture reviews to take your product
              from concept to live deployment.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
          <a
            href={mailtoHref}
            className="inline-flex items-center gap-2 border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[#090D0C] transition-opacity hover:opacity-90"
          >
            {t.mentoring.bookCta} <span aria-hidden="true">↗</span>
          </a>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(PROFILE.email).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              });
            }}
            className="cursor-pointer border border-[var(--border-strong)] bg-transparent px-3 py-2 font-mono text-xs text-[var(--text)] transition-colors hover:bg-[var(--surface-raised)]"
          >
            {copied ? t.mentoring.copiedEmail : PROFILE.email}
          </button>
        </div>
      </section>
    </>
  );
}
