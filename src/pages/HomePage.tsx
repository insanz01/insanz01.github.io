import { useState } from "react";
import { Link } from "react-router-dom";
import { PROFILE, PROJECTS } from "../data/portfolio";

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
  const [copied, setCopied] = useState(false);

  return (
    <>
      {/* Asymmetric Two-Column Hero */}
      <section className="pb-12 pt-2" aria-label="About">
        <div className="grid grid-cols-1 items-center gap-7 sm:grid-cols-[152px_1fr] sm:gap-10">
          {/* Left Graphic (~25%): Original chunky pixel-geometric IK mark */}
          <div className="w-[112px] sm:w-[152px]" aria-hidden="true">
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

          {/* Right Message Block (~75%) */}
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="inline-block h-3.5 w-1 bg-[var(--accent)]" aria-hidden="true" />
              <span className="font-mono text-xs font-medium tracking-widest text-[var(--text-muted)] uppercase">
                Full-Stack · Systems · Tools
              </span>
            </div>

            <h1 className="font-display m-0 mb-4 text-[34px] font-bold leading-[1.0] tracking-[-0.03em] text-[var(--text)] sm:text-[44px]">
              Building fast,
              <br />
              maintainable{" "}
              <span className="text-[var(--accent)]">web systems.</span>
            </h1>

            <p className="m-0 text-sm text-[var(--text-muted)]">
              Focused on pragmatic architecture, crisp interfaces, and developer tooling. Press{" "}
              <kbd className="border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--text)]">
                ⌘K
              </kbd>{" "}
              to navigate pages or launch mini-apps.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)] py-10" aria-labelledby="projects-heading">
        <div className="mb-6 flex items-baseline justify-between gap-3">
          <h2
            id="projects-heading"
            className="m-0 font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]"
          >
            Selected Projects
          </h2>
          <Link
            to="/projects"
            className="font-mono text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
          >
            All projects <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {PROJECTS.slice(0, 2).map((project) => (
            <li key={project.id}>
              <Link
                to={`/projects#${project.id}`}
                className="group -mx-4 flex flex-col gap-2 px-4 py-3.5 transition-colors hover:bg-[var(--surface)]"
              >
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1.5 font-medium tracking-tight">
                    {project.title}{" "}
                    <span
                      aria-hidden="true"
                      className="text-[13px] text-[var(--text-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                    >
                      →
                    </span>
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">{project.description}</span>
                </div>
                <div className="flex items-center justify-between gap-3 font-mono text-xs tabular-nums text-[var(--text-subtle)]">
                  <span>{project.stack}</span>
                  <span>{project.year}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-[var(--border)] py-10" aria-labelledby="apps-heading">
        <div className="mb-6 flex items-baseline justify-between gap-3">
          <h2
            id="apps-heading"
            className="m-0 font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]"
          >
            Interactive Workbench
          </h2>
          <Link
            to="/apps"
            className="font-mono text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
          >
            Open playground <span aria-hidden="true">→</span>
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
              Coding Practice →
            </span>
            <span className="text-[13px] leading-snug text-[var(--text-muted)]">
              HackerRank-style algorithm challenges with sample &amp; hidden test cases.
            </span>
          </Link>
        </div>
      </section>

      <section className="border-t border-[var(--border)] py-10" aria-labelledby="connect-heading">
        <div className="mb-6 flex items-baseline justify-between gap-3">
          <h2
            id="connect-heading"
            className="m-0 font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]"
          >
            Get in Touch
          </h2>
          <Link
            to="/contact"
            className="font-mono text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
          >
            Contact page <span aria-hidden="true">→</span>
          </Link>
        </div>

        <p className="mb-4 text-[var(--text-muted)]">
          Open to interesting engineering problems, collaborations, and full-stack roles.
        </p>

        <div className="flex flex-wrap items-center gap-3">
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
            {copied ? "Copied" : "Copy email"}
          </button>
        </div>
      </section>
    </>
  );
}
