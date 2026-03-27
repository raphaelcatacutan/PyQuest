import { describe, it, expect, beforeEach } from 'vitest';
import { 
    runPython, 
    validatePythonCode, 
    watchVariable, 
    clearWatchers, 
    getTrackedValue,
    getAllTrackedValues 
} from '../src/backend/mechanics/parser';

describe('Python Parser and Runner', () => {
    beforeEach(() => {
        // Clear watchers before each test
        clearWatchers();
    });

    describe('validatePythonCode', () => {
        it('should allow simple print statement', () => {
            const code = 'print("Hello World")';
            const result = validatePythonCode(code);
            expect(result).toBe(true);
        });

        it('should reject import statements', () => {
            const code = 'import os';
            const result = validatePythonCode(code);
            expect(result).toBe(false);
        });

        it('should reject from-import statements', () => {
            const code = 'from sys import exit';
            const result = validatePythonCode(code);
            expect(result).toBe(false);
        });

        it('should allow basic arithmetic', () => {
            const code = 'x = 1 + 2\nprint(x)';
            const result = validatePythonCode(code);
            expect(result).toBe(true);
        });

        it('should allow function definitions', () => {
            const code = `
def greet(name):
    return f"Hello, {name}"

print(greet("World"))
            `;
            const result = validatePythonCode(code);
            expect(result).toBe(true);
        });
    });

    describe('runPython', () => {
        it('should run simple print statement', async () => {
            const code = 'print("Hello World")';
            const output = await runPython(code);
            expect(output).toContain('Hello World');
        });

        it('should handle arithmetic operations', async () => {
            const code = 'print(2 + 2)';
            const output = await runPython(code);
            expect(output).toContain('4');
        });

        it('should catch errors in invalid code', async () => {
            const code = 'print(undefined_variable)';
            const output = await runPython(code);
            expect(output).toContain('Error');
        });
    });

    describe('Integration: validate then run', () => {
        it('should successfully run validated allowed code', async () => {
            const code = 'print("Hello World")';
            const isValid = validatePythonCode(code);
            expect(isValid).toBe(true);
            
            if (isValid) {
                const output = await runPython(code);
                expect(output).toContain('Hello World');
            }
        });

        it('should reject and not run disallowed code', async () => {
            const code = 'import os\nprint("This should not run")';
            const isValid = validatePythonCode(code);
            expect(isValid).toBe(false);
            
            // We should not run the code if it's not valid
            if (!isValid) {
                expect(isValid).toBe(false);
            }
        });
    });

    describe('Variable Watchers', () => {
        it('should track variable changes', async () => {
            const changes: any[] = [];
            
            watchVariable('Player.Health', (newValue, oldValue) => {
                changes.push({ newValue, oldValue });
            });

            const code = `
Player.Health = 100
Player.Health = 75
Player.Health = 50
            `;

            await runPython(code);

            expect(changes.length).toBe(3);
            expect(changes[0]).toEqual({ newValue: 100, oldValue: undefined });
            expect(changes[1]).toEqual({ newValue: 75, oldValue: 100 });
            expect(changes[2]).toEqual({ newValue: 50, oldValue: 75 });
        });

        it('should get tracked value', async () => {
            const code = `Player.Health = 42`;
            await runPython(code);

            const health = getTrackedValue('Player.Health');
            expect(health).toBe(42);
        });

        it('should track multiple variables', async () => {
            const healthChanges: number[] = [];
            const manaChanges: number[] = [];

            watchVariable('Player.Health', (newValue) => {
                healthChanges.push(newValue);
            });

            watchVariable('Player.Mana', (newValue) => {
                manaChanges.push(newValue);
            });

            const code = `
Player.Health = 100
Player.Mana = 50
Player.Health = 80
Player.Mana = 30
            `;

            await runPython(code);

            expect(healthChanges).toEqual([100, 80]);
            expect(manaChanges).toEqual([50, 30]);
        });

        it('should get all tracked values', async () => {
            const code = `
Player.Health = 100
Player.Mana = 50
Game.Score = 1000
            `;

            await runPython(code);

            const allValues = getAllTrackedValues();
            expect(allValues.get('Player.Health')).toBe(100);
            expect(allValues.get('Player.Mana')).toBe(50);
            expect(allValues.get('Game.Score')).toBe(1000);
        });

        it('should trigger watcher on each change', async () => {
            let callCount = 0;
            
            watchVariable('Player.Health', () => {
                callCount++;
            });

            const code = `
for i in range(5):
    Player.Health = i * 10
            `;

            await runPython(code);

            expect(callCount).toBe(5);
        });

        it('should support multiple watchers on same variable', async () => {
            const watcher1Calls: number[] = [];
            const watcher2Calls: number[] = [];

            watchVariable('Player.Health', (newValue) => {
                watcher1Calls.push(newValue);
            });

            watchVariable('Player.Health', (newValue) => {
                watcher2Calls.push(newValue);
            });

            const code = `Player.Health = 100`;
            await runPython(code);

            expect(watcher1Calls).toEqual([100]);
            expect(watcher2Calls).toEqual([100]);
        });

        it('should clear watchers', async () => {
            let callCount = 0;
            
            watchVariable('Player.Health', () => {
                callCount++;
            });

            clearWatchers();

            const code = `Player.Health = 100`;
            await runPython(code);

            expect(callCount).toBe(0);
        });
    });
});
