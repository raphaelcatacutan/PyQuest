import { describe, it, expect, beforeEach } from 'vitest';
import { customModules } from '../src/backend/mechanics/game-modules';
import { runPython, validatePythonCodeDetailed, isModuleWhitelisted } from '../src/backend/mechanics/parser';
import { initializeModules, getAvailableModules, getModuleDocumentation, loadModule, loadModules, unloadModule, unloadModules } from '../src/backend/mechanics/module-init';
import { useGameStore } from '../src/game/store/gameStore';
import { useInventoryStore } from '../src/game/store/inventoryStore';

describe('Custom Module System', () => {
    beforeEach(() => {
        initializeModules();
        useGameStore.setState({ inCombat: false, isEnemy: true });
        useInventoryStore.getState().resetInventory();
        useInventoryStore.setState({ purchasedWeaponIds: [], purchasedConsumableIds: [] });
    });

    it('registers the user module in order', () => {
        expect(getAvailableModules()).toEqual(expect.arrayContaining(['pickedup']));
        expect(getAvailableModules()).not.toEqual(expect.arrayContaining(['user.weapons', 'spear', 'inventory', 'magic', 'utils', 'weapon', 'consumable']));
    });

    it('locks pickedup imports when item is not in pickedup folder', () => {
        const result = validatePythonCodeDetailed('from pickedup import health_potion');
        expect(result.valid).toBe(false);
    });

    it('allows pickedup imports when item exists in pickedup folder', async () => {
        useInventoryStore.getState().addInventoryItem('pickedup_folder', {
            id: 'pickedup-consumable-health-potion',
            kind: 'consumable',
            itemId: 'health_potion',
            name: 'health_potion'
        });

        const result = validatePythonCodeDetailed('from pickedup import health_potion');
        expect(result.valid).toBe(true);

        const output = await runPython(`
from pickedup import health_potion
health_potion.consume()
        `);

        expect(output).not.toContain('Error');
    });

    it('supports pickedup weapon methods without parameters in enemy combat', async () => {
        useInventoryStore.getState().addInventoryItem('pickedup_folder', {
            id: 'pickedup-weapon-great-forests-wand',
            kind: 'weapon',
            itemId: 'great_forests_wand',
            name: 'great_forests_wand'
        });
        useGameStore.setState({ inCombat: true, isEnemy: true });

        const output = await runPython(`
from pickedup import great_forests_wand
great_forests_wand.strike()
great_forests_wand.heal()
        `);

        expect(output).not.toContain('Error');
    });

    it('supports pickedup armor activation without parameters', async () => {
        useInventoryStore.getState().addInventoryItem('pickedup_folder', {
            id: 'pickedup-armor-academy-hat',
            kind: 'armor',
            itemId: 'academy_hat',
            name: 'academy_hat'
        });

        const output = await runPython(`
from pickedup import academy_hat
academy_hat.activate()
        `);

        expect(output).not.toContain('Error');
    });

    it('keeps internal support modules unavailable for import', () => {
        expect(isModuleWhitelisted('builtin')).toBe(false);
        expect(isModuleWhitelisted('abstracts')).toBe(false);
    });

    it('blocks legacy shop module imports', () => {
        const lockedWeapon = validatePythonCodeDetailed('from weapon import wooden_wand');
        expect(lockedWeapon.valid).toBe(false);
        const lockedConsumable = validatePythonCodeDetailed('from consumable import health_potion');
        expect(lockedConsumable.valid).toBe(false);
    });

    it('blocks internal module imports', () => {
        const result = validatePythonCodeDetailed('from builtin import goTo\nfrom abstracts import Player');
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it('runs allowed builtin helpers without explicit imports', async () => {
        const output = await runPython(`
goTo("village")
print("Buy")
        `);

        expect(output).toContain('Buy');
    });

    it('exposes module documentation entries', () => {
        const documentation = getModuleDocumentation();
        expect(documentation.some((module) => module.name === 'pickedup')).toBe(true);
    });

    it('unloads a specific module and blocks its imports', () => {
        const removed = unloadModule('pickedup');

        expect(removed).toBe(true);
        expect(getAvailableModules()).not.toContain('pickedup');

        const result = validatePythonCodeDetailed('from pickedup import health_potion');
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it('unloads selected modules and can load them back', () => {
        const removedModules = unloadModules(['pickedup', 'missing.module']);
        expect(removedModules).toEqual(['pickedup']);
        expect(getAvailableModules()).not.toContain('pickedup');

        const reloaded = customModules.filter((module) => module.name === 'pickedup');
        loadModules(reloaded);

        expect(getAvailableModules()).toContain('pickedup');
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
