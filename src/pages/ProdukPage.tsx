import { OWN_PRODUCTS } from "../data/portfolio";

export function ProdukPage() {
  return (
    <>
      <section className="pb-8">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="inline-block h-3.5 w-1 bg-[var(--accent)]" aria-hidden="true" />
          <span className="font-mono text-xs font-medium tracking-widest text-[var(--text-muted)] uppercase">
            Personal Products &amp; Services
          </span>
        </div>
        <h1 className="font-display mb-2 text-[24px] font-bold tracking-tight sm:text-[28px]">
          Produk
        </h1>
        <p className="m-0 text-sm text-[var(--text-muted)]">
          Produk digital dan layanan SaaS milik pribadi yang dibangun dan dikelola secara mandiri.
        </p>
      </section>

      <section className="border-t border-[var(--border)] py-9" aria-label="Daftar produk">
        <div className="grid grid-cols-1 gap-3">
          {OWN_PRODUCTS.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between gap-4 border border-[var(--border)] bg-[var(--surface-raised)] p-5 transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface)] sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                  <h2 className="m-0 text-base font-semibold tracking-tight text-[var(--text)]">
                    {item.name}
                  </h2>
                  <span className="border border-[var(--border)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-subtle)]">
                    {item.category}
                  </span>
                </div>
                <p className="m-0 mb-1 text-sm font-medium text-[var(--text)]">{item.tagline}</p>
                <p className="m-0 text-[13px] leading-relaxed text-[var(--text-muted)]">
                  {item.description}
                </p>
              </div>

              <span className="inline-flex shrink-0 items-center gap-1.5 border border-[var(--border-strong)] px-3 py-1.5 font-mono text-xs text-[var(--text)] transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
                Kunjungi <span aria-hidden="true">↗</span>
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
