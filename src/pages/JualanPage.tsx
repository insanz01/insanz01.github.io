import { useMemo, useState } from "react";
import { STORE_ITEMS } from "../data/portfolio";
import { useLanguage } from "../i18n";

export function JualanPage() {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(STORE_ITEMS.map((item) => item.category)));
    return ["ALL", ...unique];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STORE_ITEMS.filter((item) => {
      const matchCat = category === "ALL" || item.category === category;
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, category]);

  return (
    <>
      <section className="pb-6">
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

      <section className="border-t border-[var(--border)] py-8" aria-label="Daftar barang dagangan">
        {/* Search & Category Filter */}
        <div className="mb-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === "id" ? "Cari barang..." : "Search items..."}
              aria-label={lang === "id" ? "Cari barang" : "Search items"}
              className="w-full border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:border-[var(--border-strong)] focus:outline-none"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label={lang === "id" ? "Filter kategori" : "Filter category"}
            className="cursor-pointer border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 font-mono text-xs text-[var(--text)] focus:border-[var(--border-strong)] focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "ALL"
                  ? lang === "id"
                    ? `Kategori: Semua (${STORE_ITEMS.length})`
                    : `Category: All (${STORE_ITEMS.length})`
                  : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="border border-[var(--border)] bg-[var(--surface-raised)] p-8 text-center font-mono text-xs text-[var(--text-muted)]">
            {lang === "id" ? "Barang tidak ditemukan." : "No matching items."}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden border border-[var(--border)] bg-[var(--surface-raised)] transition-colors hover:border-[var(--accent)]"
              >
                {/* Preview Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-[var(--border)] bg-[var(--surface)]">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <span className="absolute top-2.5 left-2.5 border border-[var(--border-strong)] bg-[var(--bg)]/90 px-2 py-0.5 font-mono text-[11px] font-medium text-[var(--text)]">
                    {item.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                  <div>
                    <h2 className="m-0 mb-1 text-[15px] font-semibold leading-snug tracking-tight text-[var(--text)]">
                      {item.name}
                    </h2>
                    <p className="m-0 mb-2 font-mono text-[11px] text-[var(--text-subtle)]">
                      {item.platform}
                    </p>
                    <p className="m-0 line-clamp-2 text-[13px] leading-snug text-[var(--text-muted)]">
                      {item.description}
                    </p>
                  </div>

                  <span className="inline-flex w-full items-center justify-center gap-1.5 border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 font-mono text-xs font-medium text-[var(--text)] transition-colors group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[#090D0C]">
                    {lang === "id" ? "Lihat Produk" : "View Product"}{" "}
                    <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
