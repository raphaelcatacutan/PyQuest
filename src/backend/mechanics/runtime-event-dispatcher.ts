import { useBossStore, useBountyQuestStore, useDungeonStore, useEnemyStore, useGameStore, usePlayerStore, useSceneStore, useTerminalStore, useTrialsStore, useTutorialStore } from "../../game/store";
import { MachineProblems } from "../../game/data/mps";
import type { SceneTypes } from "../../game/types/scene.types";
import type { PythonModuleCallEvent } from "./parser";
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

function appendRuntimeLog(message: string): void {
    useTerminalStore.getState().appendToLog(`[PY]: ${message}`);
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
        appendRuntimeLog(`Attack skipped (${damage}) because combat is not active.`);
        return;
    }

    if (gameState.isEnemy) {
        useEnemyStore.getState().takeDamage(damage);
        appendRuntimeLog(`Enemy took ${damage} damage.`);
        return;
    }

    useBossStore.getState().takeDamage(damage);
    appendRuntimeLog(`Boss took ${damage} damage.`);
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

export function dispatchPythonRuntimeEvent(event: PythonModuleCallEvent): void {
    const payload = event.payload;

    switch (event.name) {
        case "builtin.goTo": {
            if (!isWorldSyntaxUnlocked()) {
                appendRuntimeLog("goTo() is locked during tutorial.");
                return;
            }

            const locationId = readString(payload, "locationId", "").trim().toLowerCase();
            const questLevel = normalizeQuestLevel(useBountyQuestStore.getState().questLevel);
            const unlockedPlaces = getUnlockedPlacesByQuestLevel(questLevel);

            if (!isSceneType(locationId)) {
                appendRuntimeLog(`Unknown scene '${locationId}'.`);
                return;
            }

            if (!MACHINE_PROBLEM_PLACE_SET.has(locationId)) {
                appendRuntimeLog(`'${locationId}' is not a goTo() destination.`);
                return;
            }

            if (!unlockedPlaces.includes(locationId)) {
                const unlockedText = unlockedPlaces.length > 0 ? unlockedPlaces.join(", ") : "none";
                appendRuntimeLog(`'${locationId}' is locked for level ${questLevel}. Unlocked places: ${unlockedText}.`);
                return;
            }

            setSceneAndFlags(locationId);
            appendRuntimeLog(`Moved to ${locationId}.`);
            return;
        }

        case "builtin.scavenge": {
            if (!isWorldSyntaxUnlocked()) {
                appendRuntimeLog("scavenge() is locked during tutorial.");
                return;
            }

            const amount = Math.max(0, readNumber(payload, "coins", 1));
            usePlayerStore.getState().gainCoins(amount);
            appendRuntimeLog(`Scavenge rewarded ${amount} coin(s).`);
            return;
        }

        case "builtin.explore": {
            if (!isWorldSyntaxUnlocked()) {
                appendRuntimeLog("explore() is locked during tutorial.");
                return;
            }

            const state = readBoolean(payload, "state", true);
            useGameStore.getState().toggleInCombat(state);
            appendRuntimeLog(`Explore set combat to ${state}.`);
            return;
        }

        case "player.gain_hp": {
            const amount = Math.max(0, readNumber(payload, "amount", 0));
            usePlayerStore.getState().gainHP(amount);
            appendRuntimeLog(`Player healed for ${amount}.`);
            return;
        }

        case "player.take_damage": {
            const amount = Math.max(0, readNumber(payload, "amount", 0));
            const player = usePlayerStore.getState();
            player.takeDamage(amount);
            player.toggleIsDamaged(true);
            appendRuntimeLog(`Player took ${amount} damage.`);
            return;
        }

        case "player.gain_coins": {
            const amount = Math.max(0, readNumber(payload, "amount", 0));
            usePlayerStore.getState().gainCoins(amount);
            appendRuntimeLog(`Player gained ${amount} coin(s).`);
            return;
        }

        case "player.gain_xp": {
            const amount = Math.max(0, readNumber(payload, "amount", 0));
            usePlayerStore.getState().gainXP(amount);
            appendRuntimeLog(`Player gained ${amount} XP.`);
            return;
        }

        case "game.combat": {
            const state = readBoolean(payload, "state", false);
            useGameStore.getState().toggleInCombat(state);
            appendRuntimeLog(`Combat set to ${state}.`);
            return;
        }

        case "game.is_enemy": {
            const state = readBoolean(payload, "state", true);
            useGameStore.getState().toggleIsEnemy(state);
            appendRuntimeLog(`Encounter target set to ${state ? "enemy" : "boss"}.`);
            return;
        }

        case "terminal.log": {
            const message = readString(payload, "message", "");
            if (message.length > 0) {
                appendRuntimeLog(message);
            }
            return;
        }

        case "python.statement": {
            const statementType = readString(payload, "statementType", "Statement");
            const lineNumber = Math.max(0, readNumber(payload, "lineNumber", 0));
            const delayValue = Math.max(0, readNumber(payload, "delayMs", 0));
            const statementMechanics = resolveStatementMechanics(statementType);
            const delaySuffix = delayValue > 0 ? ` | delay ${delayValue}ms` : "";
            const energySuffix = statementMechanics.energyCost > 0 ? ` | energy ${statementMechanics.energyCost}` : "";
            appendRuntimeLog(`[TRACE] ${statementType} @ line ${lineNumber}${delaySuffix}${energySuffix}`);

            const hasSpentEnergy = trySpendPlayerEnergy(statementMechanics.energyCost);
            if (!hasSpentEnergy) {
                appendRuntimeLog(`Insufficient energy for ${statementType} (required ${statementMechanics.energyCost}).`);
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

        case "player.equip":
        case "player.unequip":
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