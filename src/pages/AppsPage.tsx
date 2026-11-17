import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ThemeMode } from "../components/Layout";
import { DevUtilsApp } from "../components/apps/DevUtilsApp";
import { MarkdownApp } from "../components/apps/MarkdownApp";
import { RateLimiterApp } from "../components/apps/RateLimiterApp";
import { TerminalApp } from "../components/apps/TerminalApp";
import { CodePuzzleApp } from "../components/apps/CodePuzzleApp";

type AppTab = "terminal" | "puzzle" | "utils" | "ratelimit" | "markdown";

const TABS: { id: AppTab; label: string }[] = [
  { id: "terminal", label: "Terminal" },
  { id: "puzzle", label: "JS Puzzles" },
  { id: "utils", label: "Dev Utils" },
  { id: "ratelimit", label: "Rate Limiter" },
  { id: "markdown", label: "Markdown" },
];

interface AppsPageProps {
  onSetTheme: (mode?: ThemeMode) => void;
}

export function AppsPage({ onSetTheme }: AppsPageProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const resolveHash = (hash: string): AppTab => {
    const clean = hash.replace(/^#/, "") as AppTab;
    return TABS.some((t) => t.id === clean) ? clean : "terminal";
  };

  const [activeTab, setActiveTab] = useState<AppTab>(() => resolveHash(location.hash));

  useEffect(() => {
    setActiveTab(resolveHash(location.hash));
  }, [location.hash]);

  function switchTab(tab: AppTab) {
    setActiveTab(tab);
    navigate(`/apps#${tab}`, { replace: true });
  }

  return (
    <>
      <section className="pb-10">
        <h1 className="mb-2 text-[22px] font-semibold tracking-tight">Playground · Mini Apps</h1>
        <p className="m-0 text-[var(--text-muted)]">
          Small, practical tools running entirely in your browser with zero backend or tracking.
        </p>
      </section>

      <section className="border-t border-[var(--border)] py-10" aria-label="Mini Applications">
        <div className="overflow-hidden rounded-[6px] border border-[var(--border)] bg-[var(--surface-raised)]">
          <div
            className="flex flex-wrap gap-1 border-b border-[var(--border)] bg-[var(--surface)] p-2"
            role="tablist"
            aria-label="Interactive mini applications"
          >
            {TABS.map((tab, idx) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => switchTab(tab.id)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      const dir = e.key === "ArrowRight" ? 1 : -1;
                      const next = TABS[(idx + dir + TABS.length) % TABS.length];
                      switchTab(next.id);
                    }
                  }}
                  className={`cursor-pointer rounded-[2px] px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
                    selected
                      ? "border border-[var(--border-strong)] bg-[var(--surface-raised)] text-[var(--accent)]"
                      : "border border-transparent bg-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-4" role="tabpanel">
            {activeTab === "terminal" && (
              <TerminalApp onSwitchTab={switchTab} onSetTheme={onSetTheme} />
            )}
            {activeTab === "puzzle" && <CodePuzzleApp />}
            {activeTab === "utils" && <DevUtilsApp />}
            {activeTab === "ratelimit" && <RateLimiterApp />}
            {activeTab === "markdown" && <MarkdownApp />}
          </div>
        </div>
      </section>
    </>
  );
}
