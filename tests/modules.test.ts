import { describe, it, expect, beforeEach } from 'vitest';
import { runPython, validatePythonCodeDetailed, isModuleWhitelisted } from '../src/backend/mechanics/parser';
import { initializeModules, getAvailableModules, getModuleDocumentation } from '../src/backend/mechanics/module-init';

describe('Custom Module System', () => {
    beforeEach(() => {
        initializeModules();
    });

    it('registers the user module in order', () => {
        expect(getAvailableModules()).toEqual(expect.arrayContaining(['user.weapons']));
        expect(getAvailableModules().indexOf('user.weapons')).toBeGreaterThanOrEqual(0);
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
});
