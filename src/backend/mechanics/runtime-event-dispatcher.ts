import { useBossStore, useBountyQuestStore, useDungeonStore, useEnemyStore, useGameStore, useInventoryStore, usePlayerStore, useSceneStore, useTerminalStore, useTrialsStore, useTutorialStore } from "../../game/store";
import { MachineProblems } from "../../game/data/mps";
import { Consumables } from "../../game/data/consumables";
import { Weapons } from "../../game/data/weapons";
import { Armors } from "../../game/data/armors";
import type { Armor } from "../../game/types/armor.types";
import type { Consumable } from "../../game/types/consumable.types";
import type { SceneTypes } from "../../game/types/scene.types";
import type { Weapon } from "../../game/types/weapon.types";
import type { PythonModuleCallEvent } from "./parser";
import { resolveConsumableUseEnergyCost, resolveWeaponUseEnergyCost } from "./item-energy-costs";
import { getUnlockedPickedupImportState } from "./runtime-module-gates";
import { getWeaponSkillMethodEntries, normalizeItemId } from "./shop-item-modules";
import statementDamageTable from "./damage.json";

const SCENE_VALUES: SceneTypes[] = [
    "",
    "forest",
    "desert",
    "swamp",
    "cemetery",
    "tundra",
    "jungle",
    "temple",
    "village",
    "labyrinth",
    "dungeon",
    "trials"
];

const SCENE_SET = new Set<string>(SCENE_VALUES);

const MACHINE_PROBLEM_PLACES: SceneTypes[] = Object.keys(MachineProblems)
    .map((scene) => scene.trim().toLowerCase())
    .filter(isSceneType);

const MACHINE_PROBLEM_PLACE_SET = new Set<string>(MACHINE_PROBLEM_PLACES);

type StatementMechanics = {
    damage: number;
    energyCost: number;
};

const DEFAULT_STATEMENT_MECHANICS: StatementMechanics = {
    damage: 0,
    energyCost: 0
};

const STATEMENT_MECHANICS = statementDamageTable as Record<string, StatementMechanics>;

function readPayload(payload: unknown): Record<string, unknown> {
    if (payload && typeof payload === "object") {
        return payload as Record<string, unknown>;
    }

    return {};
}

function readString(payload: unknown, key: string, fallback = ""): string {
    const value = readPayload(payload)[key];

    if (typeof value === "string") {
        return value;
    }

    return fallback;
}

function readNumber(payload: unknown, key: string, fallback = 0): number {
    const value = readPayload(payload)[key];

    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string") {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }

    return fallback;
}

function readBoolean(payload: unknown, key: string, fallback = false): boolean {
    const value = readPayload(payload)[key];

    if (typeof value === "boolean") {
        return value;
    }

    return fallback;
}

function isSceneType(scene: string): scene is SceneTypes {
    return SCENE_SET.has(scene);
}

function normalizeQuestLevel(level: unknown): number {
    if (typeof level !== "number" || !Number.isFinite(level)) {
        return 1;
    }

    return Math.max(1, Math.floor(level));
}

function getUnlockedPlacesByQuestLevel(level: number): SceneTypes[] {
    if (MACHINE_PROBLEM_PLACES.length === 0) {
        return [];
    }

    const unlockedCount = Math.min(level, MACHINE_PROBLEM_PLACES.length);
    return MACHINE_PROBLEM_PLACES.slice(0, unlockedCount);
}

function appendTerminalLog(message: string): void {
    useTerminalStore.getState().appendToLog(`[PY]: ${message}`);
}

function appendRuntimeDebug(message: string, payload?: unknown): void {
    if (payload === undefined) {
        console.log("[PY-DEBUG]", message);
        return;
    }

    console.log("[PY-DEBUG]", message, payload);
}

function isWorldSyntaxUnlocked(): boolean {
    const isTutorial = useTutorialStore.getState().isTutorial;
    return !isTutorial;
}

function setSceneAndFlags(scene: SceneTypes): void {
    useSceneStore.getState().setScene(scene);
    useGameStore.setState({
        inVillage: scene === "village",
        inCombat: false
    });
    useDungeonStore.setState({
        inDungeon: scene === "dungeon"
    });
    useTrialsStore.setState({
        inTrials: scene === "trials"
    });
}

function applyPlayerAttackDamage(damage: number): void {
    if (damage <= 0) {
        return;
    }

    const gameState = useGameStore.getState();
    if (!gameState.inCombat) {
        appendRuntimeDebug("attack skipped", { damage, reason: "combat is not active" });
        return;
    }

    if (gameState.isEnemy) {
        useEnemyStore.getState().takeDamage(damage);
        appendRuntimeDebug("enemy took damage", { damage });
        return;
    }

    useBossStore.getState().takeDamage(damage);
    appendRuntimeDebug("boss took damage", { damage });
}

function normalizeNonNegativeInt(value: unknown): number {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return 0;
    }

    return Math.max(0, Math.floor(value));
}

function resolveStatementMechanics(statementType: string): StatementMechanics {
    const rawValue = STATEMENT_MECHANICS[statementType] ?? STATEMENT_MECHANICS.Statement ?? DEFAULT_STATEMENT_MECHANICS;

    if (!rawValue || typeof rawValue !== "object") {
        return DEFAULT_STATEMENT_MECHANICS;
    }

    return {
        damage: normalizeNonNegativeInt(rawValue.damage),
        energyCost: normalizeNonNegativeInt(rawValue.energyCost)
    };
}

function trySpendPlayerEnergy(cost: number): boolean {
    if (cost <= 0) {
        return true;
    }

    const player = usePlayerStore.getState();
    const availableEnergy = normalizeNonNegativeInt(player.energy);

    if (availableEnergy < cost) {
        return false;
    }

    player.spendEnergy(cost);
    return true;
}

function isEnemyCombatActive(): boolean {
    const gameState = useGameStore.getState();
    return gameState.inCombat && gameState.isEnemy;
}

function isPurchasedWeapon(itemId: string): boolean {
    const normalizedItemId = normalizeItemId(itemId);
    const purchased = useInventoryStore.getState().purchasedWeaponIds
        .map((purchasedItemId) => normalizeItemId(purchasedItemId))
        .includes(normalizedItemId);

    if (purchased) {
        return true;
    }

    return getUnlockedPickedupImportState().weaponItemIds.includes(normalizedItemId);
}

function isPurchasedConsumable(itemId: string): boolean {
    const normalizedItemId = normalizeItemId(itemId);
    const purchased = useInventoryStore.getState().purchasedConsumableIds
        .map((purchasedItemId) => normalizeItemId(purchasedItemId))
        .includes(normalizedItemId);

    if (purchased) {
        return true;
    }

    return getUnlockedPickedupImportState().consumableItemIds.includes(normalizedItemId);
}

function isImportedArmor(itemId: string): boolean {
    const normalizedItemId = normalizeItemId(itemId);
    return getUnlockedPickedupImportState().armorItemIds.includes(normalizedItemId);
}

function resolveArmorDefenseContribution(armor: Armor): number {
    const baseDef = normalizeNonNegativeInt(armor.baseDef);
    const modifierDelta = armor.modifiers
        .filter((modifier) => modifier.stat === "def")
        .reduce((total, modifier) => {
            const value = normalizeNonNegativeInt(modifier.value);
            return total + (modifier.nature === "penalty" ? -value : value);
        }, 0);

    return Math.max(0, baseDef + modifierDelta);
}

function resolveEquippedArmorDefense(headArmorId: string, bodyArmorId: string): number {
    const headArmor = Armors[headArmorId];
    const bodyArmor = Armors[bodyArmorId];
    const headDefense = headArmor ? resolveArmorDefenseContribution(headArmor) : 0;
    const bodyDefense = bodyArmor ? resolveArmorDefenseContribution(bodyArmor) : 0;

    return Math.max(0, headDefense + bodyDefense);
}

function applyEquippedArmorSlots(headArmorId: string, bodyArmorId: string): void {
    const player = usePlayerStore.getState();
    const previousArmorDefense = normalizeNonNegativeInt(player.maxDef);
    const nextArmorDefense = resolveEquippedArmorDefense(headArmorId, bodyArmorId);
    const baseDefense = Math.max(0, normalizeNonNegativeInt(player.def) - previousArmorDefense);

    usePlayerStore.setState({
        headSlot: headArmorId,
        bodySlot: bodyArmorId,
        maxDef: nextArmorDefense,
        def: Math.max(0, baseDefense + nextArmorDefense)
    });
}

function applyEnemyDamage(damage: number): void {
    if (damage <= 0) {
        return;
    }

    useEnemyStore.getState().takeDamage(damage);
    appendRuntimeDebug("enemy took item damage", { damage });
}

function computeWeaponModifierDamageDelta(weapon: Weapon): number {
    return weapon.modifiers
        .filter((modifier) => modifier.stat === "dmg")
        .reduce((total, modifier) => {
            const value = Number.isFinite(modifier.value) ? modifier.value : 0;
            return total + (modifier.nature === "penalty" ? -value : value);
        }, 0);
}

function applyWeaponInflictions(weapon: Weapon): number {
    return weapon.inflictions.reduce((totalBonusDamage, infliction) => {
        const durationSeconds = infliction.duration > 100
            ? Math.max(1, Math.floor(infliction.duration / 1000))
            : Math.max(1, Math.floor(infliction.duration));

        if (infliction.type === "stun") {
            useEnemyStore.getState().takeEnergyCost(Math.max(1, durationSeconds));
            appendRuntimeDebug("weapon infliction applied", {
                type: infliction.type,
                duration: infliction.duration
            });
            return totalBonusDamage;
        }

        const basePerSecond = infliction.type === "burn" ? 3 : 2;
        const expectedDamage = Math.max(0, Math.round(basePerSecond * durationSeconds * infliction.chance));

        if (expectedDamage > 0) {
            appendRuntimeDebug("weapon infliction applied", {
                type: infliction.type,
                duration: infliction.duration,
                chance: infliction.chance,
                expectedDamage
            });
        }

        return totalBonusDamage + expectedDamage;
    }, 0);
}

function resolveWeaponSkillIndex(weapon: Weapon, skillName: string, fallbackSkillIndex: number): number {
    if (skillName.length === 0) {
        return fallbackSkillIndex;
    }

    const skillEntry = getWeaponSkillMethodEntries(weapon)
        .find((entry) => entry.methodName === skillName);

    if (!skillEntry) {
        return fallbackSkillIndex;
    }

    return skillEntry.skillIndex;
}

function applyWeaponSkill(itemId: string, weapon: Weapon, skillName: string, fallbackSkillIndex: number): void {
    const skillIndex = resolveWeaponSkillIndex(weapon, skillName, fallbackSkillIndex);
    const skill = weapon.skills[skillIndex];
    if (!skill) {
        appendTerminalLog(`${itemId} has no skill named '${skillName || "skill"}'.`);
        return;
    }

    const energyCost = Math.max(0, Math.floor(skill.energyCost));
    if (!trySpendPlayerEnergy(energyCost)) {
        appendTerminalLog(`Not enough energy to use ${itemId} skill '${skill.name}'.`);
        return;
    }

    switch (skill.effect.type) {
        case "damage": {
            applyEnemyDamage(Math.max(0, Math.floor(skill.effect.value)));
            break;
        }

        case "heal": {
            usePlayerStore.getState().gainHP(Math.max(0, Math.floor(skill.effect.value)));
            break;
        }

        case "stun": {
            const durationValue = skill.effect.duration ?? skill.effect.value;
            const energyDrain = durationValue > 100
                ? Math.max(1, Math.floor(durationValue / 1000))
                : Math.max(1, Math.floor(durationValue));
            useEnemyStore.getState().takeEnergyCost(energyDrain);
            break;
        }

        case "bleed": {
            const durationValue = skill.effect.duration ?? 1;
            const durationSeconds = durationValue > 100
                ? Math.max(1, Math.floor(durationValue / 1000))
                : Math.max(1, Math.floor(durationValue));
            const bleedDamage = Math.max(0, Math.floor(skill.effect.value)) * durationSeconds;
            applyEnemyDamage(bleedDamage);
            break;
        }

        default: {
            break;
        }
    }

    appendRuntimeDebug("weapon skill used", {
        itemId,
        skillIndex,
        requestedSkillName: skillName,
        resolvedSkillName: skill.name,
        effectType: skill.effect.type,
        effectValue: skill.effect.value,
        energyCost
    });
}

function applyConsumableEffects(itemId: string, consumable: Consumable): void {
    const player = usePlayerStore.getState();

    for (const effect of consumable.effects) {
        if (effect.type === "restore") {
            if (effect.stat === "hp") {
                player.gainHP(Math.max(0, Math.floor(effect.amount)));
                continue;
            }

            if (effect.stat === "energy") {
                player.gainEnergy(Math.max(0, Math.floor(effect.amount)));
                continue;
            }

            if (effect.stat === "def") {
                player.gainDef(Math.max(0, Math.floor(effect.amount)));
                continue;
            }
        }

        if (effect.type === "buff") {
            const multiplier = Number.isFinite(effect.multiplier) ? effect.multiplier : 1;
            if (multiplier <= 1) {
                continue;
            }

            if (effect.stat === "dmg") {
                const damageBoost = Math.max(1, Math.floor(player.baseDmg * (multiplier - 1)));
                player.setDamage(damageBoost);
                continue;
            }

            if (effect.stat === "def") {
                const defenseBoost = Math.max(1, Math.floor(Math.max(1, player.def) * (multiplier - 1)));
                player.gainDef(defenseBoost);
                continue;
            }

            if (effect.stat === "speed") {
                const speedBoost = Math.max(1, Math.floor(player.atkSpeed * (1 - (1 / multiplier))));
                player.setAtkSpeed(-speedBoost);
                continue;
            }
        }

        if (effect.type === "debuff") {
            const amount = Math.max(0, Math.floor(effect.amount));

            if (effect.stat === "hp") {
                applyEnemyDamage(amount);
                continue;
            }

            if (effect.stat === "energy") {
                useEnemyStore.getState().takeEnergyCost(amount);
                continue;
            }

            if (effect.stat === "speed") {
                useEnemyStore.getState().takeEnergyCost(Math.max(1, Math.floor(amount / 2)));
                continue;
            }
        }
    }

    appendRuntimeDebug("consumable used", { itemId, effectCount: consumable.effects.length });
}

function applyArmorActivation(itemId: string): void {
    const armor = Armors[itemId];
    if (!armor) {
        appendTerminalLog(`Armor '${itemId}' is not registered.`);
        return;
    }

    const player = usePlayerStore.getState();

    player.gainDef(Math.max(0, Math.floor(armor.baseDef)));

    for (const modifier of armor.modifiers) {
        const magnitude = Math.max(0, Math.floor(modifier.value));
        const signedMagnitude = modifier.nature === "penalty" ? -magnitude : magnitude;

        if (modifier.stat === "def") {
            player.gainDef(signedMagnitude);
            continue;
        }

        if (modifier.stat === "health") {
            player.gainHP(signedMagnitude);
            continue;
        }

        if (modifier.stat === "energy") {
            player.gainEnergy(signedMagnitude);
            continue;
        }

        if (modifier.stat === "dmg") {
            player.setDamage(signedMagnitude);
            continue;
        }

        if (modifier.stat === "atkSpeed") {
            player.setAtkSpeed(modifier.nature === "penalty" ? magnitude : -magnitude);
        }
    }

    appendRuntimeDebug("armor activated", { itemId, baseDef: armor.baseDef, modifiers: armor.modifiers.length });
}

export function dispatchPythonRuntimeEvent(event: PythonModuleCallEvent): void {
    const payload = event.payload;

    switch (event.name) {
        case "builtin.goTo": {
            if (!isWorldSyntaxUnlocked()) {
                appendTerminalLog("goTo() is locked during tutorial.");
                return;
            }

            const locationId = readString(payload, "locationId", "").trim().toLowerCase();
            const questLevel = normalizeQuestLevel(useBountyQuestStore.getState().questLevel);
            const unlockedPlaces = getUnlockedPlacesByQuestLevel(questLevel);

            if (!isSceneType(locationId)) {
                appendTerminalLog(`Unknown scene '${locationId}'.`);
                return;
            }

            if (!MACHINE_PROBLEM_PLACE_SET.has(locationId)) {
                appendTerminalLog(`'${locationId}' is not a goTo() destination.`);
                return;
            }

            if (!unlockedPlaces.includes(locationId)) {
                const unlockedText = unlockedPlaces.length > 0 ? unlockedPlaces.join(", ") : "none";
                appendTerminalLog(`'${locationId}' is locked for level ${questLevel}. Unlocked places: ${unlockedText}.`);
                return;
            }

            setSceneAndFlags(locationId);
            appendRuntimeDebug("scene changed", { locationId });
            return;
        }

        case "builtin.scavenge": {
            if (!isWorldSyntaxUnlocked()) {
                appendTerminalLog("scavenge() is locked during tutorial.");
                return;
            }

            const amount = Math.max(0, readNumber(payload, "coins", 1));
            usePlayerStore.getState().gainCoins(amount);
            appendRuntimeDebug("scavenge rewarded", { amount });
            return;
        }

        case "builtin.explore": {
            if (!isWorldSyntaxUnlocked()) {
                appendTerminalLog("explore() is locked during tutorial.");
                return;
            }

            const state = readBoolean(payload, "state", true);
            useGameStore.getState().toggleInCombat(state);
            appendRuntimeDebug("explore set combat", { state });
            return;
        }

        case "player.gain_hp": {
            const amount = Math.max(0, readNumber(payload, "amount", 0));
            usePlayerStore.getState().gainHP(amount);
            appendRuntimeDebug("player healed", { amount });
            return;
        }

        case "player.take_damage": {
            const amount = Math.max(0, readNumber(payload, "amount", 0));
            const player = usePlayerStore.getState();
            player.takeDamage(amount);
            player.toggleIsDamaged(true);
            appendRuntimeDebug("player took damage", { amount });
            return;
        }

        case "player.gain_coins": {
            const amount = Math.max(0, readNumber(payload, "amount", 0));
            usePlayerStore.getState().gainCoins(amount);
            appendRuntimeDebug("player gained coins", { amount });
            return;
        }

        case "player.gain_xp": {
            const amount = Math.max(0, readNumber(payload, "amount", 0));
            usePlayerStore.getState().gainXP(amount);
            appendRuntimeDebug("player gained xp", { amount });
            return;
        }

        case "game.combat": {
            const state = readBoolean(payload, "state", false);
            useGameStore.getState().toggleInCombat(state);
            appendRuntimeDebug("combat state changed", { state });
            return;
        }

        case "game.is_enemy": {
            const state = readBoolean(payload, "state", true);
            useGameStore.getState().toggleIsEnemy(state);
            appendRuntimeDebug("encounter target set", { target: state ? "enemy" : "boss" });
            return;
        }

        case "terminal.log": {
            const message = readString(payload, "message", "");
            if (message.length > 0) {
                appendRuntimeDebug("module log", { message });
            }
            return;
        }

        case "python.statement": {
            const statementType = readString(payload, "statementType", "Statement");
            const lineNumber = Math.max(0, readNumber(payload, "lineNumber", 0));
            const delayValue = Math.max(0, readNumber(payload, "delayMs", 0));
            const statementMechanics = resolveStatementMechanics(statementType);
            appendRuntimeDebug("statement trace", {
                statementType,
                lineNumber,
                delayMs: delayValue,
                energyCost: statementMechanics.energyCost,
                damage: statementMechanics.damage
            });

            const hasSpentEnergy = trySpendPlayerEnergy(statementMechanics.energyCost);
            if (!hasSpentEnergy) {
                appendTerminalLog(`Insufficient energy for ${statementType} (required ${statementMechanics.energyCost}).`);
                return;
            }

            applyPlayerAttackDamage(statementMechanics.damage);
            return;
        }

        case "spear.attack":
        case "spear.attack.quick":
        case "spear.thrust":
        case "spear.pierce": {
            const damage = Math.max(0, readNumber(payload, "damage", 0));
            applyPlayerAttackDamage(damage);
            return;
        }

        case "shop.weapon.use": {
            const itemId = normalizeItemId(readString(payload, "itemId", ""));

            if (itemId.length === 0) {
                appendTerminalLog("Weapon use failed: missing item id.");
                return;
            }

            if (!isEnemyCombatActive()) {
                appendTerminalLog(`'${itemId}' can only be used during enemy combat.`);
                return;
            }

            if (!isPurchasedWeapon(itemId)) {
                appendTerminalLog(`'${itemId}' is not available in pickedup inventory.`);
                return;
            }

            const weapon = Weapons[itemId];
            if (!weapon) {
                appendTerminalLog(`Weapon '${itemId}' is not registered.`);
                return;
            }

            const weaponEnergyCost = resolveWeaponUseEnergyCost(itemId, weapon.energyCostPerSwing);
            if (!trySpendPlayerEnergy(weaponEnergyCost)) {
                appendTerminalLog(`Not enough energy to use '${itemId}'.`);
                return;
            }

            const basePlayerDamage = Math.max(0, Math.floor(usePlayerStore.getState().baseDmg));
            const modifierDelta = computeWeaponModifierDamageDelta(weapon);
            const inflictionBonusDamage = applyWeaponInflictions(weapon);
            const totalDamage = Math.max(0, Math.floor(weapon.baseDmg + basePlayerDamage + modifierDelta + inflictionBonusDamage));

            applyEnemyDamage(totalDamage);
            appendRuntimeDebug("shop weapon used", {
                itemId,
                totalDamage,
                energyCost: weaponEnergyCost,
                basePlayerDamage,
                modifierDelta,
                inflictionBonusDamage
            });
            return;
        }

        case "shop.weapon.skill": {
            const itemId = normalizeItemId(readString(payload, "itemId", ""));
            const skillName = readString(payload, "skillName", "").trim().toLowerCase();
            const skillIndex = Math.max(0, Math.floor(readNumber(payload, "skillIndex", 0)));

            if (itemId.length === 0) {
                appendTerminalLog("Weapon skill failed: missing item id.");
                return;
            }

            if (!isEnemyCombatActive()) {
                appendTerminalLog(`'${itemId}' skill can only be used during enemy combat.`);
                return;
            }

            if (!isPurchasedWeapon(itemId)) {
                appendTerminalLog(`'${itemId}' is not available in pickedup inventory.`);
                return;
            }

            const weapon = Weapons[itemId];
            if (!weapon) {
                appendTerminalLog(`Weapon '${itemId}' is not registered.`);
                return;
            }

            applyWeaponSkill(itemId, weapon, skillName, skillIndex);
            return;
        }

        case "shop.consumable.use": {
            const itemId = normalizeItemId(readString(payload, "itemId", ""));

            if (itemId.length === 0) {
                appendTerminalLog("Consumable use failed: missing item id.");
                return;
            }

            if (!isEnemyCombatActive()) {
                appendTerminalLog(`'${itemId}' can only be consumed during enemy combat.`);
                return;
            }

            if (!isPurchasedConsumable(itemId)) {
                appendTerminalLog(`'${itemId}' is not available in pickedup inventory.`);
                return;
            }

            const consumable = Consumables[itemId];
            if (!consumable) {
                appendTerminalLog(`Consumable '${itemId}' is not registered.`);
                return;
            }

            const consumableEnergyCost = resolveConsumableUseEnergyCost(itemId, 1);
            if (!trySpendPlayerEnergy(consumableEnergyCost)) {
                appendTerminalLog(`Not enough energy to consume '${itemId}'.`);
                return;
            }

            applyConsumableEffects(itemId, consumable);
            appendRuntimeDebug("consumable energy spent", { itemId, energyCost: consumableEnergyCost });
            return;
        }

        case "pickedup.armor.activate": {
            const itemId = normalizeItemId(readString(payload, "itemId", ""));
            if (itemId.length === 0) {
                appendTerminalLog("Armor activation failed: missing item id.");
                return;
            }

            if (!getUnlockedPickedupImportState().armorItemIds.includes(itemId)) {
                appendTerminalLog(`'${itemId}' is not available in pickedup inventory.`);
                return;
            }

            applyArmorActivation(itemId);
            return;
        }

        case "player.equip": {
            const itemId = normalizeItemId(readString(payload, "itemId", readString(payload, "item", "")));
            const itemType = readString(payload, "itemType", "").trim().toLowerCase();

            if (itemId.length === 0) {
                appendTerminalLog("player.equip() failed: missing armor item id.");
                return;
            }

            if (itemType !== "armor") {
                appendTerminalLog("player.equip() only accepts imported armors.");
                return;
            }

            if (!isImportedArmor(itemId)) {
                appendTerminalLog(`'${itemId}' is not available in pickedup inventory.`);
                return;
            }

            const armor = Armors[itemId];
            if (!armor) {
                appendTerminalLog(`Armor '${itemId}' is not registered.`);
                return;
            }

            const player = usePlayerStore.getState();
            const currentHeadSlot = normalizeItemId(player.headSlot);
            const currentBodySlot = normalizeItemId(player.bodySlot);

            if (armor.slotType === "head") {
                applyEquippedArmorSlots(itemId, currentBodySlot);
                appendRuntimeDebug("player armor equipped", { itemId, slotType: armor.slotType });
                return;
            }

            if (armor.slotType === "body") {
                applyEquippedArmorSlots(currentHeadSlot, itemId);
                appendRuntimeDebug("player armor equipped", { itemId, slotType: armor.slotType });
                return;
            }

            appendTerminalLog(`Armor '${itemId}' cannot be equipped.`);
            return;
        }

        case "player.unequip": {
            const itemId = normalizeItemId(readString(payload, "itemId", ""));
            const itemType = readString(payload, "itemType", "").trim().toLowerCase();
            const player = usePlayerStore.getState();
            const currentHeadSlot = normalizeItemId(player.headSlot);
            const currentBodySlot = normalizeItemId(player.bodySlot);

            if (itemId.length === 0) {
                applyEquippedArmorSlots("", "");
                appendRuntimeDebug("player armor unequipped", { scope: "all" });
                return;
            }

            if (itemType !== "armor") {
                appendTerminalLog("player.unequip() only accepts imported armors.");
                return;
            }

            if (!isImportedArmor(itemId)) {
                appendTerminalLog(`'${itemId}' is not available in pickedup inventory.`);
                return;
            }

            const nextHeadSlot = currentHeadSlot === itemId ? "" : currentHeadSlot;
            const nextBodySlot = currentBodySlot === itemId ? "" : currentBodySlot;

            if (nextHeadSlot === currentHeadSlot && nextBodySlot === currentBodySlot) {
                appendTerminalLog(`'${itemId}' is not currently equipped.`);
                return;
            }

            applyEquippedArmorSlots(nextHeadSlot, nextBodySlot);
            appendRuntimeDebug("player armor unequipped", { itemId });
            return;
        }

        case "spear.repair":
        case "spear.create":
        case "builtin.roll_dice":
        case "builtin.chance":
        case "builtin.random_choice":
        case "builtin.clamp": {
            return;
        }

        default: {
            return;
        }
    }
}