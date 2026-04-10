/**
 * Built-in game modules that players can import in their Python code
 */

import type { CustomModule } from './parser';

export const builtinModule: CustomModule = {
    name: 'builtin',
    description: 'Preloaded helpers available without import',
    visibility: 'internal',
    prelude: true,
    code: `
from abstracts import Player


def _emit(event_name, payload=None):
    return __pyquest_callback(event_name, payload)


def _state(path, fallback=None):
    return __pyquest_state(path, fallback)


def roll_dice(sides=6, count=1):
    result = sides * count
    _emit("builtin.roll_dice", {"sides": sides, "count": count, "result": result})
    return result


def chance(percentage):
    result = percentage >= 50
    _emit("builtin.chance", {"percentage": percentage, "result": result})
    return result


def random_choice(items):
    if not items:
        _emit("builtin.random_choice", {"result": None})
        return None
    result = items[0]
    _emit("builtin.random_choice", {"result": result})
    return result


def clamp(value, min_value, max_value):
    if value < min_value:
        _emit("builtin.clamp", {"value": value, "result": min_value})
        return min_value
    if value > max_value:
        _emit("builtin.clamp", {"value": value, "result": max_value})
        return max_value
    _emit("builtin.clamp", {"value": value, "result": value})
    return value


def goTo(locationId: str):
    return _emit("builtin.goTo", {"locationId": locationId})


def scavenge():
    return _emit("builtin.scavenge", {"scene": _state("scene.scene", "")})


def explore():
    return _emit("builtin.explore", {"scene": _state("scene.scene", "")})


player = Player()
`
};

export const abstractsModule: CustomModule = {
    name: 'abstracts',
    description: 'Internal type and class contracts',
    visibility: 'internal',
    code: `
def _emit(event_name, payload=None):
    return __pyquest_callback(event_name, payload)


def _state(path, fallback=None):
    return __pyquest_state(path, fallback)


class Armor:
    @property
    def type(self) -> str:
        return _state("player.headSlot", "")

    @property
    def durability(self) -> float:
        return _state("player.maxDef", 0)

class Item:
    def __init__(self, name="", quantity=0, cooldown=0):
        self.name = name
        self.quantity = quantity
        self.cooldown = cooldown

class Entity:
    @property
    def health(self) -> float:
        return _state("enemy.hp", 0)

    @property
    def name(self) -> str:
        return _state("enemy.name", "")

    @property
    def id(self) -> str:
        return _state("enemy.id", "")

class Player:
    @property
    def energy(self) -> int:
        return _state("player.energy", 0)

    @property
    def hp(self) -> float:
        return _state("player.hp", 100)

    @property
    def armor(self) -> Armor:
        return Armor()

    def equip(self, item: Item):
        item_name = getattr(item, "name", "")
        return _emit("player.equip", {"item": item_name})

    def unequip(self):
        return _emit("player.unequip", None)

class Enemy(Entity):
    pass

class Slime(Enemy):
    pass

class Spear(Item):
    def __init__(self):
        super().__init__(name="Spear", quantity=1, cooldown=0)

    def attack(self):
        return _emit("spear.attack", {"damage": _state("player.baseDmg", 0)})

    def thrust(self):
        return _emit("spear.thrust", {"damage": _state("player.baseDmg", 0)})

    def pierce(self):
        return _emit("spear.pierce", {"damage": _state("player.baseDmg", 0)})
`
};

export const userWeaponsModule: CustomModule = {
    name: 'user.weapons',
    description: 'Nested user weapon module',
    code: `
from abstracts import *

spear = Spear()
`
};

export const spearModule: CustomModule = {
    name: 'spear',
    description: 'Spear combat system with attack and weapon management',
    code: `
"""
Spear Combat Module
Provides functions and classes for spear-based combat
"""

class Spear:
    """A spear weapon with damage and durability"""
    
    def __init__(self, damage=10, durability=100):
        self.damage = damage
        self.durability = durability
        self.name = "Iron Spear"
    
    def attack(self, target_name="Enemy"):
        """Attack a target with the spear"""
        if self.durability <= 0:
            return f"{self.name} is broken!"
        
        self.durability -= 5
        actual_damage = self.damage
        
        print(f"Attacked {target_name} with {self.name} for {actual_damage} damage!")
        print(f"Spear durability: {self.durability}/100")
        __pyquest_callback("spear.attack", {"target": target_name, "damage": actual_damage, "durability": self.durability})
        
        return actual_damage
    
    def thrust(self, target_name="Enemy"):
        """Powerful thrust attack that deals extra damage but costs more durability"""
        if self.durability <= 0:
            return f"{self.name} is broken!"
        
        self.durability -= 15
        actual_damage = int(self.damage * 1.5)
        
        print(f"Thrust attack on {target_name} for {actual_damage} damage!")
        print(f"Spear durability: {self.durability}/100")
        __pyquest_callback("spear.thrust", {"target": target_name, "damage": actual_damage, "durability": self.durability})
        
        return actual_damage
    
    def repair(self, amount=50):
        """Repair the spear"""
        self.durability = min(100, self.durability + amount)
        print(f"Repaired {self.name}. Durability: {self.durability}/100")
        __pyquest_callback("spear.repair", {"amount": amount, "durability": self.durability})


def attack(target_name="Enemy", damage=10):
    """Quick attack function"""
    print(f"Attacked {target_name} for {damage} damage!")
    __pyquest_callback("spear.attack.quick", {"target": target_name, "damage": damage})
    return damage


def create_spear(damage=10):
    """Create a new spear with specified damage"""
    __pyquest_callback("spear.create", {"damage": damage})
    return Spear(damage=damage)
`
};

export const inventoryModule: CustomModule = {
    name: 'inventory',
    description: 'Inventory management system',
    code: `
"""
Inventory Module
Manage items, equipment, and loot
"""

# Global inventory storage
_items = {}

class Item:
    """Represents an item in the inventory"""
    
    def __init__(self, name, quantity=1, value=0):
        self.name = name
        self.quantity = quantity
        self.value = value
    
    def __str__(self):
        return f"{self.name} x{self.quantity} (Value: {self.value}g)"


def add_item(name, quantity=1, value=0):
    """Add an item to the inventory"""
    if name in _items:
        _items[name].quantity += quantity
    else:
        _items[name] = Item(name, quantity, value)
    
    print(f"Added {quantity}x {name} to inventory")
    return _items[name]


def remove_item(name, quantity=1):
    """Remove an item from the inventory"""
    if name not in _items:
        print(f"{name} not found in inventory")
        return False
    
    _items[name].quantity -= quantity
    
    if _items[name].quantity <= 0:
        del _items[name]
        print(f"Removed all {name} from inventory")
    else:
        print(f"Removed {quantity}x {name} from inventory")
    
    return True


def get_item(name):
    """Get an item from the inventory"""
    return _items.get(name, None)


def list_items():
    """List all items in the inventory"""
    if not _items:
        print("Inventory is empty")
        return []
    
    print("Inventory:")
    for item in _items.values():
        print(f"  - {item}")
    
    return list(_items.values())


def get_total_value():
    """Calculate total value of all items"""
    total = sum(item.quantity * item.value for item in _items.values())
    print(f"Total inventory value: {total}g")
    return total


def clear_inventory():
    """Remove all items from inventory"""
    _items.clear()
    print("Inventory cleared")
`
};

export const magicModule: CustomModule = {
    name: 'magic',
    description: 'Magic and spell casting system',
    code: `
"""
Magic Module
Spell casting and mana management
"""

class Spell:
    """Represents a spell that can be cast"""
    
    def __init__(self, name, mana_cost, damage, spell_type="offensive"):
        self.name = name
        self.mana_cost = mana_cost
        self.damage = damage
        self.spell_type = spell_type
    
    def cast(self, caster_mana, target_name="Enemy"):
        """Cast the spell if enough mana is available"""
        if caster_mana < self.mana_cost:
            print(f"Not enough mana to cast {self.name}!")
            return {"success": False, "mana_used": 0, "damage": 0}
        
        if self.spell_type == "offensive":
            print(f"Cast {self.name} on {target_name} for {self.damage} damage!")
        elif self.spell_type == "healing":
            print(f"Cast {self.name}! Healed {self.damage} HP!")
        else:
            print(f"Cast {self.name}!")
        
        return {
            "success": True,
            "mana_used": self.mana_cost,
            "damage": self.damage
        }


# Predefined spells
FIREBALL = Spell("Fireball", 25, 30, "offensive")
HEAL = Spell("Heal", 20, 25, "healing")
LIGHTNING = Spell("Lightning Bolt", 35, 45, "offensive")
SHIELD = Spell("Magic Shield", 15, 0, "defensive")


def cast_spell(spell_name, caster_mana, target_name="Enemy"):
    """Cast a predefined spell by name"""
    spells = {
        "fireball": FIREBALL,
        "heal": HEAL,
        "lightning": LIGHTNING,
        "shield": SHIELD
    }
    
    spell = spells.get(spell_name.lower())
    if not spell:
        print(f"Unknown spell: {spell_name}")
        return {"success": False, "mana_used": 0, "damage": 0}
    
    return spell.cast(caster_mana, target_name)


def mana_cost(spell_name):
    """Get the mana cost of a spell"""
    spells = {
        "fireball": 25,
        "heal": 20,
        "lightning": 35,
        "shield": 15
    }
    return spells.get(spell_name.lower(), 0)
`
};

export const utilsModule: CustomModule = {
    name: 'utils',
    description: 'Utility functions for common operations',
    code: `
"""
Utils Module
Common utility functions
"""

import random as _random


def roll_dice(sides=6, count=1):
    """Roll dice and return the result"""
    results = [_random.randint(1, sides) for _ in range(count)]
    total = sum(results)
    
    if count == 1:
        print(f"Rolled 1d{sides}: {total}")
    else:
        print(f"Rolled {count}d{sides}: {results} = {total}")
    
    return total


def chance(percentage):
    """Return True with the given percentage chance"""
    result = _random.randint(1, 100) <= percentage
    return result


def random_choice(items):
    """Choose a random item from a list"""
    if not items:
        return None
    return _random.choice(items)


def clamp(value, min_value, max_value):
    """Clamp a value between min and max"""
    if value < min_value:
        return min_value
    if value > max_value:
        return max_value
    return value
`
};

export const customModules: CustomModule[] = [
    builtinModule,
    abstractsModule,
    userWeaponsModule,
    spearModule,
    inventoryModule,
    magicModule,
    utilsModule
];

export const gameModules: CustomModule[] = customModules;
