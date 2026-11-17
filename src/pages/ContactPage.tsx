import { useState } from "react";
import { PROFILE } from "../data/portfolio";

export function ContactPage() {
  const [copied, setCopied] = useState(false);

  return (
    <>
      <section className="pb-8">
        <h1 className="mb-2 text-[22px] font-semibold tracking-tight">Contact</h1>
        <p className="m-0 text-[var(--text-muted)]">
          Open to Senior Backend, Tech Lead, and system architecture collaborations. Based in{" "}
          {PROFILE.location}.
        </p>
      </section>

      <section className="border-t border-[var(--border)] py-9" aria-label="Direct contact">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${PROFILE.email}`}
            className="border-b border-[var(--border-strong)] pb-0.5 font-mono text-[13.5px] transition-colors hover:border-[var(--accent)]"
          >
            {PROFILE.email}
          </a>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(PROFILE.email).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              });
            }}
            className="cursor-pointer border border-[var(--border)] bg-transparent px-2.5 py-1 text-[12.5px] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
          >
            {copied ? "Copied" : "Copy email"}
          </button>
        </div>

        <ul className="m-0 flex list-none flex-wrap gap-5 p-0 text-[13.5px] text-[var(--text-muted)]">
          <li>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--accent)]"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--accent)]"
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}
