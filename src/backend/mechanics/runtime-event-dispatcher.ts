import { useBossStore, useDungeonStore, useEnemyStore, useGameStore, usePlayerStore, useSceneStore, useTerminalStore, useTrialsStore } from "../../game/store";
import type { SceneTypes } from "../../game/types/scene.types";
import type { PythonModuleCallEvent } from "./parser";

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

function appendRuntimeLog(message: string): void {
    useTerminalStore.getState().appendToLog(`[PY]: ${message}`);
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

export function dispatchPythonRuntimeEvent(event: PythonModuleCallEvent): void {
    const payload = event.payload;

    switch (event.name) {
        case "builtin.goTo": {
            const locationId = readString(payload, "locationId", "").trim().toLowerCase();

            if (!isSceneType(locationId)) {
                appendRuntimeLog(`Unknown scene '${locationId}'.`);
                return;
            }

            setSceneAndFlags(locationId);
            appendRuntimeLog(`Moved to ${locationId}.`);
            return;
        }

        case "builtin.scavenge": {
            const amount = Math.max(0, readNumber(payload, "coins", 1));
            usePlayerStore.getState().gainCoins(amount);
            appendRuntimeLog(`Scavenge rewarded ${amount} coin(s).`);
            return;
        }

        case "builtin.explore": {
            useGameStore.getState().toggleInCombat(true);
            appendRuntimeLog("Explore started combat.");
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