declare var Sk: any;

import { parser } from "@lezer/python";
import {
    clearPythonModules,
    getAllPythonModules,
    getBuiltinPreludeCode,
    getPythonModule,
    getPublicPythonModuleNames,
    initializePythonModules,
    isPublicPythonModule,
    registerPythonModule,
    registerPythonModules,
    unregisterPythonModule,
    shouldSkipBuiltinForRequest,
    resolvePythonModule,
    whitelistPythonModule,
    type PythonModuleRecord
} from "./module-registry.ts";

export type CustomModule = {
    name: string;
    code: string;
    description?: string;
    visibility?: "public" | "internal";
    prelude?: boolean;
    sourcePath?: string;
};

export type PythonModuleCallEvent = {
    name: string;
    payload?: unknown;
};

export type PythonRuntimeHooks = {
    onFunctionCall?: (event: PythonModuleCallEvent) => void;
    getStateValue?: (path: string, fallback?: unknown) => unknown;
};

export type PythonExecutionOptions = {
    defaultInstructionDelayMs?: number;
    enableStatementLogging?: boolean;
};

let runtimeHooks: PythonRuntimeHooks = {};
let runtimeExecutionOptions: Required<PythonExecutionOptions> = {
    defaultInstructionDelayMs: 1000,
    enableStatementLogging: true
};
let activeInstructionDelayMs = 0;

export function setPythonRuntimeHooks(hooks: PythonRuntimeHooks): void {
    runtimeHooks = {
        ...runtimeHooks,
        ...hooks
    };
}

export function clearPythonRuntimeHooks(): void {
    runtimeHooks = {};
}

export function setPythonExecutionOptions(options: PythonExecutionOptions): void {
    runtimeExecutionOptions = {
        ...runtimeExecutionOptions,
        ...options,
        defaultInstructionDelayMs: normalizeDelay(options.defaultInstructionDelayMs, runtimeExecutionOptions.defaultInstructionDelayMs)
    };
}

export function getPythonExecutionOptions(): Required<PythonExecutionOptions> {
    return {
        ...runtimeExecutionOptions
    };
}

function normalizeDelay(value: unknown, fallback = 0): number {
    if (typeof value === "number" && Number.isFinite(value)) {
        return Math.max(0, Math.floor(value));
    }

    if (typeof value === "string") {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
            return Math.max(0, Math.floor(parsed));
        }
    }

    return Math.max(0, Math.floor(fallback));
}

function delayMs(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function remapToJs(value: any): unknown {
    if (Sk?.ffi?.remapToJs) {
        return Sk.ffi.remapToJs(value);
    }

    return value;
}

function remapToPy(value: unknown): any {
    if (Sk?.ffi?.remapToPy) {
        return Sk.ffi.remapToPy(value);
    }

    if (value === undefined || value === null) {
        return Sk?.builtin?.none?.none$ ?? null;
    }

    return value;
}

function createSkBuiltinFunction(fn: (...args: unknown[]) => unknown): any {
    if (Sk?.builtin?.func) {
        return new Sk.builtin.func((...pythonArgs: any[]) => {
            const jsArgs = pythonArgs.map((arg) => remapToJs(arg));
            const result = fn(...jsArgs);

            if (result && typeof (result as Promise<unknown>).then === "function" && Sk?.misceval?.promiseToSuspension) {
                return Sk.misceval.promiseToSuspension((result as Promise<unknown>).then((resolvedValue) => remapToPy(resolvedValue)));
            }

            return remapToPy(result);
        });
    }

    return (...args: unknown[]) => fn(...args);
}

function installRuntimeBridgeBuiltins(): void {
    if (!Sk) {
        return;
    }

    activeInstructionDelayMs = runtimeExecutionOptions.defaultInstructionDelayMs;

    const builtins = Sk.builtins ?? (Sk.builtins = {});

    builtins.__pyquest_callback = createSkBuiltinFunction((eventName: unknown, payload?: unknown) => {
        const normalizedName = typeof eventName === "string" ? eventName : String(eventName ?? "");
        runtimeHooks.onFunctionCall?.({
            name: normalizedName,
            payload
        });
        return payload;
    });

    builtins.__pyquest_state = createSkBuiltinFunction((path: unknown, fallback?: unknown) => {
        const normalizedPath = typeof path === "string" ? path : String(path ?? "");
        const value = runtimeHooks.getStateValue?.(normalizedPath, fallback);

        return value === undefined ? fallback : value;
    });

    builtins.__pyquest_set_delay = createSkBuiltinFunction((delay?: unknown) => {
        activeInstructionDelayMs = normalizeDelay(delay, activeInstructionDelayMs);
        return activeInstructionDelayMs;
    });

    builtins.__pyquest_sleep = createSkBuiltinFunction((delay?: unknown) => {
        const normalizedDelay = normalizeDelay(delay, 0);
        if (normalizedDelay <= 0) {
            return null;
        }

        return delayMs(normalizedDelay);
    });

    builtins.__pyquest_tick = createSkBuiltinFunction((lineNumber: unknown, statementType: unknown, explicitDelay?: unknown) => {
        const resolvedLineNumber = normalizeDelay(lineNumber, 0);
        const resolvedStatementType = typeof statementType === "string" ? statementType : "Statement";
        const hasExplicitDelay = explicitDelay !== undefined && explicitDelay !== null;
        const resolvedDelay = hasExplicitDelay
            ? normalizeDelay(explicitDelay, activeInstructionDelayMs)
            : activeInstructionDelayMs;

        if (runtimeExecutionOptions.enableStatementLogging) {
            runtimeHooks.onFunctionCall?.({
                name: "python.statement",
                payload: {
                    lineNumber: resolvedLineNumber,
                    statementType: resolvedStatementType,
                    delayMs: resolvedDelay
                }
            });
        }

        if (resolvedDelay <= 0) {
            return null;
        }

        return delayMs(resolvedDelay);
    });
}

function stripInlineComment(line: string): string {
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let escaped = false;

    for (let index = 0; index < line.length; index += 1) {
        const char = line[index];

        if (escaped) {
            escaped = false;
            continue;
        }

        if (char === "\\") {
            escaped = true;
            continue;
        }

        if (char === "'" && !inDoubleQuote) {
            inSingleQuote = !inSingleQuote;
            continue;
        }

        if (char === '"' && !inSingleQuote) {
            inDoubleQuote = !inDoubleQuote;
            continue;
        }

        if (char === "#" && !inSingleQuote && !inDoubleQuote) {
            return line.slice(0, index);
        }
    }

    return line;
}

function extractInlineDelayOverride(line: string): number | undefined {
    const match = line.match(/#\s*delay\s*[:=]\s*(\d+)/i);

    if (!match) {
        return undefined;
    }

    return normalizeDelay(Number(match[1]), 0);
}

function inferStatementType(trimmedLine: string): string {
    if (/^print\s*\(/.test(trimmedLine)) {
        return "PrintStatement";
    }

    if (/^async\s+def\b/.test(trimmedLine)) {
        return "AsyncFunctionDefinition";
    }

    if (/^async\s+for\b/.test(trimmedLine)) {
        return "AsyncForLoop";
    }

    if (/^async\s+with\b/.test(trimmedLine)) {
        return "AsyncWithStatement";
    }

    if (/^while\b/.test(trimmedLine)) {
        return "WhileLoop";
    }

    if (/^for\b/.test(trimmedLine)) {
        return "ForLoop";
    }

    if (/^if\b/.test(trimmedLine)) {
        return "IfStatement";
    }

    if (/^match\b/.test(trimmedLine)) {
        return "MatchStatement";
    }

    if (/^def\b/.test(trimmedLine)) {
        return "FunctionDefinition";
    }

    if (/^class\b/.test(trimmedLine)) {
        return "ClassDefinition";
    }

    if (/^return\b/.test(trimmedLine)) {
        return "ReturnStatement";
    }

    if (/^raise\b/.test(trimmedLine)) {
        return "RaiseStatement";
    }

    if (/^assert\b/.test(trimmedLine)) {
        return "AssertStatement";
    }

    if (/^break\b/.test(trimmedLine)) {
        return "BreakStatement";
    }

    if (/^continue\b/.test(trimmedLine)) {
        return "ContinueStatement";
    }

    if (/^pass\b/.test(trimmedLine)) {
        return "PassStatement";
    }

    if (/^del\b/.test(trimmedLine)) {
        return "DeleteStatement";
    }

    if (/^global\b/.test(trimmedLine)) {
        return "GlobalStatement";
    }

    if (/^nonlocal\b/.test(trimmedLine)) {
        return "NonlocalStatement";
    }

    if (/^await\b/.test(trimmedLine)) {
        return "AwaitExpression";
    }

    if (/^[a-zA-Z_][a-zA-Z0-9_\.\[\]]*\s*(\+=|-=|\*=|\/=|%=|\*\*=|\/\/=|&=|\|=|\^=|>>=|<<=)/.test(trimmedLine)) {
        return "AugmentedAssignmentStatement";
    }

    if (/^[a-zA-Z_][a-zA-Z0-9_]*(\s*,\s*[a-zA-Z_][a-zA-Z0-9_]*)*\s*=/.test(trimmedLine)) {
        return "AssignmentStatement";
    }

    if (/^[a-zA-Z_][a-zA-Z0-9_\.]*\s*\(/.test(trimmedLine)) {
        return "FunctionCallStatement";
    }

    if (/^(import\b|from\b)/.test(trimmedLine)) {
        return "ImportStatement";
    }

    if (/^try\b/.test(trimmedLine)) {
        return "TryStatement";
    }

    if (/^with\b/.test(trimmedLine)) {
        return "WithStatement";
    }

    return "Statement";
}

function countChar(text: string, char: string): number {
    return (text.match(new RegExp(`\\${char}`, "g")) ?? []).length;
}

function instrumentPythonInstructions(code: string): string {
    const lines = code.split(/\r?\n/);
    const instrumentedLines: string[] = [];

    let bracketDepth = 0;
    let previousLineContinues = false;
    let previousDecorator = false;

    for (let index = 0; index < lines.length; index += 1) {
        const originalLine = lines[index];
        const trimmedLine = originalLine.trim();
        const isBlank = trimmedLine.length === 0;
        const isComment = trimmedLine.startsWith("#");
        const isDecorator = trimmedLine.startsWith("@");
        const isContinuationBranch = /^(elif\b|else\b|except\b|finally\b|case\b)/.test(trimmedLine);
        const isDocStringLine = /^("""|''')/.test(trimmedLine);
        const inMultilineExpression = previousLineContinues || bracketDepth > 0;

        const shouldInstrument = !isBlank
            && !isComment
            && !isDecorator
            && !isContinuationBranch
            && !isDocStringLine
            && !inMultilineExpression
            && !previousDecorator;

        if (shouldInstrument) {
            const indentation = originalLine.match(/^\s*/) ? (originalLine.match(/^\s*/) as RegExpMatchArray)[0] : "";
            const statementType = inferStatementType(trimmedLine);
            const delayOverride = extractInlineDelayOverride(originalLine);
            const tickCall = delayOverride === undefined
                ? `${indentation}__pyquest_tick(${index + 1}, "${statementType}")`
                : `${indentation}__pyquest_tick(${index + 1}, "${statementType}", ${delayOverride})`;
            instrumentedLines.push(tickCall);
        }

        instrumentedLines.push(originalLine);

        if (isDecorator) {
            previousDecorator = true;
        } else if (!isBlank && !isComment) {
            previousDecorator = false;
        }

        const withoutInlineComment = stripInlineComment(originalLine);
        bracketDepth += countChar(withoutInlineComment, "(")
            + countChar(withoutInlineComment, "[")
            + countChar(withoutInlineComment, "{")
            - countChar(withoutInlineComment, ")")
            - countChar(withoutInlineComment, "]")
            - countChar(withoutInlineComment, "}");

        bracketDepth = Math.max(0, bracketDepth);
        previousLineContinues = /\\\s*$/.test(withoutInlineComment.trimEnd()) || bracketDepth > 0;
    }

    return instrumentedLines.join("\n");
}

function ensurePythonModulesInitialized(): void {
    if (getAllPythonModules().length === 0) {
        initializePythonModules();
    }
}

export function registerModule(module: CustomModule): void {
    registerPythonModule({
        name: module.name,
        code: module.code,
        sourcePath: module.sourcePath ?? module.name,
        visibility: module.visibility ?? "public",
        prelude: module.prelude ?? false,
        isPackage: false,
        description: module.description
    });
}

export function registerModules(modules: CustomModule[]): void {
    registerPythonModules(
        modules.map((module) => ({
            name: module.name,
            code: module.code,
            sourcePath: module.sourcePath ?? module.name,
            visibility: module.visibility ?? "public",
            prelude: module.prelude ?? false,
            isPackage: false,
            description: module.description
        }))
    );
}

export function getModule(name: string): CustomModule | undefined {
    const moduleRecord = getAllPythonModules().find((module: PythonModuleRecord) => module.name === name);

    if (!moduleRecord) {
        return undefined;
    }

    return {
        name: moduleRecord.name,
        code: moduleRecord.code,
        description: moduleRecord.description,
        visibility: moduleRecord.visibility,
        prelude: moduleRecord.prelude,
        sourcePath: moduleRecord.sourcePath
    };
}

export function getAllModules(): CustomModule[] {
    return getAllPythonModules().map((moduleRecord: PythonModuleRecord) => ({
        name: moduleRecord.name,
        code: moduleRecord.code,
        description: moduleRecord.description,
        visibility: moduleRecord.visibility,
        prelude: moduleRecord.prelude,
        sourcePath: moduleRecord.sourcePath
    }));
}

export function clearModules(): void {
    clearPythonModules();
}

export function unregisterModule(moduleName: string): boolean {
    return unregisterPythonModule(moduleName);
}

export function isModuleWhitelisted(moduleName: string): boolean {
    return isPublicPythonModule(moduleName);
}

export function whitelistModule(moduleName: string): void {
    whitelistPythonModule(moduleName);
}

function normalizeImportedModuleName(importedModule: string): string {
    return importedModule.replace(/\s+as\s+.*$/i, "").trim();
}

function expandCustomModuleImports(code: string): string {
    const inlinedModules: Set<string> = new Set();
    const inlinedModuleCode: string[] = [];
    const remainingLines: string[] = [];
    const lines = code.split(/\r?\n/);

    for (const line of lines) {
        const trimmed = line.trim();
        const fromMatch = trimmed.match(/^from\s+([a-zA-Z_][a-zA-Z0-9_.]*)\s+import\s+(.+)$/);

        if (fromMatch) {
            const moduleName = normalizeImportedModuleName(fromMatch[1]);
            const moduleRecord = getPythonModule(moduleName);

            if (moduleRecord && isPublicPythonModule(moduleName)) {
                if (!inlinedModules.has(moduleName)) {
                    inlinedModules.add(moduleName);
                    inlinedModuleCode.push(moduleRecord.code);
                }
                continue;
            }
        }

        const importMatch = trimmed.match(/^import\s+(.+)$/);
        if (importMatch) {
            const requestedModules = importMatch[1]
                .split(",")
                .map((moduleName) => normalizeImportedModuleName(moduleName))
                .filter((moduleName) => moduleName.length > 0);

            if (requestedModules.length > 0) {
                let allInlined = true;

                for (const moduleName of requestedModules) {
                    const moduleRecord = getPythonModule(moduleName);

                    if (!(moduleRecord && isPublicPythonModule(moduleName))) {
                        allInlined = false;
                        break;
                    }

                    if (!inlinedModules.has(moduleName)) {
                        inlinedModules.add(moduleName);
                        inlinedModuleCode.push(moduleRecord.code);
                    }
                }

                if (allInlined) {
                    continue;
                }
            }
        }

        remainingLines.push(line);
    }

    if (inlinedModuleCode.length === 0) {
        return code;
    }

    return `${inlinedModuleCode.join("\n\n")}\n\n${remainingLines.join("\n")}`;
}

export function runPython(code: string): Promise<string> {
    return new Promise((resolve) => {
        ensurePythonModulesInitialized();
        installRuntimeBridgeBuiltins();

        let output = "";
        const builtinPrelude = getBuiltinPreludeCode();
        const transformedCode = expandCustomModuleImports(code);
        const instrumentedCode = instrumentPythonInstructions(transformedCode);
        const sourceCode = builtinPrelude ? `${builtinPrelude}\n\n${instrumentedCode}` : instrumentedCode;

        // Ensure each run starts from a clean import/compiler state so newly loaded modules are used.
        if (Sk?.builtin?.dict) {
            Sk.sysmodules = new Sk.builtin.dict([]);
        }
        Sk.realsyspath = undefined;
        if (typeof Sk.resetCompiler === "function") {
            Sk.resetCompiler();
        }

        Sk.configure({
            output: (text: string) => {
                output += text;
            },
            read: (filename: string) => {
                const module = resolvePythonModule(filename);

                if (module) {
                    return module.code;
                }

                if (shouldSkipBuiltinForRequest(filename)) {
                    throw new Error(`Module '${filename}' is not available. Only registered modules can be imported.`);
                }

                const builtinFiles = Sk.builtinFiles?.files ?? Sk.builtinFiles?.["files"];
                const builtinFile = builtinFiles?.[filename];

                if (builtinFile !== undefined) {
                    return builtinFile;
                }

                throw new Error(`Module '${filename}' is not available. Only registered modules can be imported.`);
            }
        });

        Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, sourceCode, true))
            .then(() => {
                resolve(output);
            })
            .catch((e: any) => {
                output += "Error: " + e.toString();
                resolve(output);
            });
    });
}

export function validatePythonCode(code: string): boolean {
    ensurePythonModulesInitialized();

    const tree = parser.parse(code);
    let allowed = true;

    tree.cursor().iterate((node) => {
        if (node.type.name === "ImportStatement" || node.type.name === "ImportFrom") {
            const importText = code.substring(node.from, node.to);
            const moduleNames = extractModuleNames(importText);

            for (const moduleName of moduleNames) {
                if (!isPublicPythonModule(moduleName)) {
                    allowed = false;
                }
            }

            if (!allowed) {
                return false;
            }
        }
    });

    return allowed;
}

export function validatePythonCodeDetailed(code: string): {
    valid: boolean;
    errors: string[];
} {
    ensurePythonModulesInitialized();

    const tree = parser.parse(code);
    const errors: string[] = [];

    tree.cursor().iterate((node) => {
        if (node.type.name === "ImportStatement" || node.type.name === "ImportFrom") {
            const importText = code.substring(node.from, node.to);
            const moduleNames = extractModuleNames(importText);

            for (const moduleName of moduleNames) {
                if (!isPublicPythonModule(moduleName)) {
                    errors.push(`Import of '${moduleName}' is not allowed. Available modules: ${getPublicPythonModuleNames().join(", ") || "none"}`);
                }
            }
        }
    });

    return {
        valid: errors.length === 0,
        errors
    };
}

function extractModuleNames(importStatement: string): string[] {
    const normalizedStatement = importStatement.trim();

    if (normalizedStatement.startsWith("import ")) {
        return normalizedStatement
            .slice("import ".length)
            .split(",")
            .map((part) => part.trim())
            .map((part) => part.replace(/\s+as\s+.*$/i, ""))
            .filter((part) => part.length > 0);
    }

    const fromMatch = normalizedStatement.match(/^from\s+([a-zA-Z_][a-zA-Z0-9_.]*)\s+import\b/);

    if (fromMatch) {
        return [fromMatch[1]];
    }

    return [];
}

