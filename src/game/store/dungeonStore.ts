import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { Dungeon, DungeonDifficultyTypes } from "../types/dungeon.types"

/**
 * 
 *  Dungeon Store
 */

export const loadDungeonProfile = async (playerId: string) => {
  if (!playerId) return;
  useDungeonStore.persist.setOptions({
    name: `player-dungeon-${playerId}`,
  });
  await useDungeonStore.persist.rehydrate();
  useDungeonStore.setState({ playerId });
};

export const resetDungeonPersist = () => {
  useDungeonStore.persist.setOptions({
    name: "player-dungeon-default",
  });
};

interface DungeonStoreProps extends Dungeon {
  setPlayerId: (id: string) => void;

  toggleInDungeon: (state?: boolean | null) => void;
  setMode: (mode: DungeonDifficultyTypes) => void;
  setMachineProblem: (problem: string) => void;

  addSolvedEasy: () => void;
  setMaxEasy: (max: number) => void;
  
  addSolvedMedium: () => void;
  setMaxMedium: (max: number) => void;

  addSolvedHard: () => void;
  setMaxHard: (max: number) => void;
  
  incrementAttempt: () => void;
  resetDungeon: () => void;
}

export const useDungeonStore = create<DungeonStoreProps>()(
  persist(
    (set) => ({
      playerId: "",
      inDungeon: false,
      mode: "",
      machineProblem: "",
      currEasy: 0,
      maxEasy: 5,
      currMedium: 0,
      maxMedium: 5,
      currHard: 0,
      maxHard: 5,
      currAttempt: 0,
      maxAttempts: 3,

      setPlayerId: (id: string) => set({ playerId: id }),

      toggleInDungeon: (state) => set((s) => ({ inDungeon: state ?? !s.inDungeon })),
      setMode: (mode) => set({ mode }),
      setMachineProblem: (problem) => set({ machineProblem: problem }),

      addSolvedEasy: () => set((s) => ({ currEasy: Math.min(s.currEasy + 1, s.maxEasy) })),
      setMaxEasy: (max) => set({ maxEasy: max }),

      addSolvedMedium: () => set((s) => ({ currMedium: Math.min(s.currMedium + 1, s.maxMedium) })),
      setMaxMedium: (max) => set({ maxMedium: max }),

      addSolvedHard: () => set((s) => ({ currHard: Math.min(s.currHard + 1, s.maxHard) })),
      setMaxHard: (max) => set({ maxHard: max }),
      
      incrementAttempt: () => set((s) => ({ currAttempt: Math.min(s.currAttempt + 1, s.maxAttempts) })),
      
      resetDungeon: () => set({ 
        inDungeon: false, 
        mode: "", 
        machineProblem: "", 
        currAttempt: 0 
      }),
    }),
    {
      name: "player-dungeon-default",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);