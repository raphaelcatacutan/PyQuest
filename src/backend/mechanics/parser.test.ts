import { describe, it, expect } from 'vitest';
import { runPython, validatePythonCode } from './parser';

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
});
