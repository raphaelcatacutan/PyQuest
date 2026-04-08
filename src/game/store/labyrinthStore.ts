import { create } from "zustand";

/**
 * 
 *  Labyrinth State
 */

interface LabyrinthStateProps {
  currEasyDebug: string;
  currMediumDebug: string;
  currHardDebug: string;
  solvedEasyDebug: number;
  solvedMediumDebug: number;
  solvedHardDebug: number;
  setCurrEasyDebug: (debug: string) => void;
  setCurrMediumDebug: (debug: string) => void;
  setCurrHardDebug: (debug: string) => void;
  addsolvedEasyDebug: () => void;
  addsolvedMediumDebug: () => void;
  addsolvedHardDebug: () => void;
}

export const useLabyrinthStore = create<LabyrinthStateProps>((set) => ({
  currEasyDebug: "",
  currMediumDebug: "",
  currHardDebug: "",
  solvedEasyDebug: 0,
  solvedMediumDebug: 0,
  solvedHardDebug: 0,
  setCurrEasyDebug: (debug) => set({ currEasyDebug: debug }),
  setCurrMediumDebug: (debug) => set({ currMediumDebug: debug }),
  setCurrHardDebug: (debug) => set({ currHardDebug: debug }),
  addsolvedEasyDebug: () => set((s) => ({ solvedEasyDebug: s.solvedEasyDebug + 1 })),
  addsolvedMediumDebug: () => set((s) => ({ solvedMediumDebug: s.solvedMediumDebug + 1 })),
  addsolvedHardDebug: () => set((s) => ({ solvedHardDebug: s.solvedHardDebug + 1 })),
}))