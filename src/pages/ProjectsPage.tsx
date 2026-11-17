import { PROJECTS } from "../data/portfolio";

export function ProjectsPage() {
  return (
    <>
      <section className="pb-10">
        <h1 className="mb-2 text-[22px] font-semibold tracking-tight">Projects</h1>
        <p className="m-0 text-[var(--text-muted)]">
          Production web platforms, CMS systems, and management tools I&apos;ve architected and shipped.
        </p>
      </section>

      <section className="border-t border-[var(--border)] py-10">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {PROJECTS.map((project) => (
            <li key={project.id} id={project.id}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group -mx-4 flex flex-col gap-2 rounded-[6px] px-4 py-3.5 transition-colors hover:bg-[var(--surface)]"
              >
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1 font-medium tracking-tight">
                    {project.title}{" "}
                    <span
                      aria-hidden="true"
                      className="text-[13px] text-[var(--text-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--text)]"
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
    </>
  );
}
