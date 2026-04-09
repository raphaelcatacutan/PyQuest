import { create } from "zustand";

/**
 * 
 *  Game State
 */

interface GameStateProps {
  inVillage: boolean;
  isMerchant: boolean;          // Loot Inventory | Merchant Inventory
  isEnemy: boolean;             // Enemy or Boss
  inCombat: boolean;
  rightPanel: boolean;          // Right Panel Visibility
  toggleInVillage: () => void;
  toggleIsMerchant: () => void;
  toggleIsEnemy: (state: boolean | null) => void;
  toggleInCombat: (state: boolean | null) => void;
  toggleRightPanel: () => void;
}

export const useGameStore = create<GameStateProps>((set) => ({
  inVillage: true,
  isMerchant: false,
  // isThereEnemy: true,
  isEnemy: true,
  inCombat: false,
  rightPanel: false,
  toggleInVillage: () => set((state) => ({ inVillage: !state.inVillage })),
  toggleIsMerchant: () => set((state) => ({ isMerchant: !state.isMerchant })),
  toggleIsEnemy: (state) => { 
    if (state != null){
      return set({ isEnemy: state }) 
    } else {
      return set((s) => ({ isEnemy: !s.isEnemy })) 
    } 
  },
  toggleInCombat: (state) => { 
    if (state != null){
      return set({ inCombat: state }) 
    } else {
      return set((s) => ({ inCombat: !s.inCombat })) 
    } 
  },
  toggleRightPanel: () => set((state) => ({ rightPanel: !state.rightPanel })),
}))