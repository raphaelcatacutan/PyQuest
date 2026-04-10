import { create } from "zustand";
import { Consumable } from "../types/consumable.types";

/**
 * Consumable Store
 * Manages current consumable state and consumed consumables tracking
 */

interface ConsumableStoreProps {
  // Current consumable being used/viewed
  consumable: Consumable | null;
  
  // Track consumables on cooldown: { consumableId: cooldownRemaining }
  consumablesCooldown: Record<string, number>;
  
  // Methods
  setConsumable: (consumable: Consumable) => void;
  clearConsumable: () => void;
  
  // Cooldown management
  addCooldown: (consumableId: string, cooldownTime: number) => void;
  reduceCooldown: (consumableId: string) => void;
  
  // Check if consumable is on cooldown
  isOnCooldown: (consumableId: string) => boolean;
}

export const useConsumableStore = create<ConsumableStoreProps>((set, get) => ({
  consumable: null,
  consumablesCooldown: {},

  setConsumable: (consumable: Consumable) =>
    set({ consumable }),

  clearConsumable: () =>
    set({ consumable: null }),

  addCooldown: (consumableId: string, cooldownTime: number) =>
    set((state) => ({
      consumablesCooldown: {
        ...state.consumablesCooldown,
        [consumableId]: cooldownTime,
      },
    })),

  reduceCooldown: (consumableId: string) =>
    set((state) => ({
      consumablesCooldown: {
        ...state.consumablesCooldown,
        [consumableId]: Math.max(0, (state.consumablesCooldown[consumableId] || 0) - 1),
      },
    })),

  isOnCooldown: (consumableId: string) => {
    const cooldownTime = get().consumablesCooldown[consumableId];
    return cooldownTime ? cooldownTime > 0 : false;
  },
}))