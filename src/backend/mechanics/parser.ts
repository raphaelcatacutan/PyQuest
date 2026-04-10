declare var Sk: any;

import { parser } from "@lezer/python";
import {
    clearPythonModules,
    getAllPythonModules,
    getBuiltinPreludeCode,
    getPublicPythonModuleNames,
    initializePythonModules,
    isPublicPythonModule,
    registerPythonModule,
    registerPythonModules,
    unregisterPythonModule,
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

export function runPython(code: string): Promise<string> {
    return new Promise((resolve) => {
        ensurePythonModulesInitialized();

        let output = "";
        const builtinPrelude = getBuiltinPreludeCode();
        const sourceCode = builtinPrelude ? `${builtinPrelude}\n\n${code}` : code;

        Sk.configure({
            output: (text: string) => {
                output += text;
            },
            read: (filename: string) => {
                const builtinFiles = Sk.builtinFiles?.files ?? Sk.builtinFiles?.["files"];
                const builtinFile = builtinFiles?.[filename];

                if (builtinFile !== undefined) {
                    return builtinFile;
                }

                const module = resolvePythonModule(filename);

                if (module) {
                    return module.code;
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

