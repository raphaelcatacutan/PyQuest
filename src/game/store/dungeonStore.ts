import { create } from "zustand"
import { MPsByDifficulty } from "../data/dungeon";

/**
 * 
 *  Dungeon State
 */

interface DungeonStoreProps {
  currEasyMPs: string;
  currMediumMPs: string;
  currHardMPs: string;
  solvedEasyMPs: number;
  solvedMediumMPs: number;
  solvedHardMPs: number;
  setCurrEasyMPs: (mp: string) => void;
  setCurrMediumMPs: (mp: string) => void;
  setCurrHardMPs: (mp: string) => void;
  addsolvedEasyMPs: () => void;
  addsolvedMediumMPs: () => void;
  addsolvedHardMPs: () => void;
}

export const useDungeonStore = create<DungeonStoreProps>((set) => ({
  currEasyMPs: "",
  currMediumMPs: "",
  currHardMPs: "",
  solvedEasyMPs: 0,
  solvedMediumMPs: 0,
  solvedHardMPs: 0,
  setCurrEasyMPs: (mp) => set({ currEasyMPs: mp}),
  setCurrMediumMPs: (mp) => set({ currMediumMPs: mp}),
  setCurrHardMPs: (mp) => set({ currHardMPs: mp}),
  addsolvedEasyMPs: () => set((s) => ({ solvedEasyMPs: s.solvedEasyMPs + 1 })),
  addsolvedMediumMPs: () => set((s) => ({ solvedMediumMPs: s.solvedMediumMPs + 1 })),
  addsolvedHardMPs: () => set((s) => ({ solvedHardMPs: s.solvedHardMPs + 1 })),
}))