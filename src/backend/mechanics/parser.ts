declare var Sk: any;

import { parser } from "@lezer/python";

/**
 * Type for watcher callbacks
 */
export type VariableWatcher = {
    variableName: string;
    callback: (newValue: any, oldValue: any) => void;
};

/**
 * Type for custom Python modules
 */
export type CustomModule = {
    name: string;
    code: string; // Python code as a string
    description?: string;
};

/**
 * Registry of custom modules available for import
 */
const customModules: Map<string, CustomModule> = new Map();

/**
 * Whitelist of module names that are allowed to be imported
 */
const importWhitelist: Set<string> = new Set();

/**
 * Registry of variable watchers
 */
const watchers: Map<string, VariableWatcher[]> = new Map();

/**
 * Tracked variable values
 */
const trackedValues: Map<string, any> = new Map();

/**
 * Register a watcher for a Python variable
 * @param variableName - Name of the variable to watch (e.g., "Player.Health")
 * @param callback - Function to call when variable changes
 */
export function watchVariable(
    variableName: string,
    callback: (newValue: any, oldValue: any) => void
): void {
    if (!watchers.has(variableName)) {
        watchers.set(variableName, []);
    }
    watchers.get(variableName)!.push({ variableName, callback });
}

/**
 * Clear all watchers
 */
export function clearWatchers(): void {
    watchers.clear();
    trackedValues.clear();
}

/**
 * Clear watchers for a specific variable
 */
export function clearWatcher(variableName: string): void {
    watchers.delete(variableName);
    trackedValues.delete(variableName);
}

/**
 * Register a custom module that can be imported
 * @param module - The module to register
 */
export function registerModule(module: CustomModule): void {
    customModules.set(module.name, module);
    importWhitelist.add(module.name);
}

/**
 * Register multiple modules at once
 * @param modules - Array of modules to register
 */
export function registerModules(modules: CustomModule[]): void {
    modules.forEach(module => registerModule(module));
}

/**
 * Get a registered module by name
 * @param name - Name of the module
 * @returns The module if found, undefined otherwise
 */
export function getModule(name: string): CustomModule | undefined {
    return customModules.get(name);
}

/**
 * Get all registered modules
 * @returns Array of all registered modules
 */
export function getAllModules(): CustomModule[] {
    return Array.from(customModules.values());
}

/**
 * Clear all registered modules
 */
export function clearModules(): void {
    customModules.clear();
    importWhitelist.clear();
}

/**
 * Check if a module is whitelisted
 * @param moduleName - Name of the module to check
 * @returns true if the module is whitelisted
 */
export function isModuleWhitelisted(moduleName: string): boolean {
    return importWhitelist.has(moduleName);
}

/**
 * Add a module name to the whitelist without registering code
 * @param moduleName - Name of the module to whitelist
 */
export function whitelistModule(moduleName: string): void {
    importWhitelist.add(moduleName);
}

/**
 * Create a Python object with property watchers
 */
function createWatchedPythonObject(objectName: string): any {
    const pyObject: any = {};
    
    return new Proxy(pyObject, {
        set(target: any, property: string, value: any) {
            const fullPath = `${objectName}.${property}`;
            const oldValue = trackedValues.get(fullPath);
            
            // Update the value
            target[property] = value;
            trackedValues.set(fullPath, value);
            
            // Trigger watchers
            const objectWatchers = watchers.get(fullPath) || [];
            for (const watcher of objectWatchers) {
                try {
                    watcher.callback(value, oldValue);
                } catch (e) {
                    console.error(`Watcher error for ${fullPath}:`, e);
                }
            }
            
            return true;
        },
        get(target: any, property: string) {
            return target[property];
        }
    });
}

/**
 * Create a Skulpt-compatible object with property watchers
 */
function createSkulptWatchedObject(objectName: string): any {
    const attributes: any = {};
    
    // Create a proper Skulpt object type
    const ObjectType = function(this: any) {};
    
    ObjectType.prototype.tp$getattr = function(pyName: any) {
        const attrName = Sk.ffi.remapToJs(pyName);
        return this[attrName];
    };
    
    ObjectType.prototype.tp$setattr = function(pyName: any, value: any) {
        // Convert Skulpt string to JavaScript string
        const attrName = Sk.ffi.remapToJs(pyName);
        const fullPath = `${objectName}.${attrName}`;
        
        // Convert Skulpt value to JavaScript
        const jsValue = Sk.ffi.remapToJs(value);
        const oldValue = trackedValues.get(fullPath);
        
        // Store the value (both Skulpt and JS versions)
        this[attrName] = value;
        trackedValues.set(fullPath, jsValue);
        
        // Trigger watchers
        const objectWatchers = watchers.get(fullPath) || [];
        for (const watcher of objectWatchers) {
            try {
                watcher.callback(jsValue, oldValue);
            } catch (e) {
                console.error(`Watcher error for ${fullPath}:`, e);
            }
        }
    };
    
    ObjectType.prototype.$r = function() {
        return new Sk.builtin.str(`<${objectName} object>`);
    };
    
    const instance = new (ObjectType as any)();
    return instance;
}

export function runPython(code: string): Promise<string> {
    return new Promise((resolve) => {
        let output = "";

        Sk.configure({
            output: (text: string) => {
                output += text;
            },
            read: (filename: string) => {
                // Handle custom module imports
                if (filename.endsWith('.py')) {
                    const moduleName = filename.replace(/\.py$/, '').replace(/^.*\//, '');
                    const module = customModules.get(moduleName);
                    
                    if (module) {
                        return module.code;
                    }
                }
                
                // Block all other file access
                throw new Error(`Module '${filename}' is not available. Only whitelisted modules can be imported.`);
            }
        });

        // Create tracked objects with Skulpt compatibility
        Sk.builtins.Player = createSkulptWatchedObject('Player');
        Sk.builtins.Game = createSkulptWatchedObject('Game');
        Sk.builtins.Enemy = createSkulptWatchedObject('Enemy');
        Sk.builtins.Enemy1 = createSkulptWatchedObject('Enemy1');
        Sk.builtins.Enemy2 = createSkulptWatchedObject('Enemy2');

        Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code))
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
    const tree = parser.parse(code);

    let allowed = true;
    const issues: string[] = [];

    tree.cursor().iterate((node) => {
        if (node.type.name === "ImportStatement" || node.type.name === "ImportFrom") {
            // Extract the module name from the import statement
            const importText = code.substring(node.from, node.to);
            const moduleName = extractModuleName(importText);
            
            if (moduleName && !importWhitelist.has(moduleName)) {
                allowed = false;
                issues.push(`Import of '${moduleName}' is not allowed`);
                return false;
            }
        }
    });

    return allowed;
}

/**
 * Validate Python code and return detailed error information
 * @param code - The Python code to validate
 * @returns Object with validation result and any error messages
 */
export function validatePythonCodeDetailed(code: string): { 
    valid: boolean; 
    errors: string[] 
} {
    const tree = parser.parse(code);
    const errors: string[] = [];

    tree.cursor().iterate((node) => {
        if (node.type.name === "ImportStatement" || node.type.name === "ImportFrom") {
            const importText = code.substring(node.from, node.to);
            const moduleName = extractModuleName(importText);
            
            if (moduleName && !importWhitelist.has(moduleName)) {
                errors.push(`Import of '${moduleName}' is not allowed. Available modules: ${Array.from(importWhitelist).join(', ') || 'none'}`);
            }
        }
    });

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Extract module name from import statement
 * @param importStatement - The import statement text
 * @returns The module name or null
 */
function extractModuleName(importStatement: string): string | null {
    // Match: import modulename
    const importMatch = importStatement.match(/^import\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
    if (importMatch) {
        return importMatch[1];
    }
    
    // Match: from modulename import ...
    const fromMatch = importStatement.match(/^from\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+import/);
    if (fromMatch) {
        return fromMatch[1];
    }
    
    return null;
}

/**
 * Get the current value of a tracked variable
 */
export function getTrackedValue(variableName: string): any {
    return trackedValues.get(variableName);
}

/**
 * Get all tracked values
 */
export function getAllTrackedValues(): Map<string, any> {
    return new Map(trackedValues);
}
