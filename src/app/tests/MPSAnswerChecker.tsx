import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { runPython } from "../../backend/mechanics/parser";
import {
  MachineProblems,
  validateMachineProblemSolution,
} from "../../game/data/mps";
import type { MachineProblem } from "../../game/types/mp.types";

type ValidationResult = {
  solved: boolean;
  output: string;
  runtimeError: boolean;
};

const SCENES = Object.keys(MachineProblems);

function getProblemsByScene(scene: string): MachineProblem[] {
  const entries = MachineProblems[scene] ?? [];
  return Array.isArray(entries) ? entries : [];
}

function hasRuntimeError(output: string): boolean {
  return output
    .replace(/\r/g, "")
    .split("\n")
    .some((line) => /^Error:/i.test(line.trim()));
}

export default function MPSAnswerChecker() {
  const [scene, setScene] = useState<string>(SCENES[0] ?? "");
  const [problemIndex, setProblemIndex] = useState<number>(0);
  const [code, setCode] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const problems = useMemo(() => getProblemsByScene(scene), [scene]);
  const selectedProblem = problems[problemIndex] ?? null;

  const handleSceneChange = (nextScene: string) => {
    setScene(nextScene);
    setProblemIndex(0);
    setResult(null);
  };

  const handleProblemChange = (value: string) => {
    const nextIndex = Number(value);
    if (!Number.isInteger(nextIndex) || nextIndex < 0) {
      return;
    }

    setProblemIndex(nextIndex);
    setResult(null);
  };

  const loadCanonicalAnswer = () => {
    if (!selectedProblem) {
      return;
    }

    setCode(selectedProblem.correct_code);
    setResult(null);
  };

  const clearEditor = () => {
    setCode("");
    setResult(null);
  };

  const validateAnswer = async () => {
    if (!selectedProblem || !code.trim() || isRunning) {
      return;
    }

    setIsRunning(true);
    setResult(null);

    try {
      const output = await runPython(code);
      const solved = validateMachineProblemSolution(selectedProblem, code, output);
      setResult({
        solved,
        output,
        runtimeError: hasRuntimeError(output),
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0f1319] text-[#f0f4ff] px-6 py-8 md:px-12"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">MPS Answer Checker</h1>
            <p className="text-sm text-slate-300 mt-1">
              Choose a machine problem, paste your Python answer, and validate it with the same checker used in-game.
            </p>
          </div>
          <Link
            to="/game"
            className="inline-flex w-fit items-center rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-400 hover:bg-slate-900"
          >
            Back to Game
          </Link>
        </header>

        <section className="grid gap-4 rounded-xl border border-slate-700 bg-[#121925] p-4 md:grid-cols-3 md:p-5">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-slate-300">Scene</span>
            <select
              value={scene}
              onChange={(event) => handleSceneChange(event.target.value)}
              className="rounded-md border border-slate-600 bg-[#0e1520] px-3 py-2 text-slate-100"
            >
              {SCENES.map((sceneName) => (
                <option key={sceneName} value={sceneName}>
                  {sceneName}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm md:col-span-2">
            <span className="text-slate-300">Problem</span>
            <select
              value={problemIndex}
              onChange={(event) => handleProblemChange(event.target.value)}
              className="rounded-md border border-slate-600 bg-[#0e1520] px-3 py-2 text-slate-100"
            >
              {problems.map((problem, index) => (
                <option key={`${scene}-${index}`} value={index}>
                  #{index + 1} - {problem.problem}
                </option>
              ))}
            </select>
          </label>
        </section>

        {selectedProblem ? (
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <section className="space-y-4 rounded-xl border border-slate-700 bg-[#111824] p-5">
              <h2 className="text-lg font-semibold">Problem Details</h2>
              <div className="rounded-lg border border-slate-700 bg-[#0d1420] p-4 text-sm leading-relaxed text-slate-100 whitespace-pre-wrap">
                {selectedProblem.problem}
              </div>

              <div>
                <h3 className="mb-2 text-xs uppercase tracking-wide text-slate-400">Expected Output</h3>
                <pre className="overflow-auto rounded-lg border border-slate-700 bg-[#0d1420] p-3 text-sm text-cyan-200">
                  {selectedProblem.expected_output}
                </pre>
              </div>

              <div>
                <h3 className="mb-2 text-xs uppercase tracking-wide text-slate-400">Canonical Answer (Reference)</h3>
                <pre className="overflow-auto rounded-lg border border-slate-700 bg-[#0d1420] p-3 text-sm text-lime-200">
                  {selectedProblem.correct_code}
                </pre>
              </div>
            </section>

            <section className="space-y-4 rounded-xl border border-slate-700 bg-[#111824] p-5">
              <h2 className="text-lg font-semibold">Try Your Answer</h2>
              <textarea
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setResult(null);
                }}
                placeholder="Write your Python solution here..."
                className="min-h-[260px] w-full resize-y rounded-lg border border-slate-600 bg-[#0b1018] p-3 font-mono text-sm text-slate-100 outline-none ring-cyan-500 focus:ring-2"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={validateAnswer}
                  disabled={isRunning || !code.trim()}
                  className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-cyan-900"
                >
                  {isRunning ? "Running..." : "Run And Validate"}
                </button>
                <button
                  onClick={loadCanonicalAnswer}
                  className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:bg-slate-900"
                >
                  Load Canonical
                </button>
                <button
                  onClick={clearEditor}
                  className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:bg-slate-900"
                >
                  Clear
                </button>
              </div>

              {result && (
                <div className="space-y-3">
                  <div
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                      result.solved
                        ? "border-emerald-500 bg-emerald-950 text-emerald-300"
                        : "border-rose-500 bg-rose-950 text-rose-300"
                    }`}
                  >
                    {result.solved
                      ? "Valid Answer: requirements satisfied."
                      : result.runtimeError
                        ? "Invalid Answer: your code raised a runtime error."
                        : "Invalid Answer: output or required instruction intent did not match."}
                  </div>

                  <div>
                    <h3 className="mb-2 text-xs uppercase tracking-wide text-slate-400">Program Output</h3>
                    <pre className="overflow-auto rounded-lg border border-slate-700 bg-[#0d1420] p-3 text-sm text-slate-100 whitespace-pre-wrap">
                      {result.output || "(no output)"}
                    </pre>
                  </div>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-500 bg-amber-950/50 p-4 text-amber-200">
            No machine problems found for this scene.
          </div>
        )}
      </div>
    </div>
  );
}
