import { create } from "zustand";
import { useSoundStore } from "./soundStore";

const COMBO_DECAY_THRESHOLD_MS = 5000; // 5 seconds of inactivity before reset

interface ComboStore {
  count: number;
  multiplier: number;
  lastSuccessTimestamp: number;
  // Actions
  increaseCombo: () => void;
  resetCombo: () => void;
  checkAndApplyDecay: () => void;
}

export const useComboStore = create<ComboStore>((set, get) => ({
  count: 0,
  multiplier: 1.0, // Start at 1x, not 0x!
  lastSuccessTimestamp: 0,

  increaseCombo: () => set((state) => {
    const newCount = state.count + 1;
    // Example: Increase multiplier by 0.1 for every 5 hits
    const newMultiplier = 1 + Math.floor(newCount / 5) * 0.1;
    
    if (state.count >= 9) { useSoundStore.getState().playSfx('combo4') } 
    else if (state.count >= 5) { useSoundStore.getState().playSfx('combo3') } 
    else if (state.count >= 2) { useSoundStore.getState().playSfx('combo2') } 
    else if (state.count >= 1) { useSoundStore.getState().playSfx('combo1') }

    return {
      count: newCount,
      multiplier: Number(newMultiplier.toFixed(1)),
      lastSuccessTimestamp: Date.now(),
    };
  }),

  resetCombo: () => set({ 
    count: 0, 
    multiplier: 1.0,
    lastSuccessTimestamp: 0,
  }),

  checkAndApplyDecay: () => {
    const state = get();
    if (state.count === 0) return; // No combo to decay

    const elapsed = Date.now() - state.lastSuccessTimestamp;
    if (elapsed > COMBO_DECAY_THRESHOLD_MS) {
      set({
        count: 0,
        multiplier: 1.0,
        lastSuccessTimestamp: 0,
      });
    }
  },
}));