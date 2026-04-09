type ModuleVisibility = "public" | "internal";

export type PythonModuleRecord = {
    name: string;
    code: string;
    sourcePath: string;
    visibility: ModuleVisibility;
    prelude: boolean;
    description?: string;
};

const pythonModuleSources = import.meta.glob<string>("./python/**/*.py", {
    eager: true,
    query: "?raw",
    import: "default"
}) as Record<string, string>;

const filesystemModuleRecords = createFilesystemModuleRecords();

const moduleRegistry: Map<string, PythonModuleRecord> = new Map();
const manualPublicModuleNames: Set<string> = new Set();

function createFilesystemModuleRecords(): PythonModuleRecord[] {
    return Object.entries(pythonModuleSources)
        .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
        .map(([sourcePath, code]) => {
            const name = sourcePathToModuleName(sourcePath);
            const visibility = getModuleVisibility(sourcePath, name);

            return {
                name,
                code,
                sourcePath,
                visibility,
                prelude: name === "builtin",
                description: getModuleDescription(name, visibility)
            };
        });
}

function sourcePathToModuleName(sourcePath: string): string {
    const normalizedPath = sourcePath.replace(/\\/g, "/").replace(/^\.\//, "");
    const pathWithoutPrefix = normalizedPath.startsWith("python/")
        ? normalizedPath.slice("python/".length)
        : normalizedPath;
    const pathWithoutExtension = pathWithoutPrefix.endsWith(".py")
        ? pathWithoutPrefix.slice(0, -3)
        : pathWithoutPrefix;

    if (pathWithoutExtension.endsWith("/__init__")) {
        return pathWithoutExtension.slice(0, -"/__init__".length).replace(/\//g, ".");
    }

    return pathWithoutExtension.replace(/\//g, ".");
}

function getModuleVisibility(sourcePath: string, moduleName: string): ModuleVisibility {
    const fileName = sourcePath.replace(/\\/g, "/").split("/").pop() ?? "";

    if (fileName.startsWith("_") || fileName === "__init__.py") {
        return "internal";
    }

    if (moduleName === "abstracts" || moduleName === "builtin") {
        return "internal";
    }

    return "public";
}

function getModuleDescription(name: string, visibility: ModuleVisibility): string {
    if (name === "builtin") {
        return "Preloaded runtime helpers";
    }

    if (visibility === "internal") {
        return "Internal support module";
    }

    return "User-importable module";
}

function ensureInitialized(): void {
    if (moduleRegistry.size === 0) {
        initializePythonModules();
    }
}

export function initializePythonModules(): void {
    moduleRegistry.clear();
    manualPublicModuleNames.clear();

    for (const moduleRecord of filesystemModuleRecords) {
        moduleRegistry.set(moduleRecord.name, moduleRecord);
    }
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
    const pythonIndex = normalizedPath.lastIndexOf("python/");
    const relativePath = pythonIndex >= 0
        ? normalizedPath.slice(pythonIndex + "python/".length)
        : normalizedPath;
    const pathWithoutExtension = relativePath.endsWith(".py")
        ? relativePath.slice(0, -3)
        : relativePath;

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
