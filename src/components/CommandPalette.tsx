import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PROFILE } from "../data/portfolio";
import { useLanguage } from "../i18n";

interface CommandItem {
  label: string;
  hint: string;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
}

export function CommandPalette({ open, onClose, onToggleTheme }: CommandPaletteProps) {
  const { lang, toggleLang } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const commands: CommandItem[] = [
    { label: "Go to Home", hint: "page", run: () => navigate("/") },
    { label: "Go to Projects", hint: "page", run: () => navigate("/projects") },
    { label: "Go to Coding Practice (HackerRank-style)", hint: "page", run: () => navigate("/practice") },
    { label: "Go to Experience & Stack", hint: "page", run: () => navigate("/experience") },
    { label: "Go to Private Mentoring", hint: "page", run: () => navigate("/mentoring") },
    { label: "Go to Produk (jualink.id)", hint: "page", run: () => navigate("/produk") },
    { label: "Go to Jualan (Tokopedia)", hint: "page", run: () => navigate("/jualan") },
    { label: "Go to Contact", hint: "page", run: () => navigate("/contact") },
    { label: "Open Mini-App: Terminal", hint: "app", run: () => navigate("/apps#terminal") },
    { label: "Open Mini-App: JS Puzzles (Grasshopper-style)", hint: "app", run: () => navigate("/apps#puzzle") },
    { label: "Open Mini-App: Dev Utils (JSON / JWT / Time)", hint: "app", run: () => navigate("/apps#utils") },
    { label: "Open Mini-App: Rate Limiter Simulator", hint: "app", run: () => navigate("/apps#ratelimit") },
    { label: "Open Mini-App: Markdown Scratchpad", hint: "app", run: () => navigate("/apps#markdown") },
    { label: "Toggle Light / Dark Theme", hint: "theme", run: onToggleTheme },
    {
      label: lang === "en" ? "Switch Language to Bahasa Indonesia" : "Switch Language to English",
      hint: "lang",
      run: toggleLang,
    },
    {
      label: `Copy Email (${PROFILE.email})`,
      hint: "action",
      run: () => navigator.clipboard?.writeText(PROFILE.email),
    },
    {
      label: "Open GitHub Profile",
      hint: "external",
      run: () => window.open(PROFILE.github, "_blank", "noopener,noreferrer"),
    },
  ];

  const filtered = commands.filter((c) => {
    const q = query.trim().toLowerCase();
    return !q || c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q);
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      setQuery("");
      setActiveIdx(0);
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function execute(item?: CommandItem) {
    if (!item) return;
    onClose();
    item.run();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-label="Command palette"
      className="mx-auto mt-[12vh] mb-auto w-[min(520px,calc(100vw-32px))] rounded-lg border border-[var(--border-strong)] bg-[var(--surface-raised)] p-0 text-[var(--text)] shadow-2xl backdrop:bg-black/35 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex items-center gap-2.5 border-b border-[var(--border)] px-3.5 py-3">
        <span className="font-mono text-[13px] text-[var(--text-subtle)]" aria-hidden="true">
          ⌘
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIdx(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" && filtered.length > 0) {
              e.preventDefault();
              setActiveIdx((i) => (i + 1) % filtered.length);
            } else if (e.key === "ArrowUp" && filtered.length > 0) {
              e.preventDefault();
              setActiveIdx((i) => (i - 1 + filtered.length) % filtered.length);
            } else if (e.key === "Enter") {
              e.preventDefault();
              execute(filtered[activeIdx]);
            }
          }}
          placeholder="Go to page, open mini-app, or toggle theme..."
          autoComplete="off"
          spellCheck={false}
          aria-label="Search commands"
          className="w-full border-none bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:outline-none"
        />
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10.5px] text-[var(--text-subtle)]"
        >
          ESC
        </button>
      </div>

      <ul className="m-0 max-h-[280px] list-none overflow-y-auto p-1.5" role="listbox" aria-label="Available commands">
        {filtered.length === 0 ? (
          <li className="px-2.5 py-4 text-center text-[13px] text-[var(--text-muted)]">
            No matching commands
          </li>
        ) : (
          filtered.map((item, idx) => (
            <li
              key={item.label}
              role="option"
              aria-selected={idx === activeIdx}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={() => execute(item)}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-[5px] px-2.5 py-2 text-[13.5px] ${
                idx === activeIdx ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]"
              }`}
            >
              <span>{item.label}</span>
              <span className="font-mono text-[11.5px] text-[var(--text-subtle)]">{item.hint}</span>
            </li>
          ))
        )}
      </ul>
    </dialog>
  );
}
