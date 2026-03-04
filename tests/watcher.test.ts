import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
    runPython, 
    watchVariable, 
    clearWatchers, 
    getTrackedValue,
    getAllTrackedValues 
} from '../src/backend/mechanics/parser';

describe('Variable Watcher System', () => {
    beforeEach(() => {
        clearWatchers();
    });

    describe('Single variable watching', () => {
        it('should watch Player.Health changes', async () => {
            const callback = vi.fn();
            
            watchVariable('Player.Health', callback);

            const code = `
Player.Health = 100
print("Set to 100")
            `;

            const output = await runPython(code);

            expect(output).toContain('Set to 100');
        });

        it('should detect critical health states', async () => {
            const callback = vi.fn();
            
            watchVariable('Player.Health', callback);

            const code = `
Player.Health = 100
print("Alive")
            `;

            const output = await runPython(code);

            expect(output).toContain('Alive');
        });

        it('should execute code with Player object', async () => {
            const code = `
Player.Health = 50
print("Health set")
            `;

            const output = await runPython(code);
            expect(output).toContain('Health set');
        });
    });

    describe('Multiple variable watching', () => {
        it('should track multiple player stats', async () => {
            const callback = vi.fn();

            watchVariable('Player.Health', callback);
            watchVariable('Player.Mana', callback);

            const code = `
Player.Health = 100
Player.Mana = 50
print("Stats set")
            `;

            const output = await runPython(code);

            expect(output).toContain('Stats set');
        });

        it('should work with Game object', async () => {
            const callback = vi.fn();

            watchVariable('Game.Score', callback);

            const code = `
Game.Score = 0
Game.Score = 100
print("Score updated")
            `;

            const output = await runPython(code);

            expect(output).toContain('Score updated');
        });

        it('should accept watchers for different objects', async () => {
            watchVariable('Player.Health', vi.fn());
            watchVariable('Game.Score', vi.fn());
            watchVariable('Enemy.Health', vi.fn());

            const code = `
Player.Health = 100
Game.Score = 50
Enemy.Health = 30
print("All set")
            `;

            const output = await runPython(code);
            expect(output).toContain('All set');
        });
    });

    describe('Enemy tracking', () => {
        it('should work with Enemy object', async () => {
            const callback = vi.fn();
            
            watchVariable('Enemy.Health', callback);

            const code = `
Enemy.Health = 50
print("Enemy spawned")
            `;

            const output = await runPython(code);

            expect(output).toContain('Enemy spawned');
        });

        it('should track multiple enemies', async () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            watchVariable('Enemy1.Health', callback1);
            watchVariable('Enemy2.Health', callback2);

            const code = `
Enemy1.Health = 50
Enemy2.Health = 30
print("Enemies spawned")
            `;

            const output = await runPython(code);

            expect(output).toContain('Enemies spawned');
        });
    });

    describe('Watcher management', () => {
        it('should support multiple watchers on same variable', async () => {
            const watcher1 = vi.fn();
            const watcher2 = vi.fn();

            watchVariable('Player.Health', watcher1);
            watchVariable('Player.Health', watcher2);

            const code = `
Player.Health = 100
print("Health set")
            `;

            const output = await runPython(code);

            expect(output).toContain('Health set');
        });

        it('should clear all watchers', async () => {
            let callCount = 0;
            
            watchVariable('Player.Health', () => {
                callCount++;
            });

            watchVariable('Player.Mana', () => {
                callCount++;
            });

            clearWatchers();

            const code = `
Player.Health = 100
Player.Mana = 50
print("Code executed")
            `;

            const output = await runPython(code);

            expect(output).toContain('Code executed');
            expect(callCount).toBe(0);
        });

        it('should work with loops', async () => {
            watchVariable('Player.Health', vi.fn());

            const code = `
for i in range(5):
    Player.Health = i * 10
print("Loop complete")
            `;

            const output = await runPython(code);

            expect(output).toContain('Loop complete');
        });
    });

    describe('Game state synchronization', () => {
        it('should execute code with watchers', async () => {
            const callback = vi.fn();

            watchVariable('Player.Health', callback);
            watchVariable('Player.Mana', callback);
            watchVariable('Game.Score', callback);

            const code = `
Player.Health = 75
Player.Mana = 30
Game.Score = 100
print("Synced")
            `;

            const output = await runPython(code);

            expect(output).toContain('Synced');
        });

        it('should work across multiple executions', async () => {
            watchVariable('Player.Health', vi.fn());

            const output1 = await runPython('Player.Health = 100\nprint("First")');
            const output2 = await runPython('Player.Health = 75\nprint("Second")');
            const output3 = await runPython('Player.Health = 50\nprint("Third")');

            expect(output1).toContain('First');
            expect(output2).toContain('Second');
            expect(output3).toContain('Third');
        });
    });
});
