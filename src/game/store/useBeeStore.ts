import { create } from 'zustand'

interface BeeStore {
  bees: number;
  increaseBees: () => void;
  removeAllBees: () => void;
}

export const useBeeStore = create<BeeStore>((set) => ({
  bees: 0,
  increaseBees: () => set((state) => ({ bees: state.bees + 1 })),
  removeAllBees: () => set({ bees: 0 }),
}))