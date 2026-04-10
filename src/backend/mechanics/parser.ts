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

let runtimeHooks: PythonRuntimeHooks = {};

export function setPythonRuntimeHooks(hooks: PythonRuntimeHooks): void {
    runtimeHooks = {
        ...runtimeHooks,
        ...hooks
    };
}

export function clearPythonRuntimeHooks(): void {
    runtimeHooks = {};
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
            return remapToPy(result);
        });
    }

    return (...args: unknown[]) => fn(...args);
}

function installRuntimeBridgeBuiltins(): void {
    if (!Sk) {
        return;
    }

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
        const sourceCode = builtinPrelude ? `${builtinPrelude}\n\n${transformedCode}` : transformedCode;

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

        Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, sourceCode))
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

