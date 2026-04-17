import { describe, it, expect, beforeEach } from 'vitest';
import { 
    runPython, 
    registerModule,
    unregisterModule,
    validatePythonCode
} from '../src/backend/mechanics/parser';
import { useInventoryStore } from '../src/game/store/inventoryStore';

describe('Python Parser and Runner', () => {
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

        it('should instrument statements with non-mangled tick helper name', async () => {
            const sk = (globalThis as any).Sk;
            const originalImportMainWithBody = sk.importMainWithBody;
            let capturedCode = '';

            sk.importMainWithBody = (_name: string, _dumpJS: boolean, code: string) => {
                capturedCode = code;
                return null;
            };

            try {
                await runPython('print("tick")');
            } finally {
                sk.importMainWithBody = originalImportMainWithBody;
            }

            expect(capturedCode).toContain('_pyquest_tick(');
            expect(capturedCode).not.toContain('__pyquest_tick(');
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

        it('should show a descriptive error for internal runtime helper NameError', async () => {
            const sk = (globalThis as any).Sk;
            const originalImportMainWithBody = sk.importMainWithBody;

            sk.importMainWithBody = () => {
                throw new Error("NameError: name '_ConsumableRef__pyquest_tick' is not defined on line 2");
            };

            try {
                const output = await runPython('print("runtime")');

                expect(output).toContain('Error: PyQuest runtime error (line 2):');
                expect(output).toContain('built-in game action helper was unavailable');
                expect(output).not.toContain('_ConsumableRef__pyquest_tick');
            } finally {
                sk.importMainWithBody = originalImportMainWithBody;
            }
        });

        it('should not inject tick calls inside inlined module method bodies', async () => {
            const sk = (globalThis as any).Sk;
            const originalImportMainWithBody = sk.importMainWithBody;
            let capturedCode = '';

            registerModule({
                name: 'user.runtime_probe',
                code: `
class _Probe:
    def consume(self):
        return 1

probe = _Probe()
`
            });

            sk.importMainWithBody = (_name: string, _dumpJS: boolean, code: string) => {
                capturedCode = code;
                return null;
            };

            try {
                await runPython('from user.runtime_probe import probe\nprobe.consume()');
            } finally {
                unregisterModule('user.runtime_probe');
                sk.importMainWithBody = originalImportMainWithBody;
            }

            expect(capturedCode).toContain('def consume(self):');
            expect(capturedCode).not.toMatch(/def consume\(self\):\n\s+_pyquest_tick\(/);
        });

        it('should keep pickedup import statements for dynamic runtime resolution', async () => {
            const sk = (globalThis as any).Sk;
            const originalImportMainWithBody = sk.importMainWithBody;
            let capturedCode = '';

            const state = useInventoryStore.getState();
            const pickedupFolder = state.playerInventory.find((node) => node.kind === 'folder' && node.id === 'pickedup_folder');
            const originalChildren = pickedupFolder && pickedupFolder.kind === 'folder' ? [...pickedupFolder.children] : [];

            if (pickedupFolder && pickedupFolder.kind === 'folder') {
                pickedupFolder.children.push({
                    id: 'pickedup-consumable-lesser-guard-elixir',
                    kind: 'consumable',
                    itemId: 'lesser_guard_elixir',
                    name: 'lesser_guard_elixir'
                });
            }

            sk.importMainWithBody = (_name: string, _dumpJS: boolean, code: string) => {
                capturedCode = code;
                return null;
            };

            try {
                await runPython('from pickedup import lesser_guard_elixir\nlesser_guard_elixir.consume()');
            } finally {
                if (pickedupFolder && pickedupFolder.kind === 'folder') {
                    pickedupFolder.children = originalChildren;
                }
                sk.importMainWithBody = originalImportMainWithBody;
            }

            expect(capturedCode).toContain('from pickedup import lesser_guard_elixir');
        });

        it('should expose remaining builtin helpers', async () => {
            const code = `
goTo("village")
print("Buy")
            `;

            const output = await runPython(code);
            expect(output).toContain('Buy');
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
});
