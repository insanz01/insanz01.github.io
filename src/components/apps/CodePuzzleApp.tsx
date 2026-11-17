import { useEffect, useRef, useState } from "react";

type CellColor = "ink" | "accent" | "empty";

interface WorkspaceBlock {
  uid: string;
  code: string;
}

interface PuzzleLevel {
  id: string;
  title: string;
  concept: string;
  prompt: string;
  hint: string;
  starterBlocks: string[];
  toolbox: string[];
  mode: "grid" | "console";
  expectedGrid?: CellColor[][];
  expectedLogs?: string[];
}

const LEVELS: PuzzleLevel[] = [
  {
    id: "draw-row",
    title: "1. First Pattern",
    concept: "Functions",
    prompt: 'Drag or click blocks to draw 3 "ink" boxes in a row.',
    hint: 'Add drawBox("ink"); three times into the workspace.',
    starterBlocks: ['drawBox("ink");'],
    toolbox: ['drawBox("ink");', 'drawBox("accent");', "newRow();"],
    mode: "grid",
    expectedGrid: [["ink", "ink", "ink"]],
  },
  {
    id: "staircase",
    title: "2. Staircase",
    concept: "Loops",
    prompt: "Arrange the blocks so nested loops + newRow() draw a 4-row staircase.",
    hint: "Place newRow(); right before the outer closing brace }.",
    starterBlocks: [
      "for (let r = 1; r <= 4; r++) {",
      "for (let c = 0; c < r; c++) {",
      'drawBox("ink");',
      "}",
      "}",
    ],
    toolbox: [
      "for (let r = 1; r <= 4; r++) {",
      "for (let c = 0; c < r; c++) {",
      'drawBox("ink");',
      "newRow();",
      "}",
    ],
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
    prompt: 'Build a 4×4 alternating grid using "ink" and "accent" boxes.',
    hint: "Compute color with (r + c) % 2 === 0 inside the inner loop, then call newRow() after the inner loop.",
    starterBlocks: [
      "for (let r = 0; r < 4; r++) {",
      "for (let c = 0; c < 4; c++) {",
      'const color = (r + c) % 2 === 0 ? "ink" : "accent";',
      "drawBox(color);",
      "}",
      "newRow();",
      "}",
    ],
    toolbox: [
      "for (let r = 0; r < 4; r++) {",
      "for (let c = 0; c < 4; c++) {",
      'const color = (r + c) % 2 === 0 ? "ink" : "accent";',
      "drawBox(color);",
      "newRow();",
      "}",
    ],
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
    prompt: "Chain blocks to filter even numbers from [1..6], double them, and print() each.",
    hint: "Order: const nums → .filter → .map → .forEach(print).",
    starterBlocks: ["const nums = [1, 2, 3, 4, 5, 6];", "nums"],
    toolbox: [
      "const nums = [1, 2, 3, 4, 5, 6];",
      "nums",
      "  .filter((n) => n % 2 === 0)",
      "  .map((n) => n * 2)",
      "  .forEach((n) => print(n));",
    ],
    mode: "console",
    expectedLogs: ["4", "8", "12"],
  },
  {
    id: "fizzbuzz",
    title: "5. Mini FizzBuzz",
    concept: "Modulo Logic",
    prompt: 'Arrange blocks to print 1..6, replacing multiples of 3 with "Fizz" and 5 with "Buzz".',
    hint: 'Loop i from 1 to 6, check i % 3 === 0 first, then i % 5 === 0, then else print(i).',
    starterBlocks: ["for (let i = 1; i <= 6; i++) {", "}"],
    toolbox: [
      "for (let i = 1; i <= 6; i++) {",
      'if (i % 3 === 0) print("Fizz");',
      'else if (i % 5 === 0) print("Buzz");',
      "else print(i);",
      "}",
    ],
    mode: "console",
    expectedLogs: ["1", "2", "Fizz", "4", "Buzz", "Fizz"],
  },
];

const SOLVED_KEY = "kamil_puzzle_solved";

function computeIndents(blocks: WorkspaceBlock[]): number[] {
  let depth = 0;
  return blocks.map((b) => {
    const trimmed = b.code.trim();
    if (trimmed.startsWith("}")) {
      depth = Math.max(0, depth - 1);
    }
    const current = depth;
    if (trimmed.endsWith("{")) {
      depth += 1;
    }
    return current;
  });
}

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
  const uidRef = useRef(1);
  const makeBlocks = (lines: string[]): WorkspaceBlock[] =>
    lines.map((code) => ({ uid: `blk-${uidRef.current++}`, code }));

  const [levelIdx, setLevelIdx] = useState(0);
  const level = LEVELS[levelIdx];

  const [editorMode, setEditorMode] = useState<"blocks" | "code">("blocks");
  const [blocks, setBlocks] = useState<WorkspaceBlock[]>(() => makeBlocks(level.starterBlocks));
  const [rawCode, setRawCode] = useState(() => level.starterBlocks.join("\n"));
  const [dragOverIdx, setDragOverIdx] = useState<number | "end" | null>(null);

  const [showHint, setShowHint] = useState(false);
  const [gridOut, setGridOut] = useState<CellColor[][]>([]);
  const [logsOut, setLogsOut] = useState<string[]>([]);
  const [status, setStatus] = useState<{ msg: string; state: "" | "ok" | "err" }>({
    msg: "Drag blocks into the workspace and click Run",
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
    setBlocks(makeBlocks(next.starterBlocks));
    setRawCode(next.starterBlocks.join("\n"));
    setShowHint(false);
    setGridOut([]);
    setLogsOut([]);
    setStatus({ msg: "Drag blocks into the workspace and click Run", state: "" });
  }

  function addToolboxBlock(code: string, atIndex?: number) {
    const item: WorkspaceBlock = { uid: `blk-${uidRef.current++}`, code };
    setBlocks((prev) => {
      const next = prev.slice();
      if (typeof atIndex === "number") {
        next.splice(atIndex, 0, item);
      } else {
        next.push(item);
      }
      return next;
    });
  }

  function moveWorkspaceBlock(fromIdx: number, toIdx: number) {
    if (fromIdx === toIdx) return;
    setBlocks((prev) => {
      const next = prev.slice();
      const [moved] = next.splice(fromIdx, 1);
      const adjusted = fromIdx < toIdx ? toIdx - 1 : toIdx;
      next.splice(adjusted, 0, moved);
      return next;
    });
  }

  function handleDrop(e: React.DragEvent, targetIdx: number | "end") {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIdx(null);

    const payload = e.dataTransfer.getData("application/x-puzzle-block");
    if (!payload) return;

    try {
      const data = JSON.parse(payload) as
        | { source: "toolbox"; code: string }
        | { source: "workspace"; index: number };

      if (data.source === "toolbox") {
        addToolboxBlock(data.code, targetIdx === "end" ? undefined : targetIdx);
      } else if (data.source === "workspace") {
        const dest = targetIdx === "end" ? blocks.length : targetIdx;
        moveWorkspaceBlock(data.index, dest);
      }
    } catch {
      // ignore malformed drag payload
    }
  }

  function switchEditorMode(nextMode: "blocks" | "code") {
    if (nextMode === "code" && editorMode === "blocks") {
      const indents = computeIndents(blocks);
      setRawCode(blocks.map((b, i) => `${"  ".repeat(indents[i])}${b.code}`).join("\n"));
    } else if (nextMode === "blocks" && editorMode === "code") {
      const lines = rawCode
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      setBlocks(makeBlocks(lines));
    }
    setEditorMode(nextMode);
  }

  function runCode() {
    const sourceCode =
      editorMode === "blocks" ? blocks.map((b) => b.code).join("\n") : rawCode;

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
        `"use strict";\n${sourceCode}`
      );
      fn(drawBox, newRow, print, undefined, undefined, undefined, undefined);

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

  const indents = computeIndents(blocks);

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
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[var(--text-subtle)]">{level.concept}</span>
            <div className="flex rounded border border-[var(--border)] p-0.5">
              {(["blocks", "code"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchEditorMode(m)}
                  className={`cursor-pointer rounded-[3px] px-2 py-0.5 font-mono text-[11px] capitalize ${
                    editorMode === m
                      ? "bg-[var(--surface)] text-[var(--text)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="m-0 text-[13.5px] text-[var(--text-muted)]">{level.prompt}</p>
        {showHint && (
          <p className="mt-2 border-t border-[var(--border)] pt-2 font-mono text-xs text-[var(--text-muted)]">
            Hint: {level.hint}
          </p>
        )}
      </div>

      {editorMode === "blocks" ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[230px_1fr]">
          {/* Toolbox */}
          <div className="rounded border border-[var(--border)] bg-[var(--bg)] p-2.5">
            <span className="mb-2 block font-mono text-[11px] text-[var(--text-subtle)]">
              Blocks (drag or click)
            </span>
            <div className="flex flex-col gap-1.5">
              {level.toolbox.map((code) => (
                <button
                  key={code}
                  type="button"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      "application/x-puzzle-block",
                      JSON.stringify({ source: "toolbox", code })
                    );
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                  onClick={() => addToolboxBlock(code)}
                  className="flex cursor-grab items-center gap-2 rounded border border-[var(--border)] bg-[var(--surface-raised)] px-2.5 py-1.5 text-left font-mono text-[11.5px] text-[var(--text)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] active:cursor-grabbing"
                >
                  <span className="select-none text-[var(--text-subtle)]" aria-hidden="true">
                    ⋮⋮
                  </span>
                  <span className="truncate">{code.trim()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Drop Workspace */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverIdx("end");
            }}
            onDragLeave={() => setDragOverIdx(null)}
            onDrop={(e) => handleDrop(e, "end")}
            className={`min-h-[190px] rounded border bg-[var(--bg)] p-2.5 transition-colors ${
              dragOverIdx === "end" ? "border-[var(--border-strong)]" : "border-[var(--border)]"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[11px] text-[var(--text-subtle)]">
                Workspace (drag to reorder)
              </span>
              {blocks.length > 0 && (
                <button
                  type="button"
                  onClick={() => setBlocks([])}
                  className="cursor-pointer font-mono text-[11px] text-[var(--text-subtle)] hover:text-[var(--text)]"
                >
                  Clear
                </button>
              )}
            </div>

            {blocks.length === 0 ? (
              <div className="flex h-[130px] items-center justify-center rounded border border-dashed border-[var(--border)] font-mono text-xs text-[var(--text-subtle)]">
                Drop blocks here
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {blocks.map((blk, idx) => (
                  <div
                    key={blk.uid}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        "application/x-puzzle-block",
                        JSON.stringify({ source: "workspace", index: idx })
                      );
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragOverIdx(idx);
                    }}
                    onDrop={(e) => handleDrop(e, idx)}
                    style={{ marginLeft: `${indents[idx] * 14}px` }}
                    className={`group flex cursor-grab items-center justify-between gap-2 rounded border bg-[var(--surface-raised)] px-2.5 py-1.5 font-mono text-[11.5px] transition-colors active:cursor-grabbing ${
                      dragOverIdx === idx
                        ? "border-t-2 border-t-[var(--text)] border-[var(--border-strong)]"
                        : "border-[var(--border)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="select-none text-[var(--text-subtle)]" aria-hidden="true">
                        ⋮⋮
                      </span>
                      <span className="truncate text-[var(--text)]">{blk.code.trim()}</span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 opacity-75 group-hover:opacity-100">
                      <button
                        type="button"
                        aria-label="Move block up"
                        disabled={idx === 0}
                        onClick={() => moveWorkspaceBlock(idx, idx - 1)}
                        className="cursor-pointer rounded px-1 text-[11px] text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] disabled:opacity-25"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label="Move block down"
                        disabled={idx === blocks.length - 1}
                        onClick={() => moveWorkspaceBlock(idx, idx + 2)}
                        className="cursor-pointer rounded px-1 text-[11px] text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] disabled:opacity-25"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        aria-label="Remove block"
                        onClick={() => setBlocks((prev) => prev.filter((_, i) => i !== idx))}
                        className="cursor-pointer rounded px-1 text-[11px] text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--err)]"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <textarea
          value={rawCode}
          onChange={(e) => setRawCode(e.target.value)}
          rows={8}
          spellCheck={false}
          aria-label="JavaScript puzzle editor"
          className="w-full resize-y rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-[var(--text)] focus:border-[var(--border-strong)] focus:outline-none"
        />
      )}

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
