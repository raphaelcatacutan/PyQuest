import { create } from "zustand"
import { Enemy, Boss } from "./enemy.types";

/**
 * 
 *  Enemy State
 */

// Update your Store Props to use it
interface EnemyStoreProps extends Enemy{
  spawnEnemy: (enemy: Enemy) => void; // Accepts ANY enemy
  takeDamage: (amount: number) => void;
  takeEnergyCost: (amount: number) => void;
  clearEnemy: () => void;
}

export const useEnemyStore = create<EnemyStoreProps>((set) => ({
  enemy_id: "",
  enemy_name: "",
  enemyImg: "",
  enemy_hp: 0,
  enemy_maxHp: 0,
  enemy_energy: 0,
  enemy_maxEnergy: 0,
  enemy_skills: [],

  spawnEnemy: (enemy) => set({ ...enemy }),
  takeDamage: (amount) => set((state) => ({ 
    enemy_hp: Math.max(0, state.enemy_hp - amount) 
  })),
  takeEnergyCost: (amount) => set((state) => ({ 
    enemy_energy: Math.max(0, state.enemy_energy - amount) 
  })),
  clearEnemy: () => set({ enemy_id: "" }), // TODO: Improve clearEnemy. When clearing out all attr, no enemy is being registered
}))