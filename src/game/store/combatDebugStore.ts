import { create } from "zustand";
import type { EncounterAnalytics } from "@/src/backend/mechanics/combat";

export type CombatDebugSnapshot = {
  isBoss: boolean;
  enemyId: string;
  action: string;
  reward: number;
  dmgToPlayer: number;
  dmgToEnemy: number;
  healEnemy: number;
  energyDelta: number;
  playerHp: number;
  enemyHp: number;
  enemyEnergy: number;
  tickSeconds: number;
  done: boolean;
  playerAttacksConsumed: number;
  damageCauses: string[];
  analytics: EncounterAnalytics;
};

interface CombatDebugStore {
  latest: CombatDebugSnapshot | null;
  logs: string[];
  setLatest: (snapshot: CombatDebugSnapshot) => void;
  appendLog: (message: string) => void;
  clearLogs: () => void;
  reset: () => void;
}

const MAX_LOG_LINES = 40;

export const useCombatDebugStore = create<CombatDebugStore>((set) => ({
  latest: null,
  logs: [],
  setLatest: (snapshot) => set({ latest: snapshot }),
  appendLog: (message) => set((state) => {
    const line = message.trim();
    if (!line) {
      return state;
    }
    const nextLogs = [...state.logs, line];
    if (nextLogs.length > MAX_LOG_LINES) {
      return { logs: nextLogs.slice(nextLogs.length - MAX_LOG_LINES) };
    }
    return { logs: nextLogs };
  }),
  clearLogs: () => set({ logs: [] }),
  reset: () => set({ latest: null, logs: [] }),
}));
