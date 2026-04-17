import { describe, expect, it } from "vitest";
import { validateMachineProblemSolution } from "../src/game/data/mps";
import type { MachineProblem } from "../src/game/types/mp.types";

function createProblem(problem: string, correctCode: string): MachineProblem {
  return {
    problem,
    correct_code: correctCode,
    expected_output: "",
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
  it("accepts canonical solution when spacing differs", () => {
    const problem = createProblem(
      "Create a variable named 'trees' and assign it the value 100. Print the variable.",
      "trees = 100\nprint(trees)"
    );

    const userCode = "  trees=100\n\nprint(trees)  ";
    expect(validateMachineProblemSolution(problem, userCode)).toBe(true);
  });

  it("does not require for-loop for prepositional 'for' wording", () => {
    const problem = createProblem(
      "Create a function square(n) and print the result for n = 6.",
      "def square(n):\n    return n * n\n\nprint(square(6))"
    );

    expect(validateMachineProblemSolution(problem, problem.correct_code)).toBe(true);
  });

  it("does not require boolean 'and' for arithmetic wording", () => {
    const problem = createProblem(
      "Add 50 and 25 and print the result.",
      "print(50 + 25)"
    );

    expect(validateMachineProblemSolution(problem, problem.correct_code)).toBe(true);
  });

  it("does not require boolean 'or' for phrase like odd or even", () => {
    const problem = createProblem(
      "Print whether the number 11 is odd or even using an if statement.",
      "n = 11\nif n % 2 == 0:\n    print('even')\nelse:\n    print('odd')"
    );

    expect(validateMachineProblemSolution(problem, problem.correct_code)).toBe(true);
  });

  it("still rejects incorrect code", () => {
    const problem = createProblem(
      "Create a variable named 'trees' and assign it the value 100. Print the variable.",
      "trees = 100\nprint(trees)"
    );

    expect(validateMachineProblemSolution(problem, "print('wrong')")).toBe(false);
  });
});
