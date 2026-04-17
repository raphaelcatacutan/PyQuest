import mpData from '../json/mps.json'
import { MPData, MachineProblem } from '../types/mp.types'

/**
 * 
 *  Guide Database
 */

export const MachineProblems: MPData = mpData as MPData

const FALLBACK_PROBLEM: MachineProblem = {
  problem: "No machine problem is available for this scene yet.",
  correct_code: "print('No machine problem is available for this scene yet.')",
  expected_output: "No machine problem is available for this scene yet.",
  reward: {
    xpDropMin: 0,
    xpDropMax: 0,
    coinDropMin: 0,
    coinDropMax: 0,
    weapons: [],
    armors: [],
    consumables: [],
  },
};

export const getRandomMPByScene = (scene: string): MachineProblem => {
  const problemsForLevel = MachineProblems[scene];
  if (!Array.isArray(problemsForLevel) || problemsForLevel.length === 0) {
    return FALLBACK_PROBLEM;
  }

  const randomIndex = Math.floor(Math.random() * problemsForLevel.length);
  return problemsForLevel[randomIndex] ?? FALLBACK_PROBLEM;
}

function stripInlinePythonComments(code: string): string {
  const lines = code.replace(/\r/g, "").split("\n");

  return lines
    .map((line) => {
      let quote: "'" | '"' | null = null;
      let escaped = false;
      let result = "";

      for (let index = 0; index < line.length; index += 1) {
        const char = line[index] ?? "";

        if (quote) {
          result += char;

          if (escaped) {
            escaped = false;
            continue;
          }

          if (char === "\\") {
            escaped = true;
            continue;
          }

          if (char === quote) {
            quote = null;
          }

          continue;
        }

        if (char === "'" || char === '"') {
          quote = char;
          result += char;
          continue;
        }

        if (char === "#") {
          break;
        }

        result += char;
      }

      return result;
    })
    .join("\n");
}

function compactCodeOutsideStrings(code: string): string {
  let quote: "'" | '"' | null = null;
  let escaped = false;
  let result = "";

  for (let index = 0; index < code.length; index += 1) {
    const char = code[index] ?? "";

    if (quote) {
      result += char;

      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === "'" || char === '"') {
      quote = char;
      result += char;
      continue;
    }

    if (/\s/.test(char)) {
      continue;
    }

    result += char;
  }

  return result;
}

function normalizeCodeForComparison(code: string): string {
  const withoutComments = stripInlinePythonComments(code);
  return compactCodeOutsideStrings(withoutComments);
}

function normalizeProgramOutput(output: string): string {
  return output
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
}

function hasRuntimeError(output: string): boolean {
  return output
    .replace(/\r/g, "")
    .split("\n")
    .some((line) => /^Error:/i.test(line.trim()));
}

type ArithmeticOperator = "+" | "-" | "*" | "/" | "%" | "**";

type ArithmeticIntentConstraint = {
  operator: ArithmeticOperator;
  operands: string[];
};

function resolveArithmeticIntentConstraint(problemText: string): ArithmeticIntentConstraint | null {
  const patterns: Array<{
    regex: RegExp;
    operator: ArithmeticOperator;
  }> = [
    {
      regex: /\badd\s+(\d+(?:\.\d+)?)\s+and\s+(\d+(?:\.\d+)?)/i,
      operator: "+",
    },
    {
      regex: /\bsubtract\s+(\d+(?:\.\d+)?)\s+from\s+(\d+(?:\.\d+)?)/i,
      operator: "-",
    },
    {
      regex: /\bmultiply\s+(\d+(?:\.\d+)?)\s+by\s+(\d+(?:\.\d+)?)/i,
      operator: "*",
    },
    {
      regex: /\bdivide\s+(\d+(?:\.\d+)?)\s+by\s+(\d+(?:\.\d+)?)/i,
      operator: "/",
    },
    {
      regex: /\bremainder\s+of\s+(\d+(?:\.\d+)?)\s+divided\s+by\s+(\d+(?:\.\d+)?)/i,
      operator: "%",
    },
    {
      regex: /\bmodulo\b[^.\n]*?(\d+(?:\.\d+)?)\s+(?:divided\s+by|by)\s+(\d+(?:\.\d+)?)/i,
      operator: "%",
    },
    {
      regex: /(\d+(?:\.\d+)?)\s+to\s+the\s+power\s+of\s+(\d+(?:\.\d+)?)/i,
      operator: "**",
    },
  ];

  for (const pattern of patterns) {
    const match = problemText.match(pattern.regex);
    if (match && match[1] && match[2]) {
      return {
        operator: pattern.operator,
        operands: [match[1], match[2]],
      };
    }
  }

  return null;
}

function stripPythonStrings(code: string): string {
  let quote: "'" | '"' | null = null;
  let escaped = false;
  let result = "";

  for (let index = 0; index < code.length; index += 1) {
    const char = code[index] ?? "";

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }

    result += char;
  }

  return result;
}

function extractNumericLiterals(code: string): Set<string> {
  const literals = new Set<string>();
  const regex = /\b\d+(?:\.\d+)?\b/g;
  let match = regex.exec(code);

  while (match) {
    if (match[0]) {
      literals.add(match[0]);
    }
    match = regex.exec(code);
  }

  return literals;
}

function satisfiesInstructionIntent(problem: MachineProblem, code: string): boolean {
  const arithmeticConstraint = resolveArithmeticIntentConstraint(problem.problem || "");
  if (!arithmeticConstraint) {
    return true;
  }

  const codeWithoutComments = stripInlinePythonComments(code);
  const codeWithoutStrings = stripPythonStrings(codeWithoutComments);
  const numericLiterals = extractNumericLiterals(codeWithoutStrings);

  const hasOperator = arithmeticConstraint.operator === "**"
    ? codeWithoutStrings.includes("**")
    : codeWithoutStrings.includes(arithmeticConstraint.operator);

  if (!hasOperator) {
    return false;
  }

  return arithmeticConstraint.operands.every((operand) => numericLiterals.has(operand));
}

export const validateMachineProblemSolution = (
  problem: MachineProblem,
  code: string,
  runtimeOutput = "",
): boolean => {
  if (hasRuntimeError(runtimeOutput)) {
    return false;
  }

  const normalizedExpectedOutput = normalizeProgramOutput(problem.expected_output || "");
  if (normalizedExpectedOutput.length > 0) {
    const normalizedRuntimeOutput = normalizeProgramOutput(runtimeOutput);
    if (normalizedRuntimeOutput !== normalizedExpectedOutput) {
      return false;
    }

    return satisfiesInstructionIntent(problem, code);
  }

  const normalizedUserCode = normalizeCodeForComparison(code);
  if (!normalizedUserCode.trim()) {
    return false;
  }

  const normalizedCanonicalCode = normalizeCodeForComparison(problem.correct_code || "");
  if (!normalizedCanonicalCode) {
    return normalizedUserCode.length > 0;
  }

  return normalizedUserCode === normalizedCanonicalCode;
}
