import { create } from "zustand"
import { Enemy } from "../types/enemy.types";
import { useSoundStore } from "./soundStore";
import { getRandomMPByScene } from "../data/mps";
import { MachineProblem } from "../types/mp.types";
import { useSceneStore } from "./sceneStore";

/**
 * Enemy Store - Tracks current enemy state during combat
 */

interface EnemyStoreProps {
  enemy: Enemy | null;
  activeProblem: MachineProblem;

  spawnEnemy: (enemy: Enemy) => void;
  takeDamage: (amount: number) => void;
  gainHp: (amount: number) => void;
  takeEnergyCost: (amount: number) => void;
  gainEnergy: (amount: number) => void;
  clearEnemy: () => void;
}

export const useEnemyStore = create<EnemyStoreProps>((set) => ({
  enemy: null,
  activeProblem: getRandomMPByScene(useSceneStore.getState().scene),
  
  spawnEnemy: (enemy: Enemy) => set({
    enemy,
    activeProblem: getRandomMPByScene(useSceneStore.getState().scene),
  }),
  
  takeDamage: (amount: number) => set((state) => {
    useSoundStore.getState().playSfx('hit')
    if (!state.enemy) return {};
    return {
      enemy: {
        ...state.enemy,
        hp: Math.max(0, state.enemy.hp - amount),
      },
    };
  }),

  gainHp: (amount: number) => set((state) => {
    if (!state.enemy) return {};
    return {
      enemy: {
        ...state.enemy,
        hp: Math.min(state.enemy.maxHp, state.enemy.hp + amount),
      },
    };
  }),
  
  takeEnergyCost: (amount: number) => set((state) => {
    if (!state.enemy) return {};
    return {
      enemy: {
        ...state.enemy,
        energy: Math.max(0, state.enemy.energy - amount),
      },
    };
  }),

  gainEnergy: (amount: number) => set((state) => {
    if (!state.enemy) return {};
    return {
      enemy: {
        ...state.enemy,
        energy: Math.min(state.enemy.maxEnergy, state.enemy.energy + amount),
      },
    };
  }),

  clearEnemy: () => set({ enemy: null, activeProblem: getRandomMPByScene(useSceneStore.getState().scene) }),
}));
