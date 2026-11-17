import { useEffect, useState } from "react";

type CellColor = "ink" | "accent" | "empty";

interface PuzzleLevel {
  id: string;
  title: string;
  concept: string;
  prompt: string;
  hint: string;
  starter: string;
  chips: string[];
  mode: "grid" | "console";
  expectedGrid?: CellColor[][];
  expectedLogs?: string[];
}

const LEVELS: PuzzleLevel[] = [
  {
    id: "draw-row",
    title: "1. First Pattern",
    concept: "Functions",
    prompt: 'Draw 3 boxes in a row by calling drawBox("ink") three times.',
    hint: 'Call drawBox("ink"); three times on separate lines.',
    starter: '// Draw 3 "ink" boxes\ndrawBox("ink");\n',
    chips: ['drawBox("ink");', 'drawBox("accent");', "newRow();"],
    mode: "grid",
    expectedGrid: [["ink", "ink", "ink"]],
  },
  {
    id: "staircase",
    title: "2. Staircase",
    concept: "Loops",
    prompt: "Use nested loops with newRow() to draw a 4-row staircase (1, 2, 3, then 4 boxes).",
    hint: "Outer loop r from 1 to 4; inner loop c from 0 to r; call newRow() after each row.",
    starter:
      'for (let r = 1; r <= 4; r++) {\n  for (let c = 0; c < r; c++) {\n    drawBox("ink");\n  }\n  // Move to next row\n}\n',
    chips: ["newRow();", 'drawBox("ink");', "for (let i = 0; i < 4; i++) {\n\n}"],
    mode: "grid",
    expectedGrid: [
      ["ink"],
      ["ink", "ink"],
      ["ink", "ink", "ink"],
      ["ink", "ink", "ink", "ink"],
    ],
  },
  {
    id: "checkerboard",
    title: "3. Checkerboard",
    concept: "Conditionals",
    prompt: 'Draw a 4×4 alternating grid using "ink" and "accent" boxes.',
    hint: 'Check (r + c) % 2 === 0 ? "ink" : "accent" inside a 4×4 nested loop.',
    starter:
      'for (let r = 0; r < 4; r++) {\n  for (let c = 0; c < 4; c++) {\n    const color = (r + c) % 2 === 0 ? "ink" : "accent";\n    drawBox(color);\n  }\n  newRow();\n}\n',
    chips: ["(r + c) % 2 === 0", 'drawBox("ink");', 'drawBox("accent");', "newRow();"],
    mode: "grid",
    expectedGrid: [
      ["ink", "accent", "ink", "accent"],
      ["accent", "ink", "accent", "ink"],
      ["ink", "accent", "ink", "accent"],
      ["accent", "ink", "accent", "ink"],
    ],
  },
  {
    id: "array-pipeline",
    title: "4. Array Pipeline",
    concept: "Map & Filter",
    prompt: "Filter even numbers from [1, 2, 3, 4, 5, 6], double each, and print() each result.",
    hint: "nums.filter(n => n % 2 === 0).map(n => n * 2).forEach(n => print(n));",
    starter:
      "const nums = [1, 2, 3, 4, 5, 6];\n// Filter evens, double them, and call print(n)\n",
    chips: [".filter((n) => n % 2 === 0)", ".map((n) => n * 2)", ".forEach((n) => print(n));"],
    mode: "console",
    expectedLogs: ["4", "8", "12"],
  },
  {
    id: "fizzbuzz",
    title: "5. Mini FizzBuzz",
    concept: "Modulo Logic",
    prompt: 'Print numbers 1 to 6, replacing multiples of 3 with "Fizz" and 5 with "Buzz".',
    hint: 'Loop i from 1 to 6: if i % 3 === 0 print("Fizz"), else if i % 5 === 0 print("Buzz"), else print(i).',
    starter:
      "for (let i = 1; i <= 6; i++) {\n  // print Fizz, Buzz, or i\n}\n",
    chips: ['if (i % 3 === 0) print("Fizz");', 'else if (i % 5 === 0) print("Buzz");', "else print(i);"],
    mode: "console",
    expectedLogs: ["1", "2", "Fizz", "4", "Buzz", "Fizz"],
  },
];

const SOLVED_KEY = "kamil_puzzle_solved";

function gridsEqual(a: CellColor[][], b: CellColor[][]): boolean {
  if (a.length !== b.length) return false;
  for (let r = 0; r < a.length; r++) {
    if (a[r].length !== b[r].length) return false;
    for (let c = 0; c < a[r].length; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

function GridPreview({ grid, label }: { grid: CellColor[][]; label: string }) {
  return (
    <div className="rounded border border-[var(--border)] bg-[var(--bg)] p-3">
      <span className="mb-2 block font-mono text-[11px] text-[var(--text-subtle)]">{label}</span>
      {grid.length === 0 || (grid.length === 1 && grid[0].length === 0) ? (
        <span className="font-mono text-xs text-[var(--text-subtle)]">Empty</span>
      ) : (
        <div className="flex flex-col gap-1.5">
          {grid.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1.5">
              {row.map((cell, cIdx) => (
                <div
                  key={cIdx}
                  className={`h-5 w-5 rounded-[3px] border ${
                    cell === "ink"
                      ? "border-[var(--text)] bg-[var(--text)]"
                      : cell === "accent"
                      ? "border-[var(--border-strong)] bg-[var(--surface)]"
                      : "border-dashed border-[var(--border)] bg-transparent"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CodePuzzleApp() {
  const [levelIdx, setLevelIdx] = useState(0);
  const level = LEVELS[levelIdx];

  const [code, setCode] = useState(level.starter);
  const [showHint, setShowHint] = useState(false);
  const [gridOut, setGridOut] = useState<CellColor[][]>([]);
  const [logsOut, setLogsOut] = useState<string[]>([]);
  const [status, setStatus] = useState<{ msg: string; state: "" | "ok" | "err" }>({
    msg: "Edit code and click Run",
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

  function selectLevel(idx: number) {
    const next = LEVELS[idx];
    setLevelIdx(idx);
    setCode(next.starter);
    setShowHint(false);
    setGridOut([]);
    setLogsOut([]);
    setStatus({ msg: "Edit code and click Run", state: "" });
  }

  function runCode() {
    const grid: CellColor[][] = [[]];
    const logs: string[] = [];
    let ops = 0;
    const MAX_OPS = 500;

    const guard = () => {
      ops += 1;
      if (ops > MAX_OPS) {
        throw new Error("Execution limit exceeded (possible infinite loop)");
      }
    };

    const drawBox = (color: string) => {
      guard();
      const normalized: CellColor =
        color === "ink" ? "ink" : color === "accent" ? "accent" : "empty";
      grid[grid.length - 1].push(normalized);
    };

    const newRow = () => {
      guard();
      if (grid.length < 16) {
        grid.push([]);
      }
    };

    const print = (val: unknown) => {
      guard();
      logs.push(String(val));
    };

    try {
      const fn = new Function(
        "drawBox",
        "newRow",
        "print",
        "window",
        "document",
        "localStorage",
        "fetch",
        `"use strict";\n${code}`
      );
      fn(drawBox, newRow, print, undefined, undefined, undefined, undefined);

      // Trim trailing empty row if newRow() was called at the end of a loop
      const cleanedGrid =
        grid.length > 1 && grid[grid.length - 1].length === 0 ? grid.slice(0, -1) : grid;

      setGridOut(cleanedGrid);
      setLogsOut(logs);

      const passed =
        level.mode === "grid" && level.expectedGrid
          ? gridsEqual(cleanedGrid, level.expectedGrid)
          : level.mode === "console" && level.expectedLogs
          ? logs.length === level.expectedLogs.length &&
            logs.every((v, i) => v === level.expectedLogs![i])
          : false;

      if (passed) {
        setStatus({ msg: "Passed! Output matches target.", state: "ok" });
        setSolved((prev) => (prev.includes(level.id) ? prev : [...prev, level.id]));
      } else {
        setStatus({ msg: "Ran successfully, but output does not match target yet.", state: "err" });
      }
    } catch (err) {
      setStatus({
        msg: err instanceof Error ? err.message : "Runtime error",
        state: "err",
      });
    }
  }

  return (
    <div>
      {/* Level selector */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {LEVELS.map((lvl, idx) => {
            const isSolved = solved.includes(lvl.id);
            const active = idx === levelIdx;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => selectLevel(idx)}
                className={`cursor-pointer rounded border px-2.5 py-1 font-mono text-xs transition-colors ${
                  active
                    ? "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)]"
                    : "border-[var(--border)] bg-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {lvl.title} {isSolved ? "✓" : ""}
              </button>
            );
          })}
        </div>
        <span className="font-mono text-xs tabular-nums text-[var(--text-subtle)]">
          {solved.length} / {LEVELS.length} solved
        </span>
      </div>

      {/* Prompt */}
      <div className="mb-3 rounded border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-[var(--text)]">{level.title}</span>
          <span className="font-mono text-[11px] text-[var(--text-subtle)]">{level.concept}</span>
        </div>
        <p className="m-0 text-[13.5px] text-[var(--text-muted)]">{level.prompt}</p>
        {showHint && (
          <p className="mt-2 border-t border-[var(--border)] pt-2 font-mono text-xs text-[var(--text-muted)]">
            Hint: {level.hint}
          </p>
        )}
      </div>

      {/* Quick-insert chips (Grasshopper-style) */}
      <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-mono text-[11px] text-[var(--text-subtle)]">Insert:</span>
        {level.chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setCode((prev) => `${prev}${prev.endsWith("\n") || !prev ? "" : "\n"}${chip}\n`)}
            className="cursor-pointer rounded border border-[var(--border)] bg-transparent px-2 py-0.5 font-mono text-[11.5px] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
          >
            {chip.replace(/\n+/g, " ")}
          </button>
        ))}
      </div>

      {/* Editor */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={7}
        spellCheck={false}
        aria-label="JavaScript puzzle editor"
        className="w-full resize-y rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-[var(--text)] focus:border-[var(--border-strong)] focus:outline-none"
      />

      {/* Actions */}
      <div className="my-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={runCode}
            className="cursor-pointer rounded border border-[var(--text)] bg-[var(--text)] px-3 py-1 text-xs font-medium text-[var(--bg)] transition-opacity hover:opacity-85"
          >
            Run Code
          </button>
          <button
            type="button"
            onClick={() => setShowHint((h) => !h)}
            className="cursor-pointer rounded border border-[var(--border)] bg-transparent px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
          >
            {showHint ? "Hide Hint" : "Hint"}
          </button>
          <button
            type="button"
            onClick={() => selectLevel(levelIdx)}
            className="cursor-pointer rounded border border-[var(--border)] bg-transparent px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
          >
            Reset
          </button>
        </div>

        {status.state === "ok" && levelIdx < LEVELS.length - 1 && (
          <button
            type="button"
            onClick={() => selectLevel(levelIdx + 1)}
            className="cursor-pointer rounded border border-[var(--border-strong)] bg-[var(--surface)] px-2.5 py-1 text-xs font-medium text-[var(--text)]"
          >
            Next Challenge →
          </button>
        )}
      </div>

      {/* Output comparison */}
      {level.mode === "grid" && level.expectedGrid && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <GridPreview grid={gridOut} label="Your Output" />
          <GridPreview grid={level.expectedGrid} label="Target Pattern" />
        </div>
      )}

      {level.mode === "console" && level.expectedLogs && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded border border-[var(--border)] bg-[var(--bg)] p-3 font-mono text-xs">
            <span className="mb-1.5 block text-[11px] text-[var(--text-subtle)]">Your Output</span>
            {logsOut.length === 0 ? (
              <span className="text-[var(--text-subtle)]">—</span>
            ) : (
              <pre className="m-0 whitespace-pre-wrap">{logsOut.join("\n")}</pre>
            )}
          </div>
          <div className="rounded border border-[var(--border)] bg-[var(--bg)] p-3 font-mono text-xs">
            <span className="mb-1.5 block text-[11px] text-[var(--text-subtle)]">Target Output</span>
            <pre className="m-0 whitespace-pre-wrap">{level.expectedLogs.join("\n")}</pre>
          </div>
        </div>
      )}

      <p
        aria-live="polite"
        className={`mt-2.5 font-mono text-xs ${
          status.state === "ok"
            ? "text-[var(--ok)]"
            : status.state === "err"
            ? "text-[var(--err)]"
            : "text-[var(--text-muted)]"
        }`}
      >
        {status.msg}
      </p>
    </div>
  );
}
