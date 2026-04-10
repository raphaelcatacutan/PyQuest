import { describe, it, expect, beforeEach } from 'vitest';
import { customModules } from '../src/backend/mechanics/game-modules';
import { runPython, validatePythonCodeDetailed, isModuleWhitelisted } from '../src/backend/mechanics/parser';
import { initializeModules, getAvailableModules, getModuleDocumentation, loadModule, loadModules, unloadModule, unloadModules } from '../src/backend/mechanics/module-init';

describe('Custom Module System', () => {
    beforeEach(() => {
        initializeModules();
    });

    it('registers the user module in order', () => {
        expect(getAvailableModules()).toEqual(expect.arrayContaining(['user.weapons']));
    });

    it('keeps internal support modules unavailable for import', () => {
        expect(isModuleWhitelisted('builtin')).toBe(false);
        expect(isModuleWhitelisted('abstracts')).toBe(false);
    });

    it('allows user module imports', () => {
        const result = validatePythonCodeDetailed('from user.weapons import spear');
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('blocks internal module imports', () => {
        const result = validatePythonCodeDetailed('from builtin import goTo\nfrom abstracts import Player');
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it('runs builtin helpers without explicit imports', async () => {
        const output = await runPython(`
from user.weapons import spear

goTo("village")
print("Buy")
        `);

        expect(output).toContain('Buy');
    });

    it('exposes module documentation entries', () => {
        const documentation = getModuleDocumentation();
        expect(documentation.some((module) => module.name === 'user.weapons')).toBe(true);
    });

    it('unloads a specific module and blocks its imports', () => {
        const removed = unloadModule('user.weapons');

        expect(removed).toBe(true);
        expect(getAvailableModules()).not.toContain('user.weapons');

        const result = validatePythonCodeDetailed('from user.weapons import spear');
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it('unloads selected modules and can load them back', () => {
        const removedModules = unloadModules(['inventory', 'magic', 'missing.module']);
        expect(removedModules).toEqual(['inventory', 'magic']);
        expect(getAvailableModules()).not.toContain('inventory');
        expect(getAvailableModules()).not.toContain('magic');

        const reloaded = customModules.filter((module) => module.name === 'inventory' || module.name === 'magic');
        loadModules(reloaded);

        expect(getAvailableModules()).toContain('inventory');
        expect(getAvailableModules()).toContain('magic');
    });

    it('loads a brand-new module not included in initial modules', async () => {
        const initialModules = getAvailableModules();
        expect(initialModules).not.toContain('user.alchemy');

        const beforeLoad = validatePythonCodeDetailed('from user.alchemy import get_potion_name');
        expect(beforeLoad.valid).toBe(false);

        loadModule({
            name: 'user.alchemy',
            description: 'Dynamically loaded alchemy module',
            code: `

def get_potion_name():
    print("Health Potion")
`
        });

        expect(getAvailableModules()).toContain('user.alchemy');

        const afterLoad = validatePythonCodeDetailed('from user.alchemy import get_potion_name');
        expect(afterLoad.valid).toBe(true);
        expect(afterLoad.errors).toHaveLength(0);

        const output = await runPython('import user.alchemy\n');

        expect(output).toContain('Health Potion');
    });
});
