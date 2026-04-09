/**
 * Module System Initialization
 * Sets up all built-in Python modules for the runtime.
 */

import {
    clearPythonModules,
    getPublicPythonModuleNames,
    initializePythonModules
} from './python-modules.ts';
import { getAllModules } from './parser';

/**
 * Initialize the module system with all built-in Python modules
 * Call this before running any Python code
 */
export function initializeModules(): void {
    clearPythonModules();
    initializePythonModules();
}

/**
 * Get a list of all available module names
 */
export function getAvailableModules(): string[] {
    return getPublicPythonModuleNames();
}

/**
 * Get module documentation
 */
export function getModuleDocumentation(): Array<{ name: string; description: string }> {
    return getAllModules()
        .filter((module) => getAvailableModules().includes(module.name))
        .map((module) => ({
            name: module.name,
            description: module.description || 'No description available'
        }));
}
