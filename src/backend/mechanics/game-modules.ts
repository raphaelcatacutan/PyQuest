/**
 * Built-in game modules that players can import in their Python code
 */

import type { CustomModule } from './parser';
import { generatedPickedupModules } from './shop-item-modules';

export const builtinModule: CustomModule = {
    name: 'builtin',
    description: 'Preloaded helpers available without import',
    visibility: 'internal',
    prelude: true,
    code: `
def _emit(event_name, payload=None):
    return __pyquest_callback(event_name, payload)


def _state(path, fallback=None):
    return __pyquest_state(path, fallback)


def _resolve_item_payload(item):
    if item is None:
        return {"itemId": "", "itemType": ""}

    item_id = getattr(item, "item_id", "")
    if item_id == "":
        item_id = getattr(item, "name", "")

    item_type = getattr(item, "item_type", "")
    return {"itemId": item_id, "itemType": item_type}


class _ArmorProxy:
    @property
    def type(self) -> str:
        return _state("player.headSlot", "")

    @property
    def durability(self) -> float:
        return _state("player.maxDef", 0)


class _PlayerProxy:
    @property
    def energy(self) -> int:
        return _state("player.energy", 0)

    @property
    def hp(self) -> float:
        return _state("player.hp", 100)

    @property
    def armor(self) -> _ArmorProxy:
        return _ArmorProxy()

    def equip(self, item):
        return _emit("player.equip", _resolve_item_payload(item))

    def unequip(self, item=None):
        return _emit("player.unequip", _resolve_item_payload(item))

def chance(percentage):
    result = percentage >= 50
    _emit("builtin.chance", {"percentage": percentage, "result": result})
    return result


def goTo(locationId: str):
    return _emit("builtin.goTo", {"locationId": locationId, "from": _state("scene.scene", "")})


def scavenge():
    return _emit("builtin.scavenge", {"scene": _state("scene.scene", ""), "coins": 1})


def explore(state=True):
    return _emit("builtin.explore", {"scene": _state("scene.scene", ""), "state": bool(state)})


player = _PlayerProxy()
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


def _resolve_item_payload(item):
    if item is None:
        return {"itemId": "", "itemType": ""}

    item_id = getattr(item, "item_id", "")
    if item_id == "":
        item_id = getattr(item, "name", "")

    item_type = getattr(item, "item_type", "")
    return {"itemId": item_id, "itemType": item_type}


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
        return _emit("player.equip", _resolve_item_payload(item))

    def unequip(self, item: Item = None):
        return _emit("player.unequip", _resolve_item_payload(item))

class Enemy(Entity):
    pass

class Slime(Enemy):
    pass

`
};

export const customModules: CustomModule[] = [
    builtinModule,
    abstractsModule,
    ...generatedPickedupModules
];

export const gameModules: CustomModule[] = customModules;
