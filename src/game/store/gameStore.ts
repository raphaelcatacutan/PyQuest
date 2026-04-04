import { create } from "zustand";

/**
 * 
 *  Game State
 */

interface GameStateProps {
  inVillage: boolean;
  isMerchant: boolean;          // Loot Inventory | Merchant Inventory
  isThereEnemy: boolean;        // Enemy Display  
  rightPanel: boolean;          // Right Panel Visibility
  toggleInVillage: () => void;
  toggleIsMerchant: () => void;
  toggleIsThereEnemy: () => void;
  toggleRightPanel: () => void;
}

export const useGameStore = create<GameStateProps>((set) => ({
  inVillage: true,
  isMerchant: false,
  isThereEnemy: true,
  rightPanel: false,
  toggleInVillage: () => set((state) => ({ inVillage: !state.inVillage })),
  toggleIsMerchant: () => set((state) => ({ isMerchant: !state.isMerchant })),
  toggleIsThereEnemy: () => set((state) => ({ isThereEnemy: !state.isThereEnemy })),
  toggleRightPanel: () => set((state) => ({ rightPanel: !state.rightPanel })),
}))