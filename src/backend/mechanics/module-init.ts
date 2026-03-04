/**
 * Module System Initialization
 * Sets up all built-in game modules for the Python environment
 */

import { registerModules, clearModules, getAllModules } from './parser';
import { gameModules } from './game-modules';

/**
 * Initialize the module system with all built-in game modules
 * Call this before running any Python code
 */
export function initializeModules(): void {
    // Clear any existing modules
    clearModules();
    
    // Register all game modules
    registerModules(gameModules);
    
    console.log('Module system initialized');
    console.log(`Registered modules: ${getAllModules().map(m => m.name).join(', ')}`);
}

/**
 * Get a list of all available module names
 */
export function getAvailableModules(): string[] {
    return getAllModules().map(m => m.name);
}

/**
 * Get module documentation
 */
export function getModuleDocumentation(): Array<{ name: string; description: string }> {
    return getAllModules().map(m => ({
        name: m.name,
        description: m.description || 'No description available'
    }));
}
