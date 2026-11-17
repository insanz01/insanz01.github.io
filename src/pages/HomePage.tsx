import { useState } from "react";
import { Link } from "react-router-dom";
import { PROFILE, PROJECTS } from "../data/portfolio";

const MINI_APPS = [
  {
    id: "puzzle",
    name: "JS Puzzles",
    desc: "Grasshopper-style bite-sized JavaScript challenges with live visual output.",
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
      <section className="pb-10" aria-label="About">
        <p className="mb-3.5 text-lg font-medium leading-snug tracking-tight">
          I build full-stack web applications with a focus on clarity, performance, and maintainable
          architecture.
        </p>
        <p className="m-0 text-[var(--text-muted)]">
          Currently exploring distributed systems, developer tooling, and pragmatic product
          engineering. Press{" "}
          <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[11.5px] text-[var(--text)]">
            ⌘K
          </kbd>{" "}
          (or{" "}
          <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[11.5px] text-[var(--text)]">
            Ctrl+K
          </kbd>
          ) to jump between pages and mini-apps.
        </p>
      </section>

      <section className="border-t border-[var(--border)] py-10" aria-labelledby="projects-heading">
        <div className="mb-6 flex items-baseline justify-between gap-3">
          <h2
            id="projects-heading"
            className="m-0 text-[12.5px] font-medium uppercase tracking-wider text-[var(--text-subtle)]"
          >
            Selected Projects
          </h2>
          <Link
            to="/projects"
            className="text-[13px] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            All projects <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {PROJECTS.slice(0, 2).map((project) => (
            <li key={project.id}>
              <Link
                to={`/projects#${project.id}`}
                className="group -mx-4 flex flex-col gap-2 rounded-[6px] px-4 py-3.5 transition-colors hover:bg-[var(--surface)]"
              >
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1 font-medium tracking-tight">
                    {project.title}{" "}
                    <span
                      aria-hidden="true"
                      className="text-[13px] text-[var(--text-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--text)]"
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
            className="m-0 text-[12.5px] font-medium uppercase tracking-wider text-[var(--text-subtle)]"
          >
            Mini Apps
          </h2>
          <Link
            to="/apps"
            className="text-[13px] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            Open playground <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {MINI_APPS.map((app, idx) => (
            <Link
              key={app.id}
              to={`/apps#${app.id}`}
              className={`flex flex-col gap-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3.5 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] ${
                idx === 0 ? "sm:col-span-2" : ""
              }`}
            >
              <span className="text-sm font-medium tracking-tight">{app.name}</span>
              <span className="text-[13px] leading-snug text-[var(--text-muted)]">{app.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--border)] py-10" aria-labelledby="connect-heading">
        <div className="mb-6 flex items-baseline justify-between gap-3">
          <h2
            id="connect-heading"
            className="m-0 text-[12.5px] font-medium uppercase tracking-wider text-[var(--text-subtle)]"
          >
            Get in Touch
          </h2>
          <Link
            to="/contact"
            className="text-[13px] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
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
            className="border-b border-[var(--border-strong)] pb-0.5 font-mono text-[13.5px] transition-colors hover:border-[var(--text)]"
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
            className="cursor-pointer rounded-[6px] border border-[var(--border)] bg-transparent px-2.5 py-1 text-[12.5px] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
          >
            {copied ? "Copied" : "Copy email"}
          </button>
        </div>
      </section>
    </>
  );
}
