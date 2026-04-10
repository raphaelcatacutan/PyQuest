import { create } from "zustand";
import { DifficultyType, Trials } from "../types/trials.types";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * 
 *  Trials Store
 */

export const loadTrialsProfile = async (playerId: string) => {
  if (!playerId) return;
  useTrialsStore.persist.setOptions({
    name: `player-trials-${playerId}`,
  });
  await useTrialsStore.persist.rehydrate();
  useTrialsStore.setState({ playerId });
};

interface TrialsStoreProps extends Trials {
  setPlayerId: (id: string) => void;

  toggleInTrials: (state?: boolean | null) => void;
  setMode: (mode: DifficultyType) => void;
  setDebugProblem: (problem: string) => void;

  addSolvedEasy: () => void;
  setMaxEasy: (max: number) => void;

  addSolvedMedium: () => void;
  setMaxMedium: (max: number) => void;

  addSolvedHard: () => void;
  setMaxHard: (max: number) => void;

  incrementAttempt: () => void;
  resetTrials: () => void;
}

export const useTrialsStore = create<TrialsStoreProps>()(
  persist(
    (set) => ({
      playerId: "",
      inTrials: false,
      mode: "",
      debugProblem: "",
      currEasy: 0,
      maxEasy: 5,
      currMedium: 0,
      maxMedium: 5,
      currHard: 0,
      maxHard: 3,
      currAttempt: 0,
      maxAttempts: 3,

      setPlayerId: (id: string) => set({ playerId: id }),

      toggleInTrials: (state) => set((s) => ({ inTrials: state ?? !s.inTrials })),
      setMode: (mode) => set({ mode }),
      setDebugProblem: (problem) => set({ debugProblem: problem }),

      addSolvedEasy: () => set((s) => ({ currEasy: Math.min(s.currEasy + 1, s.maxEasy) })),
      setMaxEasy: (max) => set({ maxEasy: max }),

      addSolvedMedium: () => set((s) => ({ currMedium: Math.min(s.currMedium + 1, s.maxMedium) })),
      setMaxMedium: (max) => set({ maxMedium: max }),

      addSolvedHard: () => set((s) => ({ currHard: Math.min(s.currHard + 1, s.maxHard) })),
      setMaxHard: (max) => set({ maxHard: max }),
      
      incrementAttempt: () => set((s) => ({ currAttempt: Math.min(s.currAttempt + 1, s.maxAttempts) })),
      resetTrials: () => set({ inTrials: false, mode: "", debugProblem: "", currAttempt: 0 }),
    }),
    {
      name: "player-trials-default", 
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);