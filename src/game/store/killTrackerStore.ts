import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface KillTrackerStore {
  // A map of enemy IDs to their kill count: { "slime": 12, "skeleton": 5 }
  player_id: string;
  killCounts: Record<string, number>;
  
  // Actions
  recordKill: (enemyId: string) => void;
  getKills: (enemyId: string) => number;
  resetTracker: () => void;
}

export const useKillTrackerStore = create<KillTrackerStore>()(
  persist(
    (set, get) => ({
      player_id: "",
      killCounts: {},

      recordKill: (enemyId) => set((state) => ({
        killCounts: {
          ...state.killCounts,
          [enemyId]: (state.killCounts[enemyId] || 0) + 1
        }
      })),

      getKills: (enemyId) => {
        return get().killCounts[enemyId] || 0;
      },

      resetTracker: () => set({ killCounts: {} }),
    }),
    {
      name: "player-kills-default", 
      storage: createJSONStorage(() => localStorage),
      skipHydration: true
    }
  )
);

// Loader for multi-account support
export const loadKillProfile = async (playerId: string) => {
  if (!playerId) return;

  const storageKey = `${playerId}-kills`

  const existingData = localStorage.getItem(storageKey);
  const isNewPlayer = !existingData;

  useKillTrackerStore.persist.setOptions({
    name: `${playerId}-kills`,
  });

  if (isNewPlayer) {
    useKillTrackerStore.setState({ killCounts: {} });
  }

  await useKillTrackerStore.persist.rehydrate();
  
  useKillTrackerStore.setState({ player_id: playerId });
  
  console.log(`Successfully loaded Tracker for: ${playerId}`)
};