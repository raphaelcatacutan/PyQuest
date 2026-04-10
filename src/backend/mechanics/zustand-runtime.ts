import {
    useBossStore,
    useEnemyStore,
    useGameStore,
    useInventoryStore,
    usePlayerStore,
    useSceneStore
} from "../../game/store";
import {
    clearPythonRuntimeHooks,
    setPythonRuntimeHooks,
    type PythonModuleCallEvent
} from "./parser";

export type PythonModuleCallback = (event: PythonModuleCallEvent) => void;

function resolvePath(snapshot: Record<string, unknown>, path: string): unknown {
    if (!path) {
        return undefined;
    }

    const segments = path.split(".").filter((segment) => segment.length > 0);
    let current: unknown = snapshot;

    for (const segment of segments) {
        if (current && typeof current === "object" && segment in (current as Record<string, unknown>)) {
            current = (current as Record<string, unknown>)[segment];
            continue;
        }

        return undefined;
    }

    return current;
}

function buildSnapshot(): Record<string, unknown> {
    return {
        player: usePlayerStore.getState(),
        game: useGameStore.getState(),
        scene: useSceneStore.getState(),
        enemy: useEnemyStore.getState(),
        boss: useBossStore.getState(),
        inventory: useInventoryStore.getState()
    };
}

export function bindPythonRuntimeToZustand(onFunctionCall?: PythonModuleCallback): void {
    setPythonRuntimeHooks({
        onFunctionCall,
        getStateValue: (path, fallback) => {
            const snapshot = buildSnapshot();
            const resolved = resolvePath(snapshot, path);

            return resolved === undefined ? fallback : resolved;
        }
    });
}

export function unbindPythonRuntimeFromZustand(): void {
    clearPythonRuntimeHooks();
}
