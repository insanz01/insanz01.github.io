import { STORE_ITEMS } from "../data/portfolio";
import { useLanguage } from "../i18n";

export function JualanPage() {
  const { t } = useLanguage();
  return (
    <>
      <section className="pb-8">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="inline-block h-3.5 w-1 bg-[var(--accent)]" aria-hidden="true" />
          <span className="font-mono text-xs font-medium tracking-widest text-[var(--text-muted)] uppercase">
            {t.jualan.eyebrow}
          </span>
        </div>
        <h1 className="font-display mb-2 text-[24px] font-bold tracking-tight sm:text-[28px]">
          {t.jualan.title}
        </h1>
        <p className="m-0 text-sm text-[var(--text-muted)]">{t.jualan.subtitle}</p>
      </section>

      <section className="border-t border-[var(--border)] py-9" aria-label="Daftar barang dagangan">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {STORE_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between gap-4 border border-[var(--border)] bg-[var(--surface-raised)] p-5 transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface)]"
            >
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="border border-[var(--border)] px-2 py-0.5 font-mono text-[11px] text-[var(--accent)]">
                    {item.platform}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-[var(--text-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]"
                  >
                    ↗
                  </span>
                </div>
                <h2 className="m-0 mb-1.5 text-[15px] font-semibold tracking-tight text-[var(--text)]">
                  {item.name}
                </h2>
                <p className="m-0 text-[13px] leading-snug text-[var(--text-muted)]">
                  {item.description}
                </p>
              </div>

              <span className="font-mono text-xs text-[var(--text-subtle)] transition-colors group-hover:text-[var(--text)]">
                {t.jualan.openAt} {item.platform} →
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
