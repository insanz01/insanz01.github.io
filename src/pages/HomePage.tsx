import { useState } from "react";
import { Link } from "react-router-dom";
import { CORE_EXPERTISE, PROFILE, PROJECTS } from "../data/portfolio";
import { useLanguage } from "../i18n";

const MINI_APPS = [
  {
    id: "puzzle",
    name: "JS Puzzles",
    desc: "Grasshopper-style draggable code blocks with live visual output.",
  },
  {
    id: "terminal",
    name: "Terminal",
    desc: "Interactive shell for exploring profile, stack, and shortcuts.",
  },
  {
    id: "utils",
    name: "Dev Utils",
    desc: "JSON formatter, local JWT decoder, and Unix timestamp converter.",
  },
  {
    id: "ratelimit",
    name: "Rate Limiter",
    desc: "Real-time Token Bucket simulator with capacity & burst controls.",
  },
  {
    id: "markdown",
    name: "Markdown",
    desc: "Split-pane scratchpad with live preview and local persistence.",
  },
];

export function HomePage() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  return (
    <>
      {/* Asymmetric Two-Column Hero */}
      <section className="pb-12 pt-1" aria-label="About">
        <div className="grid grid-cols-1 items-center gap-7 sm:grid-cols-[140px_1fr] sm:gap-9">
          <div className="w-[104px] sm:w-[140px]" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 224 224"
              fill="none"
              className="h-auto w-full border border-[var(--border)] bg-[var(--surface)]"
            >
              <rect x="32" y="40" width="48" height="24" fill="var(--text)" />
              <rect x="44" y="64" width="24" height="96" fill="var(--text)" />
              <rect x="32" y="160" width="48" height="24" fill="var(--text)" />
              <rect x="104" y="40" width="24" height="144" fill="var(--text)" />
              <rect x="128" y="96" width="24" height="24" fill="var(--border)" />
              <rect x="152" y="64" width="24" height="32" fill="var(--text)" />
              <rect x="176" y="40" width="24" height="24" fill="var(--text)" />
              <rect x="152" y="120" width="24" height="32" fill="var(--text)" />
              <rect x="176" y="152" width="24" height="32" fill="var(--text)" />
              <rect x="176" y="160" width="24" height="24" fill="var(--accent)" />
            </svg>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="inline-block h-3.5 w-1 bg-[var(--accent)]" aria-hidden="true" />
              <span className="font-mono text-xs font-medium tracking-widest text-[var(--text-muted)] uppercase">
                {t.home.eyebrow}
              </span>
            </div>

            <h1 className="font-display m-0 mb-3.5 text-[32px] font-bold leading-[1.0] tracking-[-0.03em] text-[var(--text)] sm:text-[42px]">
              {t.home.headlineLine1}
              <br />
              {t.home.headlineLine2}{" "}
              <span className="text-[var(--accent)]">{t.home.headlineAccent}</span>
            </h1>

            <p className="m-0 text-sm text-[var(--text-muted)]">{t.home.summary}</p>
          </div>
        </div>
      </section>

      {/* Core Expertise */}
      <section className="border-t border-[var(--border)] py-9" aria-labelledby="expertise-heading">
        <div className="mb-5 flex items-baseline justify-between gap-3">
          <h2
            id="expertise-heading"
            className="m-0 font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]"
          >
            {t.home.coreExpertise}
          </h2>
          <Link
            to="/experience"
            className="font-mono text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
          >
            {t.home.fullExperience} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {CORE_EXPERTISE.map((item) => (
            <div
              key={item.title}
              className="border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3.5"
            >
              <h3 className="m-0 mb-1 text-sm font-medium tracking-tight text-[var(--text)]">
                {item.title}
              </h3>
              <p className="m-0 text-[13px] leading-snug text-[var(--text-muted)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Projects */}
      <section className="border-t border-[var(--border)] py-9" aria-labelledby="projects-heading">
        <div className="mb-5 flex items-baseline justify-between gap-3">
          <h2
            id="projects-heading"
            className="m-0 font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]"
          >
            {t.home.selectedProjects}
          </h2>
          <Link
            to="/projects"
            className="font-mono text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
          >
            {t.home.allProjects} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {PROJECTS.slice(0, 2).map((project) => (
            <li key={project.id}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group -mx-4 flex flex-col gap-1.5 px-4 py-3 transition-colors hover:bg-[var(--surface)]"
              >
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1.5 font-medium tracking-tight">
                    {project.title}{" "}
                    <span
                      aria-hidden="true"
                      className="text-[13px] text-[var(--text-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]"
                    >
                      ↗
                    </span>
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">{project.description}</span>
                </div>
                <div className="flex items-center justify-between gap-3 font-mono text-xs tabular-nums text-[var(--text-subtle)]">
                  <span>{project.stack}</span>
                  <span>{project.year}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Interactive Workbench */}
      <section className="border-t border-[var(--border)] py-9" aria-labelledby="apps-heading">
        <div className="mb-5 flex items-baseline justify-between gap-3">
          <h2
            id="apps-heading"
            className="m-0 font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]"
          >
            {t.home.workbenchTitle}
          </h2>
          <Link
            to="/apps"
            className="font-mono text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
          >
            {t.home.openPlayground} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {MINI_APPS.map((app) => (
            <Link
              key={app.id}
              to={`/apps#${app.id}`}
              className="flex flex-col gap-1 border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3.5 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
            >
              <span className="text-sm font-medium tracking-tight">{app.name}</span>
              <span className="text-[13px] leading-snug text-[var(--text-muted)]">{app.desc}</span>
            </Link>
          ))}
          <Link
            to="/practice"
            className="flex flex-col gap-1 border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3.5 transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface)]"
          >
            <span className="text-sm font-medium tracking-tight text-[var(--accent)]">
              {t.home.practiceTitle}
            </span>
            <span className="text-[13px] leading-snug text-[var(--text-muted)]">
              {t.home.practiceDesc}
            </span>
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-[var(--border)] pt-9" aria-labelledby="connect-heading">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2
            id="connect-heading"
            className="m-0 font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]"
          >
            {t.home.getInTouch}
          </h2>
          <Link
            to="/contact"
            className="font-mono text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
          >
            {t.home.contactPage} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${PROFILE.email}`}
            className="border-b border-[var(--border-strong)] pb-0.5 font-mono text-[13.5px] transition-colors hover:border-[var(--accent)]"
          >
            {PROFILE.email}
          </a>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(PROFILE.email).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              });
            }}
            className="cursor-pointer border border-[var(--border)] bg-transparent px-2.5 py-1 text-[12.5px] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
          >
            {copied ? t.home.copied : t.home.copyEmail}
          </button>
        </div>

        <Link
          to="/mentoring"
          className="inline-flex items-center gap-2 border border-[var(--border)] bg-[var(--surface-raised)] px-3.5 py-2 text-[13px] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
        >
          <span className="inline-block h-2 w-2 bg-[var(--accent)]" aria-hidden="true" />
          <span>{t.home.mentoringBanner}</span>
          <span className="font-mono text-xs text-[var(--accent)]">{t.home.learnMore} →</span>
        </Link>
      </section>
    </>
  );
}
