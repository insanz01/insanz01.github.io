import { useEffect, useRef, useState } from "react";
import { EXPERIENCE, PROFILE, PROJECTS, STACK } from "../../data/portfolio";
import type { ThemeMode } from "../Layout";

interface TermLine {
  id: number;
  text: string;
  variant: "cmd" | "muted" | "err";
}

interface TerminalAppProps {
  onSwitchTab: (tab: "terminal" | "puzzle" | "utils" | "ratelimit" | "markdown") => void;
  onSetTheme: (mode?: ThemeMode) => void;
}

export function TerminalApp({ onSwitchTab, onSetTheme }: TerminalAppProps) {
  const [lines, setLines] = useState<TermLine[]>([
    {
      id: 1,
      text: `Welcome to ${PROFILE.name}'s interactive shell. Type 'help' to begin.`,
      variant: "muted",
    },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const seqRef = useRef(2);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  function pushLine(text: string, variant: TermLine["variant"]) {
    const id = seqRef.current++;
    setLines((prev) => [...prev, { id, text, variant }]);
  }

  function runCommand(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    setHistory((prev) => [trimmed, ...prev]);
    setHistoryIdx(-1);
    pushLine(`kamil@web:~$ ${trimmed}`, "cmd");

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ").toLowerCase();

    switch (cmd) {
      case "help":
        pushLine(
          "Commands: whoami, projects, experience, stack, contact, theme [light|dark], open [puzzle|utils|ratelimit|markdown], date, clear",
          "muted"
        );
        break;
      case "whoami":
        pushLine(`${PROFILE.name} — ${PROFILE.role} (Full-Stack) based in ${PROFILE.location}.`, "muted");
        break;
      case "projects":
        pushLine(
          PROJECTS.map((p, i) => `${i + 1}. ${p.title} (${p.stack})`).join("\n"),
          "muted"
        );
        break;
      case "experience":
        pushLine(
          EXPERIENCE.map((e) => `${e.period}  ${e.role} @ ${e.company}`).join("\n"),
          "muted"
        );
        break;
      case "stack":
        pushLine(STACK.map((s) => `${s.label}: ${s.items}`).join("\n"), "muted");
        break;
      case "contact":
        pushLine(`Email:  ${PROFILE.email}\nGitHub: ${PROFILE.github}`, "muted");
        break;
      case "date":
        pushLine(new Date().toString(), "muted");
        break;
      case "theme":
        if (arg === "light" || arg === "dark") {
          onSetTheme(arg);
          pushLine(`Theme set to ${arg}.`, "muted");
        } else {
          onSetTheme();
          pushLine("Toggled color theme.", "muted");
        }
        break;
      case "open":
        if (
          arg === "puzzle" ||
          arg === "utils" ||
          arg === "ratelimit" ||
          arg === "markdown" ||
          arg === "terminal"
        ) {
          onSwitchTab(arg);
          pushLine(`Switched to ${arg}.`, "muted");
        } else {
          pushLine("Usage: open [puzzle | utils | ratelimit | markdown]", "err");
        }
        break;
      case "clear":
        setLines([]);
        break;
      default:
        pushLine(`Command not found: ${cmd}. Try 'help'.`, "err");
    }
  }

  return (
    <div>
      <div className="rounded border border-[var(--border)] bg-[var(--bg)] px-3.5 py-3 font-mono text-[12.5px] leading-relaxed">
        <div
          ref={outputRef}
          aria-live="polite"
          className="mb-2 flex max-h-[240px] flex-col gap-1.5 overflow-y-auto"
        >
          {lines.map((line) => (
            <div
              key={line.id}
              className={`whitespace-pre-wrap break-words ${
                line.variant === "cmd"
                  ? "text-[var(--text)]"
                  : line.variant === "err"
                  ? "text-[var(--err)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              {line.text}
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const val = input;
            setInput("");
            runCommand(val);
          }}
          className="flex items-center gap-2"
          autoComplete="off"
        >
          <label htmlFor="terminal-input" className="sr-only">
            Terminal command
          </label>
          <span className="shrink-0 text-[var(--text-subtle)]" aria-hidden="true">
            kamil@web:~$
          </span>
          <input
            ref={inputRef}
            id="terminal-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                if (historyIdx + 1 < history.length) {
                  const next = historyIdx + 1;
                  setHistoryIdx(next);
                  setInput(history[next]);
                }
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                if (historyIdx > 0) {
                  const next = historyIdx - 1;
                  setHistoryIdx(next);
                  setInput(history[next]);
                } else {
                  setHistoryIdx(-1);
                  setInput("");
                }
              }
            }}
            placeholder="Type 'help' and press Enter..."
            spellCheck={false}
            className="w-full border-none bg-transparent py-0.5 font-mono text-[12.5px] text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:outline-none"
          />
        </form>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Quick commands">
        {["help", "whoami", "projects", "stack", "contact", "clear"].map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => {
              runCommand(cmd);
              inputRef.current?.focus();
            }}
            className="cursor-pointer rounded border border-[var(--border)] bg-transparent px-2 py-0.5 font-mono text-[11.5px] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
