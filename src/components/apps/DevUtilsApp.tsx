import { useEffect, useState } from "react";

type UtilTab = "json" | "jwt" | "time";

function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) base64 += "====".slice(pad);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

const btnClass =
  "cursor-pointer rounded border border-[var(--border)] bg-transparent px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]";

export function DevUtilsApp() {
  const [util, setUtil] = useState<UtilTab>("json");

  // JSON state
  const [jsonText, setJsonText] = useState("");
  const [jsonStatus, setJsonStatus] = useState<{ msg: string; state: "" | "ok" | "err" }>({
    msg: "Ready",
    state: "",
  });

  // JWT state
  const [jwtText, setJwtText] = useState("");

  // Timestamp state
  const [liveEpoch, setLiveEpoch] = useState(() => Math.floor(Date.now() / 1000));
  const [unixInput, setUnixInput] = useState("");
  const [isoInput, setIsoInput] = useState("");
  const [localLabel, setLocalLabel] = useState("Local: —");

  useEffect(() => {
    const id = setInterval(() => setLiveEpoch(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  function processJson(indent: number) {
    const raw = jsonText.trim();
    if (!raw) {
      setJsonStatus({ msg: "Input is empty", state: "" });
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setJsonText(JSON.stringify(parsed, null, indent));
      setJsonStatus({
        msg: indent ? "Valid JSON · Formatted" : "Valid JSON · Minified",
        state: "ok",
      });
    } catch (err) {
      setJsonStatus({
        msg: `Invalid JSON: ${err instanceof Error ? err.message : "Parse error"}`,
        state: "err",
      });
    }
  }

  // Decode JWT derived state
  let jwtHeader = "—";
  let jwtPayload = "—";
  let jwtExp: { text: string; state: "" | "ok" | "err" } = { text: "", state: "" };

  if (jwtText.trim()) {
    const parts = jwtText.trim().split(".");
    if (parts.length < 2) {
      jwtHeader = "Invalid JWT format (expected 3 dot-separated parts)";
    } else {
      try {
        const h = JSON.parse(decodeBase64Url(parts[0]));
        const p = JSON.parse(decodeBase64Url(parts[1]));
        jwtHeader = JSON.stringify(h, null, 2);
        jwtPayload = JSON.stringify(p, null, 2);
        if (typeof p.exp === "number") {
          const isExpired = p.exp * 1000 < Date.now();
          jwtExp = { text: isExpired ? "Expired" : "Valid", state: isExpired ? "err" : "ok" };
        } else {
          jwtExp = { text: "No exp", state: "" };
        }
      } catch (err) {
        jwtHeader = "Failed to decode JWT";
        jwtPayload = err instanceof Error ? err.message : "Decode error";
      }
    }
  }

  return (
    <div>
      <div className="mb-3.5 flex gap-1.5" role="tablist" aria-label="Developer utilities">
        {(
          [
            ["json", "JSON"],
            ["jwt", "JWT Decoder"],
            ["time", "Timestamp"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setUtil(id)}
            aria-pressed={util === id}
            className={`cursor-pointer rounded border px-2.5 py-1 font-mono text-xs transition-colors ${
              util === id
                ? "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)]"
                : "border-[var(--border)] bg-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {util === "json" && (
        <div>
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2.5">
            <span className="text-[12.5px] text-[var(--text-muted)]">
              Format, minify &amp; validate JSON
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                className={btnClass}
                onClick={() => {
                  setJsonText(
                    JSON.stringify(
                      {
                        engineer: "Insan Kamil",
                        stack: ["TypeScript", "React", "Go"],
                        available: true,
                      },
                      null,
                      2
                    )
                  );
                  setJsonStatus({ msg: "Sample loaded · Valid JSON", state: "ok" });
                }}
              >
                Sample
              </button>
              <button type="button" className={btnClass} onClick={() => processJson(2)}>
                Format
              </button>
              <button type="button" className={btnClass} onClick={() => processJson(0)}>
                Minify
              </button>
              <button
                type="button"
                className={btnClass}
                onClick={() => {
                  if (!jsonText) return;
                  navigator.clipboard?.writeText(jsonText).then(() => {
                    setJsonStatus({ msg: "Copied to clipboard", state: "ok" });
                  });
                }}
              >
                Copy
              </button>
            </div>
          </div>

          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={8}
            placeholder='{"name": "Insan Kamil", "role": "Software Engineer"}'
            spellCheck={false}
            aria-label="JSON input"
            className="w-full resize-y rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-[var(--text)] focus:border-[var(--border-strong)] focus:outline-none"
          />
          <p
            aria-live="polite"
            className={`mt-2 font-mono text-xs ${
              jsonStatus.state === "ok"
                ? "text-[var(--ok)]"
                : jsonStatus.state === "err"
                ? "text-[var(--err)]"
                : "text-[var(--text-muted)]"
            }`}
          >
            {jsonStatus.msg}
          </p>
        </div>
      )}

      {util === "jwt" && (
        <div>
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2.5">
            <span className="text-[12.5px] text-[var(--text-muted)]">
              Inspect JWT header &amp; payload locally
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                className={btnClass}
                onClick={() =>
                  setJwtText(
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
                      "eyJzdWIiOiJpbnNhbnowMSIsIm5hbWUiOiJJbnNhbiBLYW1pbCIsInJvbGUiOiJlbmdpbmVlciIsImV4cCI6MTg5MzQ1NjAwMH0." +
                      "dGVzdC1zaWduYXR1cmU"
                  )
                }
              >
                Sample
              </button>
              <button type="button" className={btnClass} onClick={() => setJwtText("")}>
                Clear
              </button>
            </div>
          </div>

          <textarea
            value={jwtText}
            onChange={(e) => setJwtText(e.target.value)}
            rows={3}
            placeholder="Paste a JWT (eyJ...) to decode header and claims"
            spellCheck={false}
            aria-label="JWT token input"
            className="w-full resize-y rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-[var(--text)] focus:border-[var(--border-strong)] focus:outline-none"
          />

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <span className="mb-1.5 block font-mono text-[11.5px] text-[var(--text-subtle)]">
                Header
              </span>
              <pre className="m-0 max-h-[200px] min-h-[110px] overflow-auto whitespace-pre-wrap break-words rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 font-mono text-xs leading-normal">
                {jwtHeader}
              </pre>
            </div>
            <div>
              <span className="mb-1.5 flex items-center justify-between font-mono text-[11.5px] text-[var(--text-subtle)]">
                <span>Payload</span>
                {jwtExp.text && (
                  <span
                    className={`text-[11px] ${
                      jwtExp.state === "ok"
                        ? "text-[var(--ok)]"
                        : jwtExp.state === "err"
                        ? "text-[var(--err)]"
                        : ""
                    }`}
                  >
                    {jwtExp.text}
                  </span>
                )}
              </span>
              <pre className="m-0 max-h-[200px] min-h-[110px] overflow-auto whitespace-pre-wrap break-words rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 font-mono text-xs leading-normal">
                {jwtPayload}
              </pre>
            </div>
          </div>
        </div>
      )}

      {util === "time" && (
        <div>
          <div className="mb-3.5 flex flex-wrap items-center gap-2.5 text-[13px] text-[var(--text-muted)]">
            <span>Current Unix Epoch:</span>
            <code className="font-mono text-[13px] tabular-nums text-[var(--text)]">{liveEpoch}</code>
            <button
              type="button"
              className={btnClass}
              onClick={() => {
                const now = new Date();
                setUnixInput(String(Math.floor(now.getTime() / 1000)));
                setIsoInput(now.toISOString());
                setLocalLabel(`Local: ${now.toLocaleString()}`);
              }}
            >
              Use now
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="time-unix" className="text-xs text-[var(--text-muted)]">
                Unix Timestamp (s or ms)
              </label>
              <input
                id="time-unix"
                type="text"
                value={unixInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setUnixInput(val);
                  const raw = val.trim();
                  if (!raw) return;
                  const num = Number(raw);
                  if (Number.isNaN(num)) {
                    setLocalLabel("Local: Invalid Unix timestamp");
                    return;
                  }
                  const ms = Math.abs(num) < 1e12 ? num * 1000 : num;
                  const d = new Date(ms);
                  if (Number.isNaN(d.getTime())) {
                    setLocalLabel("Local: Invalid date");
                  } else {
                    setIsoInput(d.toISOString());
                    setLocalLabel(`Local: ${d.toLocaleString()}`);
                  }
                }}
                placeholder="e.g. 1763385600"
                spellCheck={false}
                className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-[12.5px] text-[var(--text)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="time-iso" className="text-xs text-[var(--text-muted)]">
                ISO 8601 (UTC)
              </label>
              <input
                id="time-iso"
                type="text"
                value={isoInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setIsoInput(val);
                  const raw = val.trim();
                  if (!raw) return;
                  const d = new Date(raw);
                  if (Number.isNaN(d.getTime())) {
                    setLocalLabel("Local: Invalid date");
                  } else {
                    setUnixInput(String(Math.floor(d.getTime() / 1000)));
                    setLocalLabel(`Local: ${d.toLocaleString()}`);
                  }
                }}
                placeholder="e.g. 2026-11-17T13:20:00.000Z"
                spellCheck={false}
                className="w-full rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-[12.5px] text-[var(--text)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>
          </div>

          <p className="mt-2.5 font-mono text-xs text-[var(--text-muted)]">{localLabel}</p>
        </div>
      )}
    </div>
  );
}
