import { useEffect, useState } from "react";
import { PROFILE } from "../../data/portfolio";

const STORAGE_KEY = "kamil_portfolio_md";
const DEFAULT_MD = `# Quick Notes

A lightweight **Markdown scratchpad** saved locally in your browser.

## Try editing
- Supports \`inline code\`, **bold**, and *italic*
- Safe link rendering like [GitHub](${PROFILE.github})

> Simplicity is prerequisite for reliability.

\`\`\`js
const greet = (name) => \`Hello, \${name}\`;
\`\`\``;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInline(escaped: string): string {
  return escaped
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text: string, url: string) => {
      const cleanUrl = url.trim();
      if (/^(https?:\/\/|mailto:)/i.test(cleanUrl)) {
        return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      }
      return text;
    });
}

function renderMarkdown(src: string): string {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let inCode = false;
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      closeList();
      if (!inCode) {
        inCode = true;
        html.push("<pre><code>");
      } else {
        inCode = false;
        html.push("</code></pre>");
      }
      continue;
    }

    if (inCode) {
      html.push(`${escapeHtml(line)}\n`);
      continue;
    }

    const escaped = escapeHtml(line);
    if (/^###\s+/.test(line)) {
      closeList();
      html.push(`<h3>${formatInline(escaped.replace(/^###\s+/, ""))}</h3>`);
    } else if (/^##\s+/.test(line)) {
      closeList();
      html.push(`<h2>${formatInline(escaped.replace(/^##\s+/, ""))}</h2>`);
    } else if (/^#\s+/.test(line)) {
      closeList();
      html.push(`<h1>${formatInline(escaped.replace(/^#\s+/, ""))}</h1>`);
    } else if (/^>\s+/.test(line)) {
      closeList();
      html.push(`<blockquote>${formatInline(escaped.replace(/^&gt;\s+/, ""))}</blockquote>`);
    } else if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        inList = true;
        html.push("<ul>");
      }
      html.push(`<li>${formatInline(escaped.replace(/^[-*]\s+/, ""))}</li>`);
    } else if (line.trim() === "") {
      closeList();
    } else {
      closeList();
      html.push(`<p>${formatInline(escaped)}</p>`);
    }
  }

  closeList();
  if (inCode) html.push("</code></pre>");
  return html.join("");
}

export function MarkdownApp() {
  const [text, setText] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_MD;
    } catch {
      return DEFAULT_MD;
    }
  });
  const [mode, setMode] = useState<"split" | "edit" | "preview">("split");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, text);
    } catch {
      // ignore storage errors
    }
  }, [text]);

  const btnBase =
    "cursor-pointer rounded border px-2.5 py-1 text-xs font-medium transition-colors";

  return (
    <div>
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2.5">
        <span className="text-[12.5px] text-[var(--text-muted)]">
          Auto-saved to browser storage
        </span>

        <div className="flex flex-wrap gap-1.5">
          {(["split", "edit", "preview"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`${btnBase} capitalize ${
                mode === m
                  ? "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)]"
                  : "border-[var(--border)] bg-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {m}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(text).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1400);
              });
            }}
            className={`${btnBase} border-[var(--border)] bg-transparent text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]`}
          >
            {copied ? "Copied" : "Copy MD"}
          </button>
          <button
            type="button"
            onClick={() => setText(DEFAULT_MD)}
            className={`${btnBase} border-[var(--border)] bg-transparent text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]`}
          >
            Reset
          </button>
        </div>
      </div>

      <div
        className={`grid gap-3 ${
          mode === "split" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {mode !== "preview" && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            spellCheck={false}
            aria-label="Markdown editor"
            className="min-h-[240px] w-full resize-y rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-[var(--text)] focus:border-[var(--border-strong)] focus:outline-none"
          />
        )}

        {mode !== "edit" && (
          <div
            aria-label="Markdown preview"
            className="md-preview max-h-[320px] min-h-[240px] overflow-y-auto rounded border border-[var(--border)] bg-[var(--bg)] px-3.5 py-3 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
          />
        )}
      </div>
    </div>
  );
}
