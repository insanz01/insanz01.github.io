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

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-150 hover:text-[var(--text)] ${
      isActive ? "font-medium text-[var(--text)]" : "text-[var(--text-muted)]"
    }`;

  return (
    <>
      <a
        href="#main"
        className="fixed -left-[9999px] top-0 z-50 bg-[var(--text)] px-3.5 py-2 text-[13px] font-medium text-[var(--bg)] focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <div className="mx-auto max-w-[740px] px-5 pt-10 pb-16 sm:px-6 sm:pt-16 sm:pb-20">
        <header className="flex flex-col items-start justify-between gap-4 pb-9 sm:flex-row sm:gap-6 sm:pb-12">
          <div>
            <Link to="/" className="inline-block text-base font-semibold tracking-tight">
              {PROFILE.name}
            </Link>
            <p className="mt-0.5 text-[13.5px] text-[var(--text-muted)]">
              {PROFILE.role} · {PROFILE.location}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-[13.5px]" aria-label="Primary">
            <NavLink to="/projects" className={navClass}>
              Projects
            </NavLink>
            <NavLink to="/apps" className={navClass}>
              Apps
            </NavLink>
            <NavLink to="/experience" className={navClass}>
              Experience
            </NavLink>
            <NavLink to="/contact" className={navClass}>
              Contact
            </NavLink>

            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              aria-label="Open command palette"
              title="Command Palette (⌘K / Ctrl+K)"
              className="inline-flex h-[30px] cursor-pointer items-center justify-center rounded-[6px] border border-[var(--border)] bg-transparent px-2 text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
            >
              <span className="font-mono text-[11.5px] leading-none">⌘K</span>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle color theme"
              aria-pressed={theme === "dark"}
              title="Toggle color theme"
              className="inline-flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[6px] border border-[var(--border)] bg-transparent text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
            >
              {theme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>
          </nav>
        </header>

        <main id="main">{children}</main>

        <footer className="flex flex-col items-start justify-between gap-1.5 border-t border-[var(--border)] pt-8 text-[12.5px] text-[var(--text-subtle)] sm:flex-row sm:items-center sm:gap-4">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <span>Built with React, TypeScript &amp; Tailwind CSS</span>
        </footer>
      </div>

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onToggleTheme={onToggleTheme}
      />
    </>
  );
}
