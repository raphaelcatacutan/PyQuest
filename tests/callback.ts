import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initializeModules } from '../src/backend/mechanics/module-init';
import {
    clearPythonRuntimeHooks,
    runPython,
    setPythonRuntimeHooks,
    type PythonModuleCallEvent
} from '../src/backend/mechanics/parser';

describe('Python runtime callback bridge', () => {
    beforeEach(() => {
        initializeModules();
        clearPythonRuntimeHooks();
    });

    it('emits callbacks when bridged module functions are called', async () => {
        const events: PythonModuleCallEvent[] = [];

        setPythonRuntimeHooks({
            onFunctionCall: (event) => {
                events.push(event);
            }
        });

        await runPython(`
goTo("village")
scavenge()
explore()
player.unequip()
        `);

        expect(events.map((event) => event.name)).toEqual(
            expect.arrayContaining([
                'builtin.goTo',
                'builtin.scavenge',
                'builtin.explore',
                'player.unequip'
            ])
        );

        const goToEvent = events.find((event) => event.name === 'builtin.goTo');
        expect(goToEvent?.payload).toEqual({ locationId: 'village' });
    });

    it('reads abstracted player values from runtime state hook', async () => {
        const getStateValue = vi.fn((path: string, fallback?: unknown) => {
            const state: Record<string, unknown> = {
                'player.energy': 64,
                'player.hp': 88
            };

            return path in state ? state[path] : fallback;
        });

        setPythonRuntimeHooks({ getStateValue });

        const output = await runPython(`
print(player.energy)
print(player.hp)
        `);

        expect(output).toContain('64');
        expect(output).toContain('88');
        expect(getStateValue).toHaveBeenCalledWith('player.energy', 0);
        expect(getStateValue).toHaveBeenCalledWith('player.hp', 100);
    });
});
