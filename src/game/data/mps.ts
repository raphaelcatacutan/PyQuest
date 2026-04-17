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

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractQuotedTokens(problemText: string): string[] {
  const tokens: string[] = [];
  const regex = /['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null = regex.exec(problemText);

  while (match) {
    const token = match[1]?.trim();
    if (token) {
      tokens.push(token);
    }
    match = regex.exec(problemText);
  }

  return tokens;
}

function extractVariableNames(problemText: string): string[] {
  const names = new Set<string>();
  const patterns = [
    /variable(?:\s+named|\s+called)?\s+['"]?([A-Za-z_][A-Za-z0-9_]*)['"]?/gi,
    /assign\s+it\s+to\s+a\s+variable\s+called\s+['"]?([A-Za-z_][A-Za-z0-9_]*)['"]?/gi,
    /set\s+['"]?([A-Za-z_][A-Za-z0-9_]*)['"]?\s+to\s+/gi,
  ];

  patterns.forEach((pattern) => {
    let match = pattern.exec(problemText);
    while (match) {
      if (match[1]) {
        names.add(match[1]);
      }
      match = pattern.exec(problemText);
    }
  });

  return [...names];
}

function extractFunctionNames(problemText: string): string[] {
  const names = new Set<string>();
  const patterns = [
    /function\s+named\s+['"]([A-Za-z_][A-Za-z0-9_]*)['"]/gi,
    /define\s+a\s+function\s+['"]([A-Za-z_][A-Za-z0-9_]*)['"]/gi,
    /create\s+a\s+function\s+['"]([A-Za-z_][A-Za-z0-9_]*)['"]/gi,
    /def\s+['"]([A-Za-z_][A-Za-z0-9_]*)['"]/gi,
  ];

  patterns.forEach((pattern) => {
    let match = pattern.exec(problemText);
    while (match) {
      if (match[1]) {
        names.add(match[1]);
      }
      match = pattern.exec(problemText);
    }
  });

  return [...names];
}

function extractNumericTokens(problemText: string): string[] {
  const tokens = new Set<string>();
  const regex = /\b\d+(?:\.\d+)?\b/g;
  let match = regex.exec(problemText);

  while (match) {
    if (match[0]) {
      tokens.add(match[0]);
    }
    match = regex.exec(problemText);
  }

  return [...tokens];
}

function containsRegex(code: string, regex: RegExp): boolean {
  return regex.test(code);
}

function hasAnyPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function requiresForLoop(problemText: string): boolean {
  return hasAnyPattern(problemText, [
    /\bfor\s+loop\b/,
    /\bfor[-\s]?each\b/,
    /\bloop\s+through\b/,
    /\biterate\b/,
    /\buse\s+a\s+for\b/,
    /\busing\s+a\s+for\b/,
    /\bfor\b[^.\n]*\bin\b/
  ]);
}

function requiresLogicalOperator(problemText: string, operator: "and" | "or" | "not"): boolean {
  const quotedOperator = new RegExp(`["']${operator}["']\\s+operator`, "i");
  const namedOperator = new RegExp(`\\b${operator}\\s+operator\\b`, "i");

  if (quotedOperator.test(problemText) || namedOperator.test(problemText)) {
    return true;
  }

  if (/\blogical operators?\b/i.test(problemText)) {
    return new RegExp(`\\b${operator}\\b`, "i").test(problemText);
  }

  return false;
}

function normalizeCodeForComparison(code: string): string {
  return code
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
}

function buildProblemChecks(problemText: string): RegExp[] {
  const checks: RegExp[] = [];
  const lowerProblem = problemText.toLowerCase();

  if (lowerProblem.includes("print")) checks.push(/\bprint\s*\(/m);
  if (/\bwhile\b/.test(lowerProblem)) checks.push(/^\s*while\b/m);
  if (requiresForLoop(lowerProblem)) checks.push(/^\s*for\b/m);
  if (/\bif\b/.test(lowerProblem)) checks.push(/^\s*if\b/m);
  if (/\belif\b/.test(lowerProblem)) checks.push(/^\s*elif\b/m);
  if (/\belse\b/.test(lowerProblem)) checks.push(/^\s*else\b/m);
  if (/\bmatch\b/.test(lowerProblem)) checks.push(/^\s*match\b/m);
  if (/\bcase\b/.test(lowerProblem)) checks.push(/^\s*case\b/m);
  if (/\bbreak\b/.test(lowerProblem)) checks.push(/\bbreak\b/m);
  if (/\bcontinue\b/.test(lowerProblem)) checks.push(/\bcontinue\b/m);
  if (/\breturn\b/.test(lowerProblem)) checks.push(/\breturn\b/m);
  if (/\bpass\b/.test(lowerProblem)) checks.push(/\bpass\b/m);
  if (/\bfunction\b|\bdefine\b|\bdef\b/.test(lowerProblem)) checks.push(/^\s*def\s+[A-Za-z_][A-Za-z0-9_]*\s*\(/m);
  if (/\bclass\b/.test(lowerProblem) || lowerProblem.includes("object-oriented programming") || /\boop\b/.test(lowerProblem)) {
    checks.push(/^\s*class\s+[A-Za-z_][A-Za-z0-9_]*\s*(\([^)]*\))?\s*:/m);
  }
  if (lowerProblem.includes("abstraction") || lowerProblem.includes("abstract")) {
    checks.push(/(raise\s+NotImplementedError|\bpass\b)/m);
  }
  if (lowerProblem.includes("inheritance") || lowerProblem.includes("inherits") || lowerProblem.includes("subclass")) {
    checks.push(/^\s*class\s+[A-Za-z_][A-Za-z0-9_]*\s*\([^)]*\)\s*:/m);
  }
  if (lowerProblem.includes("polymorphism") || lowerProblem.includes("override")) {
    checks.push(/^\s*def\s+[A-Za-z_][A-Za-z0-9_]*\s*\(\s*self(?:\s*,|\s*\))/m);
  }
  if (lowerProblem.includes("encapsulation") || lowerProblem.includes("private attribute") || lowerProblem.includes("private")) {
    checks.push(/self\._[A-Za-z_][A-Za-z0-9_]*/m);
  }
  if (lowerProblem.includes("super()") || /\bsuper\b/.test(lowerProblem)) {
    checks.push(/\bsuper\s*\(\s*\)\s*(\.\s*__init__\s*\()?/m);
  }
  if (lowerProblem.includes("static method") || lowerProblem.includes("staticmethod")) {
    checks.push(/@staticmethod/m);
  }
  if (lowerProblem.includes("default argument") || lowerProblem.includes("default arguments")) {
    checks.push(/^\s*def\s+[A-Za-z_][A-Za-z0-9_]*\s*\([^)]*=\s*[^)]*\)\s*:/m);
  }
  if (lowerProblem.includes("*args")) checks.push(/\*args\b/m);
  if (lowerProblem.includes("**kwargs")) checks.push(/\*\*kwargs\b/m);

  if (/(create|define)\s+a\s+list|list\s+named|\blists\b/.test(lowerProblem)) checks.push(/\[[^\]]*\]/m);
  if (/(create|define)\s+a\s+dictionary|dictionary\s+named|\bdictionary\b|\bdict\b/.test(lowerProblem)) checks.push(/\{[^{}]*:[^{}]*\}/m);
  if (/(create|define)\s+a\s+tuple|tuple\s+named|\btuples\b|\btuple\b/.test(lowerProblem)) checks.push(/\([^\)]*,[^\)]*\)/m);
  if (/(create|define)\s+a\s+set|set\s+named|unique\s+values|\bsets\b/.test(lowerProblem)) checks.push(/\{[^{}]*\}/m);

  if (lowerProblem.includes("membership operator") || /\bnot in\b/.test(lowerProblem)) {
    checks.push(/\b(?:not\s+in|in)\b/m);
  }

  const builtinFunctionNames = ["len", "sum", "max", "min", "range", "sorted", "type", "int", "str", "float", "print"];
  builtinFunctionNames.forEach((name) => {
    const mentionPattern = new RegExp(`\\b${name}\\b`);
    if (mentionPattern.test(lowerProblem)) {
      checks.push(new RegExp(`\\b${escapeRegex(name)}\\s*\\(`, "m"));
    }
  });

  if (lowerProblem.includes("uppercase")) checks.push(/\.upper\s*\(/m);
  if (lowerProblem.includes("lowercase")) checks.push(/\.lower\s*\(/m);

  if (lowerProblem.includes("<=")) checks.push(/<=/m);
  if (lowerProblem.includes(">=")) checks.push(/>=/m);
  if (lowerProblem.includes("!=")) checks.push(/!=/m);
  if (lowerProblem.includes("==")) checks.push(/==/m);
  if (lowerProblem.includes("%")) checks.push(/%/m);
  if (lowerProblem.includes("**") || lowerProblem.includes("power")) checks.push(/\*\*/m);
  if (lowerProblem.includes("+=")) checks.push(/\+=/m);
  if (lowerProblem.includes("-=")) checks.push(/-=/m);
  if (requiresLogicalOperator(lowerProblem, "and")) checks.push(/\band\b/m);
  if (requiresLogicalOperator(lowerProblem, "or")) checks.push(/\bor\b/m);
  if (requiresLogicalOperator(lowerProblem, "not")) checks.push(/\bnot\b/m);

  const variableNames = extractVariableNames(problemText);
  variableNames.forEach((name) => {
    checks.push(new RegExp(`\\b${escapeRegex(name)}\\s*=`, "m"));
  });

  const functionNames = extractFunctionNames(problemText);
  functionNames.forEach((name) => {
    checks.push(new RegExp(`^\\s*def\\s+${escapeRegex(name)}\\s*\\(`, "m"));

    if (/\bcall\b/.test(lowerProblem)) {
      checks.push(new RegExp(`\\b${escapeRegex(name)}\\s*\\(`, "m"));
    }
  });

  const quotedTokens = extractQuotedTokens(problemText);
  quotedTokens.forEach((token) => {
    const isNamedIdentifier = variableNames.includes(token) || functionNames.includes(token);
    const isIdentifierToken = /^[A-Za-z_][A-Za-z0-9_]*$/.test(token);
    if (!isNamedIdentifier && (!isIdentifierToken || /\bmessage\b|\bprint\b/.test(lowerProblem))) {
      checks.push(new RegExp(`[\"']${escapeRegex(token)}[\"']`, "m"));
    }
  });

  const numericTokens = extractNumericTokens(problemText);
  numericTokens.forEach((token) => {
    checks.push(new RegExp(`\\b${escapeRegex(token)}\\b`, "m"));
  });

  return checks;
}

export const validateMachineProblemSolution = (problem: MachineProblem, code: string): boolean => {
  const normalizedCode = code.replace(/\r/g, "");
  if (!normalizedCode.trim()) {
    return false;
  }

  const comparableCode = normalizeCodeForComparison(normalizedCode);
  const comparableCorrectCode = normalizeCodeForComparison(problem.correct_code || "");
  if (comparableCorrectCode.length > 0 && comparableCode === comparableCorrectCode) {
    return true;
  }

  const checks = buildProblemChecks(problem.problem || "");
  if (checks.length === 0) {
    return comparableCode.length > 0;
  }

  return checks.every((regex) => containsRegex(normalizedCode, regex));
}
