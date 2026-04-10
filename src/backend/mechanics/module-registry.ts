import { customModules } from "./game-modules.ts";
import type { CustomModule } from "./parser";

type ModuleVisibility = "public" | "internal";

export type PythonModuleRecord = {
    name: string;
    code: string;
    sourcePath: string;
    visibility: ModuleVisibility;
    prelude: boolean;
    description?: string;
};

const moduleRegistry: Map<string, PythonModuleRecord> = new Map();
const manualPublicModuleNames: Set<string> = new Set();

function customModuleToRecord(module: CustomModule): PythonModuleRecord {
    const visibility = module.visibility ?? "public";
    const prelude = module.prelude ?? false;

    return {
        name: module.name,
        code: module.code,
        sourcePath: module.sourcePath ?? module.name,
        visibility,
        prelude,
        description: module.description ?? getModuleDescription(module.name, visibility, prelude)
    };
}

function getModuleDescription(name: string, visibility: ModuleVisibility, prelude: boolean): string {
    if (prelude) {
        return "Preloaded runtime helpers";
    }

    if (visibility === "internal") {
        return "Internal support module";
    }

    if (name.includes(".")) {
        return "User-importable nested module";
    }

    return "User-importable module";
}

function ensureInitialized(): void {
    if (moduleRegistry.size === 0) {
        initializePythonModules();
    }
}

export function initializePythonModules(modules: CustomModule[] = customModules): void {
    moduleRegistry.clear();
    manualPublicModuleNames.clear();

    registerPythonModules(modules.map((module) => customModuleToRecord(module)));
}

export function clearPythonModules(): void {
    moduleRegistry.clear();
    manualPublicModuleNames.clear();
}

export function registerPythonModule(moduleRecord: PythonModuleRecord): void {
    moduleRegistry.set(moduleRecord.name, moduleRecord);
}

export function registerPythonModules(moduleRecords: PythonModuleRecord[]): void {
    for (const moduleRecord of moduleRecords) {
        registerPythonModule(moduleRecord);
    }
}

export function unregisterPythonModule(moduleName: string): boolean {
    manualPublicModuleNames.delete(moduleName);
    return moduleRegistry.delete(moduleName);
}

export function getPythonModule(name: string): PythonModuleRecord | undefined {
    ensureInitialized();
    return moduleRegistry.get(name);
}

export function getAllPythonModules(): PythonModuleRecord[] {
    ensureInitialized();
    return Array.from(moduleRegistry.values());
}

export function getPublicPythonModules(): PythonModuleRecord[] {
    ensureInitialized();
    return Array.from(moduleRegistry.values()).filter((moduleRecord) => isPublicPythonModule(moduleRecord.name));
}

export function getPublicPythonModuleNames(): string[] {
    ensureInitialized();
    return getPublicPythonModules().map((moduleRecord) => moduleRecord.name);
}

export function isPublicPythonModule(moduleName: string): boolean {
    ensureInitialized();

    const moduleRecord = moduleRegistry.get(moduleName);
    if (moduleRecord) {
        return moduleRecord.visibility === "public" || manualPublicModuleNames.has(moduleName);
    }

    return manualPublicModuleNames.has(moduleName);
}

export function whitelistPythonModule(moduleName: string): void {
    manualPublicModuleNames.add(moduleName);
}

export function getBuiltinPreludeCode(): string {
    ensureInitialized();

    return Array.from(moduleRegistry.values())
        .filter((moduleRecord) => moduleRecord.prelude)
        .map((moduleRecord) => moduleRecord.code)
        .join("\n\n");
}

function normalizeModuleRequest(filename: string): string {
    const strippedQuery = filename.split("?")[0];
    const normalizedPath = strippedQuery.replace(/\\/g, "/").replace(/^\.\//, "").replace(/^\/+/, "");
    const pathWithoutExtension = normalizedPath.endsWith(".py")
        ? normalizedPath.slice(0, -3)
        : normalizedPath;

    if (pathWithoutExtension.endsWith("/__init__")) {
        return pathWithoutExtension.slice(0, -"/__init__".length).replace(/\//g, ".");
    }

    return pathWithoutExtension.replace(/\//g, ".");
}

export function resolvePythonModule(filename: string): PythonModuleRecord | undefined {
    ensureInitialized();

    const normalizedRequest = normalizeModuleRequest(filename);
    const shortName = normalizedRequest.split(".").pop() ?? normalizedRequest;

    return moduleRegistry.get(normalizedRequest) ?? moduleRegistry.get(shortName);
}
