import { EXPERIENCE, EDUCATION, STACK } from "../data/portfolio";
import { useLanguage } from "../i18n";

export function ExperiencePage() {
  const { t } = useLanguage();
  return (
    <>
      <section className="pb-8">
        <h1 className="mb-2 text-[22px] font-semibold tracking-tight">{t.experience.title}</h1>
        <p className="m-0 text-[var(--text-muted)]">{t.experience.subtitle}</p>
      </section>

      <section className="border-t border-[var(--border)] py-9" aria-labelledby="work-heading">
        <h2
          id="work-heading"
          className="mb-6 font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]"
        >
          {t.experience.workHistory}
        </h2>

        <ul className="m-0 flex list-none flex-col gap-8 p-0">
          {EXPERIENCE.map((item) => (
            <li key={`${item.role}-${item.company}-${item.period}`}>
              <div className="mb-1.5 flex flex-col items-baseline justify-between gap-1 sm:flex-row sm:gap-4">
                <div>
                  <h3 className="m-0 text-[15px] font-medium tracking-tight text-[var(--text)]">
                    {item.role}
                  </h3>
                  <p className="mt-0.5 text-[13.5px] text-[var(--accent)]">{item.company}</p>
                </div>
                <span className="font-mono text-xs tabular-nums text-[var(--text-subtle)]">
                  {item.period}
                </span>
              </div>

              {item.stack && (
                <p className="mb-2 font-mono text-[11.5px] text-[var(--text-subtle)]">
                  {item.stack}
                </p>
              )}

              <ul className="m-0 flex list-disc flex-col gap-1 pl-4 text-sm text-[var(--text-muted)]">
                {item.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-[var(--border)] py-9" aria-labelledby="stack-heading">
        <h2
          id="stack-heading"
          className="mb-5 font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]"
        >
          {t.experience.skillsTitle}
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

      <section className="border-t border-[var(--border)] pt-9" aria-labelledby="edu-heading">
        <h2
          id="edu-heading"
          className="mb-5 font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]"
        >
          {t.experience.educationTitle}
        </h2>

        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {EDUCATION.map((edu) => (
            <li
              key={edu.degree}
              className="flex flex-col justify-between gap-1 text-sm sm:flex-row sm:items-baseline"
            >
              <span className="font-medium text-[var(--text)]">{edu.degree}</span>
              <span className="font-mono text-xs text-[var(--text-muted)]">{edu.school}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
