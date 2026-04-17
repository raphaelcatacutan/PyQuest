import { describe, expect, it } from "vitest";
import { validateMachineProblemSolution } from "../src/game/data/mps";
import type { MachineProblem } from "../src/game/types/mp.types";

function createProblem(problem: string, correctCode: string, expectedOutput: string): MachineProblem {
  return {
    problem,
    correct_code: correctCode,
    expected_output: expectedOutput,
    reward: {
      xpDropMin: 0,
      xpDropMax: 0,
      coinDropMin: 0,
      coinDropMax: 0,
      weapons: [],
      armors: [],
      consumables: []
    }
  };
}

describe("validateMachineProblemSolution", () => {
  it("accepts alternative implementations when runtime output matches expected output", () => {
    const problem = createProblem(
      "Add 50 and 25 and print the result.",
      "print(50 + 25)",
      "75"
    );

    const userCode = "a = 50\nb = 25\nprint(a + b)";
    expect(validateMachineProblemSolution(problem, userCode, "75\n")).toBe(true);
  });

  it("rejects shortcut output-only answers for explicit arithmetic instructions", () => {
    const problem = createProblem(
      "Add 50 and 25 and print the result.",
      "print(50 + 25)",
      "75"
    );

    expect(validateMachineProblemSolution(problem, "print(75)", "75")).toBe(false);
  });

  it("accepts multiline output when lines match in order", () => {
    const problem = createProblem(
      "Create a while loop that prints 'i' from 1 to 3. Start i at 1.",
      "i = 1\nwhile i <= 3:\n    print(i)\n    i += 1",
      "1\n2\n3"
    );

    expect(validateMachineProblemSolution(problem, "for i in range(1, 4):\n    print(i)", "1\n2\n3\n")).toBe(true);
  });

  it("rejects output mismatch", () => {
    const problem = createProblem(
      "Add 50 and 25 and print the result.",
      "print(50 + 25)",
      "75"
    );

    expect(validateMachineProblemSolution(problem, "print(100)", "100")).toBe(false);
  });

  it("rejects runtime error outputs", () => {
    const problem = createProblem(
      "Print the message 'Exploring the Forest' to the console.",
      "print('Exploring the Forest')",
      "Exploring the Forest"
    );

    expect(
      validateMachineProblemSolution(problem, "print('Exploring the Forest')", "Error: NameError: name 'x' is not defined"),
    ).toBe(false);
  });

  it("falls back to normalized canonical comparison when expected output is empty", () => {
    const problem = createProblem(
      "Create a variable named 'trees' and assign it the value 100. Print the variable.",
      "trees = 100\nprint(trees)",
      ""
    );

    expect(validateMachineProblemSolution(problem, "trees=100\nprint(trees)")).toBe(true);
    expect(validateMachineProblemSolution(problem, "print('wrong')")).toBe(false);
  });
});
