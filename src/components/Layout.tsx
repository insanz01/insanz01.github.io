import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
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

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
  icon: ReactNode;
}

const PROFILE_NAV: NavItem[] = [
  {
    to: "/",
    label: "Overview",
    end: true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
  {
    to: "/projects",
    label: "Projects",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    to: "/experience",
    label: "Experience",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="1" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    to: "/mentoring",
    label: "Mentoring",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: "/contact",
    label: "Contact",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="1" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

const WORKBENCH_NAV: NavItem[] = [
  {
    to: "/apps",
    label: "Mini Apps",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    to: "/practice",
    label: "Coding Practice",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

export function Layout({ children, theme, onToggleTheme }: LayoutProps) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("kamil_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    try {
      localStorage.setItem("kamil_sidebar_collapsed", String(collapsed));
    } catch {
      // ignore storage errors
    }
  }, [collapsed]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      } else if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const navLinkClass = (isActive: boolean, isCollapsed: boolean) =>
    `flex items-center gap-2.5 border-l-2 py-1.5 text-[13.5px] transition-colors ${
      isCollapsed ? "justify-center px-0" : "pl-3 pr-2"
    } ${
      isActive
        ? "border-[var(--accent)] bg-[var(--surface)] font-medium text-[var(--text)]"
        : "border-transparent text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]"
    }`;

  const renderNavGroups = (isCollapsed: boolean) => (
    <div className="flex flex-col gap-6">
      <div>
        {!isCollapsed && (
          <p className="mb-2 pl-3 font-mono text-[10.5px] tracking-widest text-[var(--text-subtle)] uppercase">
            Profile
          </p>
        )}
        <nav className="flex flex-col gap-0.5" aria-label="Profile navigation">
          {PROFILE_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) => navLinkClass(isActive, isCollapsed)}
            >
              <span className="shrink-0">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div>
        {!isCollapsed && (
          <p className="mb-2 pl-3 font-mono text-[10.5px] tracking-widest text-[var(--text-subtle)] uppercase">
            Workbench
          </p>
        )}
        <nav className="flex flex-col gap-0.5" aria-label="Workbench navigation">
          {WORKBENCH_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) => navLinkClass(isActive, isCollapsed)}
            >
              <span className="shrink-0">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      <a
        href="#main"
        className="fixed -left-[9999px] top-0 z-50 bg-[var(--accent)] px-3.5 py-2 text-[13px] font-semibold text-[#090D0C] focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <div
        className={`grid min-h-screen w-full grid-cols-1 ${
          collapsed ? "lg:grid-cols-[64px_1fr]" : "lg:grid-cols-[260px_1fr]"
        }`}
      >
        {/* Desktop Collapsible Left Sidebar */}
        <aside
          className={`hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:border-r lg:border-[var(--border)] lg:py-10 ${
            collapsed ? "lg:items-center lg:px-2" : "lg:px-6"
          }`}
        >
          <div className="w-full">
            <div
              className={`mb-8 flex items-start ${
                collapsed ? "justify-center" : "justify-between gap-2"
              }`}
            >
              {!collapsed && (
                <div>
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="inline-block h-4 w-1 bg-[var(--accent)]" aria-hidden="true" />
                    <Link
                      to="/"
                      className="font-display text-sm font-bold tracking-tight uppercase text-[var(--text)]"
                    >
                      {PROFILE.shortName}
                    </Link>
                  </div>
                  <p className="m-0 font-mono text-[11px] leading-snug text-[var(--text-muted)]">
                    {PROFILE.role}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center border border-[var(--border)] bg-transparent text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="1" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
              </button>
            </div>

            {renderNavGroups(collapsed)}
          </div>

          <div className={`flex w-full flex-col gap-3 border-t border-[var(--border)] pt-5 ${collapsed ? "items-center" : ""}`}>
            <div className={`flex items-center gap-2 ${collapsed ? "flex-col" : ""}`}>
              <button
                type="button"
                onClick={() => setCmdOpen(true)}
                aria-label="Open command palette"
                title="Command Palette (⌘K / Ctrl+K)"
                className={`inline-flex h-8 cursor-pointer items-center border border-[var(--border)] bg-transparent font-mono text-[11.5px] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)] ${
                  collapsed ? "w-8 justify-center px-0" : "flex-1 justify-between px-2.5"
                }`}
              >
                {!collapsed && <span>Search</span>}
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

            {!collapsed && (
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
            )}
          </div>
        </aside>

        {/* Mobile Top Header */}
        <header className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 sm:px-6 lg:hidden">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation sidebar"
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center border border-[var(--border)] text-[var(--text)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span className="inline-block h-4 w-1 bg-[var(--accent)]" aria-hidden="true" />
            <Link to="/" className="font-display text-sm font-bold tracking-tight uppercase">
              {PROFILE.shortName}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              aria-label="Open command palette"
              className="inline-flex h-8 cursor-pointer items-center border border-[var(--border)] px-2 font-mono text-[11px] text-[var(--text-muted)]"
            >
              ⌘K
            </button>
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle color theme"
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center border border-[var(--border)] text-[var(--text-muted)]"
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
          </div>
        </header>

        {/* Mobile Slide-Over Sidebar Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-[1px]"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative z-10 flex h-full w-[260px] flex-col justify-between border-r border-[var(--border)] bg-[var(--bg)] p-6">
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-4 w-1 bg-[var(--accent)]" aria-hidden="true" />
                    <span className="font-display text-sm font-bold tracking-tight uppercase">
                      {PROFILE.shortName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close navigation sidebar"
                    className="inline-flex h-7 w-7 cursor-pointer items-center justify-center border border-[var(--border)] font-mono text-xs text-[var(--text-muted)]"
                  >
                    ×
                  </button>
                </div>
                {renderNavGroups(false)}
              </div>

              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 font-mono text-xs text-[var(--text-muted)]">
                <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
                  GitHub ↗
                </a>
                <a href={`mailto:${PROFILE.email}`}>Email ↗</a>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Column */}
        <div className="flex min-w-0 flex-col justify-between px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
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
