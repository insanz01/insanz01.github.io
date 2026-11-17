import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { PROFILE } from "../data/portfolio";
import { CommandPalette } from "./CommandPalette";

export type ThemeMode = "light" | "dark";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  });

  const setTheme = (mode?: ThemeMode) => {
    setThemeState((prev) => {
      const next = mode ?? (prev === "dark" ? "light" : "dark");
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  return { theme, setTheme };
}

interface LayoutProps {
  children: ReactNode;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

const NAV_ITEMS = [
  { to: "/", label: "Overview", end: true },
  { to: "/projects", label: "Projects" },
  { to: "/apps", label: "Apps" },
  { to: "/practice", label: "Practice" },
  { to: "/experience", label: "Experience" },
  { to: "/contact", label: "Contact" },
];

export function Layout({ children, theme, onToggleTheme }: LayoutProps) {
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const sideNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between border-l-2 py-1.5 pl-3 text-[13.5px] transition-colors ${
      isActive
        ? "border-[var(--accent)] font-medium text-[var(--text)]"
        : "border-transparent text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]"
    }`;

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap px-1 py-1 text-[13px] transition-colors ${
      isActive ? "font-medium text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"
    }`;

  return (
    <>
      <a
        href="#main"
        className="fixed -left-[9999px] top-0 z-50 bg-[var(--accent)] px-3.5 py-2 text-[13px] font-semibold text-[#090D0C] focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <div className="mx-auto grid min-h-screen max-w-[1040px] grid-cols-1 px-5 sm:px-6 lg:grid-cols-[248px_1fr]">
        {/* Desktop Left Sidebar */}
        <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:border-r lg:border-[var(--border)] lg:py-12 lg:pr-8">
          <div>
            <div className="mb-8">
              <div className="mb-2 flex items-center gap-2.5">
                <span className="inline-block h-4 w-1 bg-[var(--accent)]" aria-hidden="true" />
                <Link
                  to="/"
                  className="font-display text-sm font-bold tracking-tight uppercase text-[var(--text)]"
                >
                  {PROFILE.shortName}
                </Link>
              </div>
              <p className="m-0 font-mono text-[11.5px] leading-snug text-[var(--text-muted)]">
                {PROFILE.role}
              </p>
              <p className="mt-1 font-mono text-[11px] text-[var(--text-subtle)]">
                {PROFILE.location}
              </p>
            </div>

            <nav className="flex flex-col gap-1" aria-label="Primary">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={sideNavClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCmdOpen(true)}
                aria-label="Open command palette"
                title="Command Palette (⌘K / Ctrl+K)"
                className="inline-flex h-8 flex-1 cursor-pointer items-center justify-between border border-[var(--border)] bg-transparent px-2.5 font-mono text-[11.5px] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
              >
                <span>Search</span>
                <span>⌘K</span>
              </button>

              <button
                type="button"
                onClick={onToggleTheme}
                aria-label="Toggle color theme"
                aria-pressed={theme === "dark"}
                title="Toggle color theme"
                className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center border border-[var(--border)] bg-transparent text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
              >
                {theme === "dark" ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] text-[var(--text-subtle)]">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[var(--text)]"
              >
                GitHub ↗
              </a>
              <a
                href={`mailto:${PROFILE.email}`}
                className="transition-colors hover:text-[var(--text)]"
              >
                Email ↗
              </a>
            </div>
          </div>
        </aside>

        {/* Mobile Top Header */}
        <header className="border-b border-[var(--border)] py-5 lg:hidden">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-block h-4 w-1 bg-[var(--accent)]" aria-hidden="true" />
              <div>
                <Link to="/" className="font-display text-sm font-bold tracking-tight uppercase">
                  {PROFILE.shortName}
                </Link>
                <p className="m-0 font-mono text-[11px] text-[var(--text-muted)]">
                  {PROFILE.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCmdOpen(true)}
                aria-label="Open command palette"
                className="inline-flex h-7 cursor-pointer items-center border border-[var(--border)] px-2 font-mono text-[11px] text-[var(--text-muted)]"
              >
                ⌘K
              </button>
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label="Toggle color theme"
                className="inline-flex h-7 w-7 cursor-pointer items-center justify-center border border-[var(--border)] text-[var(--text-muted)]"
              >
                {theme === "dark" ? "☀" : "☾"}
              </button>
            </div>
          </div>

          <nav className="flex flex-wrap gap-3" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={mobileNavClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        {/* Main Content Column */}
        <div className="flex min-w-0 flex-col justify-between py-8 lg:py-12 lg:pl-12">
          <main id="main" className="min-w-0">
            {children}
          </main>

          <footer className="mt-10 flex flex-col items-start justify-between gap-1.5 border-t border-[var(--border)] pt-7 text-[12px] text-[var(--text-muted)] sm:flex-row sm:items-center sm:gap-4">
            <span>© {new Date().getFullYear()} {PROFILE.name} · insanz01.github.io</span>
            <span className="font-mono text-[11px] tracking-wider text-[var(--text-subtle)]">
              BACKEND · ARCHITECTURE · TECH LEAD
            </span>
          </footer>
        </div>
      </div>

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onToggleTheme={onToggleTheme}
      />
    </>
  );
}
