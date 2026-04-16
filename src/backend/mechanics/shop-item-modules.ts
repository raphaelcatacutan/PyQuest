import type { Consumable } from "../../game/types/consumable.types";
import type { Weapon } from "../../game/types/weapon.types";
import { Consumables } from "../../game/data/consumables";
import { Weapons } from "../../game/data/weapons";
import type { CustomModule } from "./parser";

const WEAPON_MODULE_NAME = "weapon";
const CONSUMABLE_MODULE_NAME = "consumable";

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
    const normalized = normalizeIdentifier(skillName);

    if (normalized.length === 0) {
        return "skill";
    }

    return /^[0-9]/.test(normalized) ? `skill_${normalized}` : normalized;
}

export function getWeaponSkillMethodEntries(weapon: Weapon): Array<{ methodName: string; skillIndex: number }> {
    const usedNames = new Set<string>();

    return weapon.skills.map((skill, skillIndex) => {
        const baseMethodName = skillNameToMethodName(skill.name);
        let methodName = baseMethodName;
        let suffix = 2;

        while (usedNames.has(methodName) || methodName === "use" || methodName === "attack") {
            methodName = `${baseMethodName}_${suffix}`;
            suffix += 1;
        }

        usedNames.add(methodName);

        return {
            methodName,
            skillIndex
        };
    });
}

function createConsumableVariableCode(consumable: Consumable): string {
    const itemId = normalizeItemId(consumable.id);
    const variableName = normalizeIdentifier(consumable.id);

    return `${variableName} = _ConsumableRef(${toPythonString(itemId)})`;
}

function createWeaponVariableCode(weapon: Weapon): string {
    const itemId = normalizeItemId(weapon.id);
    const variableName = normalizeIdentifier(weapon.id);
    const skillMethods = getWeaponSkillMethodEntries(weapon)
        .map((entry) => `    def ${entry.methodName}(self, target_name="Enemy"):\n        return _emit("shop.weapon.skill", {"itemId": self.item_id, "target": target_name, "skillName": ${toPythonString(entry.methodName)}, "skillIndex": ${entry.skillIndex}})`)
        .join("\n\n");

    const className = `_WeaponRef_${variableName}`;

    const classBody = skillMethods.length > 0
        ? `${className}(_WeaponRefBase):\n${skillMethods}\n\n\n${variableName} = ${className}(${toPythonString(itemId)})`
        : `${variableName} = _WeaponRefBase(${toPythonString(itemId)})`;

    return classBody;
}

export function buildConsumableModuleCode(consumableItemIds: string[]): string {
    const unlockedIds = new Set(consumableItemIds.map((itemId) => normalizeItemId(itemId)));
    const lines = Object.values(Consumables)
        .filter((consumable) => unlockedIds.has(normalizeItemId(consumable.id)))
        .map((consumable) => createConsumableVariableCode(consumable));

    return `
from abstracts import _emit


class _ConsumableRef:
    def __init__(self, item_id):
        self.item_id = item_id

    def consume(self):
        return _emit("shop.consumable.use", {"itemId": self.item_id})

    def use(self):
        return self.consume()


${lines.join("\n")}
`;
}

export function buildWeaponModuleCode(weaponItemIds: string[]): string {
    const unlockedIds = new Set(weaponItemIds.map((itemId) => normalizeItemId(itemId)));
    const lines = Object.values(Weapons)
        .filter((weapon) => unlockedIds.has(normalizeItemId(weapon.id)))
        .map((weapon) => createWeaponVariableCode(weapon));

    return `
from abstracts import _emit


class _WeaponRefBase:
    def __init__(self, item_id):
        self.item_id = item_id

    def use(self, target_name="Enemy"):
        return _emit("shop.weapon.use", {"itemId": self.item_id, "target": target_name})

    def attack(self, target_name="Enemy"):
        return self.use(target_name)


${lines.join("\n\n")}
`;
}

export function isWeaponModule(moduleName: string): boolean {
    return moduleName === WEAPON_MODULE_NAME;
}

export function isConsumableModule(moduleName: string): boolean {
    return moduleName === CONSUMABLE_MODULE_NAME;
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
