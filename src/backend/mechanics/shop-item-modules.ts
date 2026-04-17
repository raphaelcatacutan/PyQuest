import type { Armor } from "../../game/types/armor.types";
import type { Consumable } from "../../game/types/consumable.types";
import type { Weapon } from "../../game/types/weapon.types";
import { Armors } from "../../game/data/armors";
import { Consumables } from "../../game/data/consumables";
import { Weapons } from "../../game/data/weapons";
import type { CustomModule } from "./parser";

const WEAPON_MODULE_NAME = "weapon";
const CONSUMABLE_MODULE_NAME = "consumable";
const PICKEDUP_MODULE_NAME = "pickedup";

function normalizeIdentifier(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function toPythonString(value: string): string {
    return JSON.stringify(value);
}

export function normalizeItemId(itemId: string): string {
    return normalizeIdentifier(itemId);
}

export function skillNameToMethodName(skillName: string): string {
    const normalized = normalizeIdentifier(skillName)
        .replace(/_skills?/gi, "_")
        .replace(/_\d+$/g, "")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "")
        .replace(/_+$/, "");

    if (normalized.length === 0) {
        return "skill";
    }

    if (/^[0-9]/.test(normalized)) {
        return `action_${normalized}`;
    }

    return normalized;
}

export function getWeaponSkillMethodEntries(weapon: Weapon): Array<{ methodName: string; skillIndex: number }> {
    const usedNames = new Set<string>();
    const entries: Array<{ methodName: string; skillIndex: number }> = [];
    const reservedNames = new Set(["use", "attack", "equip", "strike", "consume"]);

    weapon.skills.forEach((skill, skillIndex) => {
        const methodName = skillNameToMethodName(skill.name);

        if (reservedNames.has(methodName)) {
            return;
        }

        if (usedNames.has(methodName)) {
            return;
        }

        usedNames.add(methodName);
        entries.push({
            methodName,
            skillIndex
        });
    });

    return entries;
}

function createConsumableVariableCode(consumable: Consumable): string {
    const itemId = normalizeItemId(consumable.id);
    const variableName = normalizeIdentifier(consumable.id);

    return `${variableName} = _ConsumableRef(${toPythonString(itemId)})`;
}

function createArmorVariableCode(armor: Armor): string {
    const itemId = normalizeItemId(armor.id);
    const variableName = normalizeIdentifier(armor.id);

    return `${variableName} = _ArmorRef(${toPythonString(itemId)})`;
}

function createWeaponVariableCode(weapon: Weapon): string {
    const itemId = normalizeItemId(weapon.id);
    const variableName = normalizeIdentifier(weapon.id);
    const skillMethods = getWeaponSkillMethodEntries(weapon)
        .map((entry) => `    def ${entry.methodName}(self):\n        return _emit("shop.weapon.skill", {"itemId": self.item_id, "skillName": ${toPythonString(entry.methodName)}, "skillIndex": ${entry.skillIndex}})`)
        .join("\n\n");

    const className = `_WeaponRef_${variableName}`;

    const classBody = skillMethods.length > 0
        ? `class ${className}(_WeaponRefBase):\n${skillMethods}\n\n\n${variableName} = ${className}(${toPythonString(itemId)})`
        : `${variableName} = _WeaponRefBase(${toPythonString(itemId)})`;

    return classBody;
}

export function buildConsumableModuleCode(consumableItemIds: string[]): string {
    const unlockedIds = new Set(consumableItemIds.map((itemId) => normalizeItemId(itemId)));
    const lines = Object.values(Consumables)
        .filter((consumable) => unlockedIds.has(normalizeItemId(consumable.id)))
        .map((consumable) => createConsumableVariableCode(consumable));

    return `
def _emit(event_name, payload=None):
    return __pyquest_callback(event_name, payload)


class _ConsumableRef:
    def __init__(self, item_id):
        self.item_id = item_id
        self.name = item_id
        self.item_type = "consumable"

    def consume(self):
        return _emit("shop.consumable.use", {"itemId": self.item_id})


${lines.join("\n")}
`;
}

export function buildWeaponModuleCode(weaponItemIds: string[]): string {
    const unlockedIds = new Set(weaponItemIds.map((itemId) => normalizeItemId(itemId)));
    const lines = Object.values(Weapons)
        .filter((weapon) => unlockedIds.has(normalizeItemId(weapon.id)))
        .map((weapon) => createWeaponVariableCode(weapon));

    return `
def _emit(event_name, payload=None):
    return __pyquest_callback(event_name, payload)


class _WeaponRefBase:
    def __init__(self, item_id):
        self.item_id = item_id
        self.name = item_id
        self.item_type = "weapon"

    def strike(self):
        return _emit("shop.weapon.use", {"itemId": self.item_id})


${lines.join("\n\n")}
`;
}

export type PickedupModuleInput = {
    weaponItemIds: string[];
    consumableItemIds: string[];
    armorItemIds: string[];
};

function buildPickedupSymbolLines(input: PickedupModuleInput): string[] {
    const weaponIdSet = new Set(input.weaponItemIds.map((itemId) => normalizeItemId(itemId)));
    const consumableIdSet = new Set(input.consumableItemIds.map((itemId) => normalizeItemId(itemId)));
    const armorIdSet = new Set(input.armorItemIds.map((itemId) => normalizeItemId(itemId)));
    const usedSymbols = new Set<string>();
    const lines: string[] = [];

    // Pickedup remains the only user-facing module, so keep all item symbols available
    // and let runtime event gates enforce whether an item can actually be used.
    const shouldIncludeAllSymbols = true;

    for (const weapon of Object.values(Weapons)) {
        const normalizedId = normalizeItemId(weapon.id);
        const symbolName = normalizeIdentifier(weapon.id);

        if ((!shouldIncludeAllSymbols && !weaponIdSet.has(normalizedId)) || usedSymbols.has(symbolName)) {
            continue;
        }

        usedSymbols.add(symbolName);
        lines.push(createWeaponVariableCode(weapon));
    }

    for (const consumable of Object.values(Consumables)) {
        const normalizedId = normalizeItemId(consumable.id);
        const symbolName = normalizeIdentifier(consumable.id);

        if ((!shouldIncludeAllSymbols && !consumableIdSet.has(normalizedId)) || usedSymbols.has(symbolName)) {
            continue;
        }

        usedSymbols.add(symbolName);
        lines.push(createConsumableVariableCode(consumable));
    }

    for (const armor of Object.values(Armors)) {
        const normalizedId = normalizeItemId(armor.id);
        const symbolName = normalizeIdentifier(armor.id);

        if ((!shouldIncludeAllSymbols && !armorIdSet.has(normalizedId)) || usedSymbols.has(symbolName)) {
            continue;
        }

        usedSymbols.add(symbolName);
        lines.push(createArmorVariableCode(armor));
    }

    return lines;
}

export function buildPickedupModuleCode(input: PickedupModuleInput): string {
    const lines = buildPickedupSymbolLines(input);

    return `
def _emit(event_name, payload=None):
    return __pyquest_callback(event_name, payload)


class _ConsumableRef:
    def __init__(self, item_id):
        self.item_id = item_id
        self.name = item_id
        self.item_type = "consumable"

    def consume(self):
        return _emit("shop.consumable.use", {"itemId": self.item_id})


class _WeaponRefBase:
    def __init__(self, item_id):
        self.item_id = item_id
        self.name = item_id
        self.item_type = "weapon"

    def strike(self):
        return _emit("shop.weapon.use", {"itemId": self.item_id})


class _ArmorRef:
    def __init__(self, item_id):
        self.item_id = item_id
        self.name = item_id
        self.item_type = "armor"


${lines.join("\n\n")}
`;
}

export function isWeaponModule(moduleName: string): boolean {
    return moduleName === WEAPON_MODULE_NAME;
}

export function isConsumableModule(moduleName: string): boolean {
    return moduleName === CONSUMABLE_MODULE_NAME;
}

export function isPickedupModule(moduleName: string): boolean {
    return moduleName === PICKEDUP_MODULE_NAME;
}

export function normalizeImportedItemSymbol(symbol: string): string {
    return normalizeIdentifier(symbol);
}

export const generatedWeaponModules: CustomModule[] = [
    {
        name: WEAPON_MODULE_NAME,
        description: "Shop weapon module",
        code: buildWeaponModuleCode([])
    }
];

export const generatedConsumableModules: CustomModule[] = [
    {
        name: CONSUMABLE_MODULE_NAME,
        description: "Shop consumable module",
        code: buildConsumableModuleCode([])
    }
];

export const generatedPickedupModules: CustomModule[] = [
    {
        name: PICKEDUP_MODULE_NAME,
        description: "Picked-up inventory item module",
        code: buildPickedupModuleCode({
            weaponItemIds: [],
            consumableItemIds: [],
            armorItemIds: []
        })
    }
];
