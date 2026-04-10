import { create } from "zustand";
import { Armor } from "../types/armor.types";

/**
 * Armor Store
 * Manages current armor state and armor viewing
 */

interface ArmorStoreProps {
  armor: Armor | null;
  
  setArmor: (armor: Armor) => void;
  clearArmor: () => void;
}

export const useArmorStore = create<ArmorStoreProps>((set) => ({
  armor: null,

  setArmor: (armor: Armor) =>
    set({ armor }),

  clearArmor: () =>
    set({ armor: null }),
})) 