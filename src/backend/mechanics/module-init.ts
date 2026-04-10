/**
 * Module System Initialization
 * Sets up all built-in Python modules for the runtime.
 */

import {
    clearModules,
    getAllModules,
    isModuleWhitelisted,
    registerModule,
    registerModules,
    unregisterModule,
    type CustomModule
} from './parser';
import { customModules } from './game-modules.ts';

/**
 * Initialize the module system with all built-in Python modules
 * Call this before running any Python code
 */
export function initializeModules(modules: CustomModule[] = customModules): void {
    clearModules();
    registerModules(modules);
}

/**
 * Get a list of all available module names
 */
export function getAvailableModules(): string[] {
    return getAllModules()
        .filter((module) => isModuleWhitelisted(module.name))
        .map((module) => module.name);
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

/**
 * Load one custom module without resetting existing modules
 */
export function loadModule(module: CustomModule): void {
    registerModule(module);
}

/**
 * Load multiple custom modules without resetting existing modules
 */
export function loadModules(modules: CustomModule[]): void {
    registerModules(modules);
}

/**
 * Unload one module by name
 */
export function unloadModule(moduleName: string): boolean {
    return unregisterModule(moduleName);
}

/**
 * Unload multiple modules by name
 */
export function unloadModules(moduleNames: string[]): string[] {
    return moduleNames.filter((moduleName) => unregisterModule(moduleName));
}
