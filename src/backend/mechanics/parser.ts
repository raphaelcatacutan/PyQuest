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
    
    // Create a Skulpt object with custom attribute setters
    const obj: any = {
        tp$name: objectName,
        tp$setattr: function(pyName: any, value: any) {
            // Convert Skulpt string to JavaScript string
            const attrName = typeof pyName === 'string' ? pyName : pyName.v;
            const fullPath = `${objectName}.${attrName}`;
            
            // Convert Skulpt value to JavaScript
            let jsValue = value;
            if (value && typeof value === 'object' && value.v !== undefined) {
                jsValue = value.v;
            }
            
            const oldValue = trackedValues.get(fullPath);
            
            // Store the value
            attributes[attrName] = value;
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
        },
        tp$getattr: function(pyName: any) {
            const attrName = typeof pyName === 'string' ? pyName : pyName.v;
            return attributes[attrName];
        }
    };
    
    return obj;
}

export function runPython(code: string): Promise<string> {
    return new Promise((resolve) => {
        let output = "";

        Sk.configure({
            output: (text: string) => {
                output += text;
            },
            read: (x: string) => { 
                throw "file access not allowed"; 
            }
        });

        // Create tracked objects with Skulpt compatibility
        Sk.builtins.Player = createSkulptWatchedObject('Player');
        Sk.builtins.Game = createSkulptWatchedObject('Game');
        Sk.builtins.Enemy = createSkulptWatchedObject('Enemy');

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

    tree.cursor().iterate((node) => {
        if (node.type.name === "ImportStatement" || node.type.name === "ImportFrom") {
            allowed = false;
            return false; 
        }
    });

    return allowed;
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
