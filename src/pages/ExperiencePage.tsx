import { EXPERIENCE, STACK } from "../data/portfolio";

export function ExperiencePage() {
  return (
    <>
      <section className="pb-10">
        <h1 className="mb-2 text-[22px] font-semibold tracking-tight">Experience</h1>
        <p className="m-0 text-[var(--text-muted)]">
          Background in full-stack product engineering, backend APIs, and developer tooling.
        </p>
      </section>

      <section className="border-t border-[var(--border)] py-10" aria-labelledby="work-heading">
        <h2
          id="work-heading"
          className="mb-6 text-[12.5px] font-medium uppercase tracking-wider text-[var(--text-subtle)]"
        >
          Work History
        </h2>

        <ul className="m-0 flex list-none flex-col gap-7 p-0">
          {EXPERIENCE.map((item) => (
            <li key={`${item.role}-${item.period}`}>
              <div className="mb-1.5 flex flex-col items-baseline justify-between gap-1 sm:flex-row sm:gap-4">
                <div>
                  <h3 className="m-0 text-[15px] font-medium tracking-tight">{item.role}</h3>
                  <p className="mt-0.5 text-[13.5px] text-[var(--text-muted)]">{item.company}</p>
                </div>
                <span className="font-mono text-xs tabular-nums text-[var(--text-subtle)]">
                  {item.period}
                </span>
              </div>
              <p className="m-0 text-sm text-[var(--text-muted)]">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-[var(--border)] py-10" aria-labelledby="stack-heading">
        <h2
          id="stack-heading"
          className="mb-6 text-[12.5px] font-medium uppercase tracking-wider text-[var(--text-subtle)]"
        >
          Core Stack
        </h2>

        <dl className="m-0 flex flex-col gap-3">
          {STACK.map((row) => (
            <div key={row.label} className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-[140px_1fr] sm:gap-4">
              <dt className="font-normal text-[var(--text-subtle)]">{row.label}</dt>
              <dd className="m-0 text-[var(--text)]">{row.items}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
