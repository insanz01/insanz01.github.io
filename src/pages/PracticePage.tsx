import { useEffect, useState } from "react";
import { PRACTICE_PROBLEMS, type PracticeProblem } from "../data/practiceProblems";
import { useLanguage } from "../i18n";

interface TestResult {
  label: string;
  passed: boolean;
  isHidden?: boolean;
  inputStr: string;
  expectedStr: string;
  actualStr: string;
  durationMs: number;
}

const SOLVED_KEY = "kamil_practice_solved";

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function PracticePage() {
  const { t } = useLanguage();
  const [problemIdx, setProblemIdx] = useState(0);
  const problem: PracticeProblem = PRACTICE_PROBLEMS[problemIdx];

  const [code, setCode] = useState(problem.starterCode);
  const [results, setResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<{ msg: string; state: "" | "ok" | "err" }>({
    msg: "Write your JavaScript solution and click Run Sample or Submit.",
    state: "",
  });

  const [solved, setSolved] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(SOLVED_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SOLVED_KEY, JSON.stringify(solved));
    } catch {
      // ignore storage errors
    }
  }, [solved]);

  function selectProblem(idx: number) {
    const next = PRACTICE_PROBLEMS[idx];
    setProblemIdx(idx);
    setCode(next.starterCode);
    setResults([]);
    setSummary({
      msg: "Write your JavaScript solution and click Run Sample or Submit.",
      state: "",
    });
  }

  function executeTests(includeHidden: boolean) {
    const cases = includeHidden
      ? problem.tests
      : problem.tests.filter((t) => !t.isHidden);

    let userFn: ((...args: unknown[]) => unknown) | null = null;

    try {
      const factory = new Function(
        "window",
        "document",
        "localStorage",
        "fetch",
        `"use strict";\n${code}\nreturn typeof ${problem.fnName} === "function" ? ${problem.fnName} : null;`
      );
      userFn = factory(undefined, undefined, undefined, undefined) as
        | ((...args: unknown[]) => unknown)
        | null;

      if (!userFn) {
        setResults([]);
        setSummary({
          msg: `Function "${problem.fnName}" not found. Keep the function signature intact.`,
          state: "err",
        });
        return;
      }
    } catch (err) {
      setResults([]);
      setSummary({
        msg: `Syntax error: ${err instanceof Error ? err.message : "Invalid code"}`,
        state: "err",
      });
      return;
    }

    const nextResults: TestResult[] = cases.map((tc) => {
      const clonedArgs = JSON.parse(JSON.stringify(tc.args)) as unknown[];
      const t0 = performance.now();
      try {
        const rawActual = userFn!(...clonedArgs);
        const durationMs = Math.max(0.01, performance.now() - t0);
        const actual = problem.normalizeResult ? problem.normalizeResult(rawActual) : rawActual;
        const expected = problem.normalizeResult ? problem.normalizeResult(tc.expected) : tc.expected;
        const passed = deepEqual(actual, expected);

        return {
          label: tc.label,
          passed,
          isHidden: tc.isHidden,
          inputStr: tc.isHidden ? "Hidden input" : JSON.stringify(tc.args),
          expectedStr: tc.isHidden ? "Hidden" : JSON.stringify(tc.expected),
          actualStr: JSON.stringify(rawActual),
          durationMs,
        };
      } catch (err) {
        const durationMs = Math.max(0.01, performance.now() - t0);
        return {
          label: tc.label,
          passed: false,
          isHidden: tc.isHidden,
          inputStr: tc.isHidden ? "Hidden input" : JSON.stringify(tc.args),
          expectedStr: tc.isHidden ? "Hidden" : JSON.stringify(tc.expected),
          actualStr: `RuntimeError: ${err instanceof Error ? err.message : "Error"}`,
          durationMs,
        };
      }
    });

    setResults(nextResults);
    const passedCount = nextResults.filter((r) => r.passed).length;
    const allPassed = passedCount === nextResults.length;

    if (allPassed && includeHidden) {
      setSummary({
        msg: `Accepted · All ${nextResults.length} test cases passed!`,
        state: "ok",
      });
      setSolved((prev) => (prev.includes(problem.id) ? prev : [...prev, problem.id]));
    } else if (allPassed) {
      setSummary({
        msg: `Sample tests passed (${passedCount}/${nextResults.length}). Click Submit to run hidden cases.`,
        state: "ok",
      });
    } else {
      setSummary({
        msg: `${passedCount} / ${nextResults.length} test cases passed.`,
        state: "err",
      });
    }
  }

  return (
    <>
      <section className="pb-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="mb-2 text-[22px] font-semibold tracking-tight">{t.practice.title}</h1>
          <span className="font-mono text-xs tabular-nums text-[var(--text-subtle)]">
            {solved.length} / {PRACTICE_PROBLEMS.length} {t.practice.solved}
          </span>
        </div>
        <p className="m-0 text-[var(--text-muted)]">{t.practice.subtitle}</p>
      </section>

      <section className="border-t border-[var(--border)] py-8">
        {/* Problem Selector */}
        <div className="mb-6 flex flex-wrap gap-1.5" role="tablist" aria-label="Coding problems">
          {PRACTICE_PROBLEMS.map((p, idx) => {
            const active = idx === problemIdx;
            const isSolved = solved.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectProblem(idx)}
                className={`cursor-pointer rounded border px-2.5 py-1 font-mono text-xs transition-colors ${
                  active
                    ? "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)]"
                    : "border-[var(--border)] bg-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {p.title} {isSolved ? "✓" : ""}
              </button>
            );
          })}
        </div>

        {/* Problem Statement */}
        <div className="mb-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
            <h2 className="m-0 text-base font-semibold tracking-tight">{problem.title}</h2>
            <div className="flex items-center gap-2 font-mono text-[11.5px]">
              <span
                className={`rounded border px-2 py-0.5 ${
                  problem.difficulty === "Easy"
                    ? "border-[var(--border)] text-[var(--ok)]"
                    : "border-[var(--border)] text-[var(--text-muted)]"
                }`}
              >
                {problem.difficulty}
              </span>
              <span className="text-[var(--text-subtle)]">{problem.topic}</span>
            </div>
          </div>

          <p className="mb-4 text-sm text-[var(--text-muted)]">{problem.description}</p>

          <div className="mb-3 flex flex-col gap-2">
            {problem.examples.map((ex, i) => (
              <div
                key={i}
                className="rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-xs"
              >
                <div>
                  <span className="text-[var(--text-subtle)]">Input: </span>
                  <span>{ex.input}</span>
                </div>
                <div>
                  <span className="text-[var(--text-subtle)]">Output: </span>
                  <span>{ex.output}</span>
                </div>
                {ex.explanation && (
                  <div className="mt-1 text-[var(--text-muted)]">{ex.explanation}</div>
                )}
              </div>
            ))}
          </div>

          <ul className="m-0 list-disc pl-4 font-mono text-[11.5px] text-[var(--text-subtle)]">
            {problem.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        {/* Code Editor */}
        <div className="rounded-[6px] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--text-subtle)]">JavaScript (ES2022)</span>
            <button
              type="button"
              onClick={() => selectProblem(problemIdx)}
              className="cursor-pointer font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              Reset starter
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const el = e.currentTarget;
                const start = el.selectionStart;
                const end = el.selectionEnd;
                const next = `${code.slice(0, start)}  ${code.slice(end)}`;
                setCode(next);
                requestAnimationFrame(() => {
                  el.selectionStart = el.selectionEnd = start + 2;
                });
              }
            }}
            rows={10}
            spellCheck={false}
            aria-label="Solution code editor"
            className="w-full resize-y rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-[var(--text)] focus:border-[var(--border-strong)] focus:outline-none"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => executeTests(false)}
              className="cursor-pointer rounded border border-[var(--border)] bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
            >
              Run Sample
            </button>
            <button
              type="button"
              onClick={() => executeTests(true)}
              className="cursor-pointer rounded-[2px] border border-[var(--accent)] bg-[var(--accent)] px-3.5 py-1.5 text-xs font-semibold text-[#090D0C] transition-opacity hover:opacity-90"
            >
              Submit
            </button>
          </div>

          <p
            aria-live="polite"
            className={`mt-3 font-mono text-xs ${
              summary.state === "ok"
                ? "text-[var(--ok)]"
                : summary.state === "err"
                ? "text-[var(--err)]"
                : "text-[var(--text-muted)]"
            }`}
          >
            {summary.msg}
          </p>

          {results.length > 0 && (
            <ul className="mt-3 flex list-none flex-col gap-2 border-t border-[var(--border)] p-0 pt-3">
              {results.map((r) => (
                <li
                  key={r.label}
                  className="rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-[var(--text)]">{r.label}</span>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] text-[var(--text-subtle)]">
                        {r.durationMs.toFixed(2)} ms
                      </span>
                      <span className={r.passed ? "text-[var(--ok)]" : "text-[var(--err)]"}>
                        {r.passed ? "Passed" : "Failed"}
                      </span>
                    </div>
                  </div>
                  {!r.passed && (
                    <div className="mt-1.5 flex flex-col gap-0.5 text-[11.5px] text-[var(--text-muted)]">
                      <div>Input: {r.inputStr}</div>
                      <div>Expected: {r.expectedStr}</div>
                      <div className="text-[var(--err)]">Actual: {r.actualStr}</div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
