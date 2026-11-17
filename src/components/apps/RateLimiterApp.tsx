import { useEffect, useRef, useState } from "react";

interface LogEntry {
  id: number;
  time: string;
  allowed: boolean;
}

export function RateLimiterApp() {
  const [capacity, setCapacity] = useState(5);
  const [refillRate, setRefillRate] = useState(1);
  const [tokens, setTokens] = useState(5);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const tokensRef = useRef(5);
  const lastTickRef = useRef(Date.now());
  const seqRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      const next = Math.min(capacity, tokensRef.current + elapsed * refillRate);
      tokensRef.current = next;
      setTokens(next);
    }, 100);
    return () => clearInterval(id);
  }, [capacity, refillRate]);

  function sendRequests(count: number) {
    const now = Date.now();
    const elapsed = (now - lastTickRef.current) / 1000;
    lastTickRef.current = now;
    let current = Math.min(capacity, tokensRef.current + elapsed * refillRate);

    const added: LogEntry[] = [];
    const timeStr = new Date().toLocaleTimeString();

    for (let i = 0; i < count; i++) {
      seqRef.current += 1;
      const allowed = current >= 1;
      if (allowed) current -= 1;
      added.unshift({ id: seqRef.current, time: timeStr, allowed });
    }

    tokensRef.current = current;
    setTokens(current);
    setLogs((prev) => [...added, ...prev].slice(0, 15));
  }

  const filled = Math.floor(tokens);

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-[12.5px] text-[var(--text-muted)]">
          <span>
            Bucket Capacity: <strong className="text-[var(--text)]">{capacity}</strong>
          </span>
          <input
            type="range"
            min={1}
            max={10}
            value={capacity}
            onChange={(e) => {
              const nextCap = Number(e.target.value);
              setCapacity(nextCap);
              tokensRef.current = Math.min(tokensRef.current, nextCap);
              setTokens(tokensRef.current);
            }}
            className="cursor-pointer accent-[var(--text)]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-[12.5px] text-[var(--text-muted)]">
          <span>
            Refill Rate: <strong className="text-[var(--text)]">{refillRate.toFixed(1)}</strong> req/s
          </span>
          <input
            type="range"
            min={0.5}
            max={5}
            step={0.5}
            value={refillRate}
            onChange={(e) => setRefillRate(Number(e.target.value))}
            className="cursor-pointer accent-[var(--text)]"
          />
        </label>
      </div>

      <div className="mb-3 rounded border border-[var(--border)] bg-[var(--bg)] p-3">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-[12.5px] text-[var(--text-muted)]">Available Tokens</span>
          <span className="font-mono text-xs tabular-nums text-[var(--text-subtle)]">
            {filled} / {capacity}
          </span>
        </div>

        <div className="grid grid-cols-10 gap-1.5" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => {
            const disabled = i >= capacity;
            const isFilled = !disabled && i < filled;
            return (
              <div
                key={i}
                className={`h-3.5 rounded-[3px] border transition-colors duration-100 ${
                  disabled
                    ? "border-[var(--border)] opacity-20"
                    : isFilled
                    ? "border-[var(--text)] bg-[var(--text)]"
                    : "border-[var(--border)] bg-transparent"
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => sendRequests(1)}
          className="cursor-pointer rounded border border-[var(--text)] bg-[var(--text)] px-2.5 py-1 text-xs font-medium text-[var(--bg)] transition-opacity hover:opacity-85"
        >
          Send Request
        </button>
        <button
          type="button"
          onClick={() => sendRequests(5)}
          className="cursor-pointer rounded border border-[var(--border)] bg-transparent px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
        >
          Burst ×5
        </button>
        <button
          type="button"
          onClick={() => {
            tokensRef.current = capacity;
            seqRef.current = 0;
            setTokens(capacity);
            setLogs([]);
          }}
          className="cursor-pointer rounded border border-[var(--border)] bg-transparent px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
        >
          Reset
        </button>
      </div>

      <ul
        aria-live="polite"
        aria-label="Request log"
        className="m-0 max-h-[150px] list-none overflow-y-auto border-t border-[var(--border)] p-0 font-mono text-xs"
      >
        {logs.map((entry) => (
          <li
            key={entry.id}
            className="flex justify-between gap-3 border-b border-[var(--border)] px-0.5 py-1.5 text-[var(--text-muted)]"
          >
            <span>
              #{entry.id} · {entry.time}
            </span>
            <span className={entry.allowed ? "text-[var(--ok)]" : "text-[var(--err)]"}>
              {entry.allowed ? "200 OK" : "429 Too Many Requests"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
