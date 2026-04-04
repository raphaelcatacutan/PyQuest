import { describe, it, expect, beforeEach } from 'vitest';
import { 
    runPython, 
    validatePythonCode,
    validatePythonCodeDetailed,
    isModuleWhitelisted,
    clearModules
} from '../src/backend/mechanics/parser';
import { initializeModules, getAvailableModules, getModuleDocumentation } from '../src/backend/mechanics/module-init';

describe('Custom Module System', () => {
    beforeEach(() => {
        clearModules();
        initializeModules();
    });

    describe('Module initialization', () => {
        it('should initialize modules successfully', () => {
            const modules = getAvailableModules();
            expect(modules).toContain('spear');
            expect(modules).toContain('inventory');
            expect(modules).toContain('magic');
            expect(modules).toContain('utils');
        });

        it('should list all available modules', () => {
            const modules = getAvailableModules();
            expect(modules).toEqual(expect.arrayContaining(['spear', 'inventory', 'magic', 'utils']));
        });
    });

    describe('Module whitelist validation', () => {
        it('should allow whitelisted modules', () => {
            expect(isModuleWhitelisted('spear')).toBe(true);
            expect(isModuleWhitelisted('inventory')).toBe(true);
            expect(isModuleWhitelisted('magic')).toBe(true);
            expect(isModuleWhitelisted('utils')).toBe(true);
        });

        it('should block non-whitelisted modules', () => {
            expect(isModuleWhitelisted('os')).toBe(false);
            expect(isModuleWhitelisted('sys')).toBe(false);
            expect(isModuleWhitelisted('random')).toBe(false);
            expect(isModuleWhitelisted('subprocess')).toBe(false);
        });
    });

    describe('Import validation', () => {
        it('should validate allowed imports from spear module', () => {
            const code = `
from spear import Spear, attack

my_spear = Spear(damage=15)
my_spear.attack("Goblin")
            `;
            
            const result = validatePythonCodeDetailed(code);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should validate multiple allowed imports', () => {
            const code = `
from spear import Spear
from inventory import add_item
from magic import cast_spell

weapon = Spear(damage=20)
add_item("Iron Spear", 1, 100)
cast_spell("fireball", 100, "Enemy")
            `;
            
            const result = validatePythonCodeDetailed(code);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should reject blocked imports', () => {
            const code = `
import os
os.system("rm -rf /")
            `;
            
            const result = validatePythonCodeDetailed(code);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should reject from imports of blocked modules', () => {
            const code = `
from os import system
system("ls")
            `;
            
            const result = validatePythonCodeDetailed(code);
            expect(result.valid).toBe(false);
        });

        it('should reject random module imports', () => {
            const code = `
import random
x = random.randint(1, 10)
            `;
            
            const result = validatePythonCodeDetailed(code);
            expect(result.valid).toBe(false);
        });
    });

    describe('Spear module functionality', () => {
        it('should create and use Spear class', async () => {
            const code = `
from spear import Spear

my_spear = Spear(damage=20)
print("Spear created")
            `;
            
            expect(validatePythonCode(code)).toBe(true);
            const output = await runPython(code);
            expect(output).toContain('Spear created');
        });

        it('should attack with spear', async () => {
            const code = `
from spear import Spear

my_spear = Spear(damage=15)
result = my_spear.attack("Goblin")
print("Attack executed")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Attack executed');
        });

        it('should perform thrust attack', async () => {
            const code = `
from spear import Spear

my_spear = Spear(damage=20)
result = my_spear.thrust("Dragon")
print("Thrust executed")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Thrust executed');
        });

        it('should handle spear durability', async () => {
            const code = `
from spear import Spear

my_spear = Spear(damage=10)
my_spear.attack("Enemy")
my_spear.attack("Enemy")
my_spear.repair(50)
print("Durability test complete")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Durability test complete');
        });

        it('should use quick attack function', async () => {
            const code = `
from spear import attack

result = attack("Skeleton", 15)
print("Quick attack executed")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Quick attack executed');
        });
    });

    describe('Inventory module functionality', () => {
        it('should add items to inventory', async () => {
            const code = `
from inventory import add_item

add_item("Health Potion", 3, 50)
add_item("Mana Potion", 2, 30)
print("Items added")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Items added');
        });

        it('should list inventory items', async () => {
            const code = `
from inventory import add_item, list_items

add_item("Iron Sword", 1, 200)
add_item("Shield", 1, 150)
items = list_items()
print("Inventory listed")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Inventory listed');
        });

        it('should remove items from inventory', async () => {
            const code = `
from inventory import add_item, remove_item

add_item("Health Potion", 5, 50)
remove_item("Health Potion", 2)
print("Items removed")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Items removed');
        });

        it('should calculate total inventory value', async () => {
            const code = `
from inventory import add_item, get_total_value

add_item("Gold Coin", 100, 1)
add_item("Diamond", 5, 500)
total = get_total_value()
print("Total calculated")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Total calculated');
        });
    });

    describe('Magic module functionality', () => {
        it('should cast predefined spells', async () => {
            const code = `
from magic import cast_spell

result = cast_spell("fireball", 100, "Goblin")
print("Spell cast")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Spell cast');
        });

        it('should create custom spells', async () => {
            const code = `
from magic import Spell

ice_spike = Spell("Ice Spike", 30, 35, "offensive")
result = ice_spike.cast(100, "Troll")
print("Custom spell created")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Custom spell created');
        });

        it('should reject spell cast with insufficient mana', async () => {
            const code = `
from magic import cast_spell

result = cast_spell("fireball", 10, "Enemy")
print("Insufficient mana test complete")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Insufficient mana test complete');
        });

        it('should cast healing spells', async () => {
            const code = `
from magic import cast_spell

result = cast_spell("heal", 100)
print("Healing spell cast")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Healing spell cast');
        });
    });

    describe('Utils module functionality', () => {
        it('should roll dice', async () => {
            const code = `
from utils import roll_dice

result = roll_dice(6, 1)
print("Dice test complete")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Dice test complete');
        });

        it('should clamp values', async () => {
            const code = `
from utils import clamp

print(clamp(150, 0, 100))
print(clamp(-10, 0, 100))
print(clamp(50, 0, 100))
            `;
            
            const output = await runPython(code);
            expect(output).toContain('100');
            expect(output).toContain('0');
            expect(output).toContain('50');
        });

        it('should use random choice', async () => {
            const code = `
from utils import random_choice

items = ["Sword", "Shield", "Potion"]
choice = random_choice(items)
print("Choice made")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Choice made');
        });
    });

    describe('Module combinations', () => {
        it('should combine spear and inventory modules', async () => {
            const code = `
from spear import Spear
from inventory import add_item, list_items

spear = Spear(damage=25)
spear.name = "Dragon Slayer"
add_item(spear.name, 1, 500)
list_items()
print("Combination test complete")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Combination test complete');
        });

        it('should combine all modules in a combat scenario', async () => {
            const code = `
from spear import Spear
from inventory import add_item
from magic import cast_spell
from utils import roll_dice

weapon = Spear(damage=20)
damage = weapon.attack("Dragon")

spell_result = cast_spell("fireball", 100, "Dragon")

add_item("Dragon Scale", 1, 1000)
print("Combat scenario complete")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Combat scenario complete');
        });

        it('should use magic and inventory together', async () => {
            const code = `
from magic import Spell
from inventory import add_item, list_items

spell = Spell("Conjure Item", 50, 0, "utility")
spell.cast(100)

add_item("Conjured Sword", 1, 300)
list_items()
print("Magic inventory test complete")
            `;
            
            const output = await runPython(code);
            expect(output).toContain('Magic inventory test complete');
        });
    });

    describe('Error handling', () => {
        it('should handle invalid module imports gracefully', () => {
            const code = `
from invalid_module import something
            `;
            
            const result = validatePythonCodeDetailed(code);
            expect(result.valid).toBe(false);
        });

        it('should prevent malicious imports', () => {
            const maliciousCodes = [
                'import os',
                'import sys',
                'import subprocess',
                'from os import system',
                'import socket',
            ];

            maliciousCodes.forEach(code => {
                const result = validatePythonCodeDetailed(code);
                expect(result.valid).toBe(false);
            });
        });

        it('should allow only safe module operations', () => {
            const code = `
from spear import Spear
from inventory import add_item

weapon = Spear(damage=10)
add_item("Test", 1, 1)
            `;
            
            const result = validatePythonCodeDetailed(code);
            expect(result.valid).toBe(true);
        });
    });
});
