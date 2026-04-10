import { create } from "zustand"
import { Weapon } from "../types/weapon.types"

/**
 * Weapon State
 */

interface WeaponStoreProps {
  weapon: Weapon | null;
  setWeapon: (weapon: Weapon) => void;
  clearWeapon: () => void;
}

export const useWeaponStore = create<WeaponStoreProps>((set) => ({
  weapon: null,
  setWeapon: (weapon: Weapon) => set({ weapon }),
  clearWeapon: () => set({ weapon: null }),
}))