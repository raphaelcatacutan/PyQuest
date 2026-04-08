import { create } from "zustand"
import { Enemy } from "../types/enemy.types";

/**
 * 
 *  Enemy State
 */

interface EnemyStoreProps extends Enemy{
  spawnEnemy: (enemy: Enemy) => void; // Accepts ANY enemy
  takeDamage: (amount: number) => void;
  takeEnergyCost: (amount: number) => void;
  clearEnemy: () => void;
}

export const useEnemyStore = create<EnemyStoreProps>((set) => ({
  id: "",
  name: "",
  description: "",
  enemyImg: "",
  hp: 0,
  maxHp: 0,
  energy: 0,
  maxEnergy: 0,
  def: 0,
  maxDef: 0,
  skills: [],
  dmg: 0,
  atkSpeed: 0,
  critDmg: 0,
  critChance: 0,
  evasion: 0,
  location: [],
  lootDrop: {
    coinDropMin: 0,
    coinDropMax: 0,
    xpDropMin: 0,
    xpDropMax: 0,
    weapons: [],
    armors: [],
    consumables: [],
  },
  
  spawnEnemy: (enemy) => set({ ...enemy }),
  
  takeDamage: (amount) => set((state) => ({ 
    hp: Math.max(0, state.hp - amount) 
  })),
  
  takeEnergyCost: (amount) => set((state) => ({ 
    energy: Math.max(0, state.energy - amount) 
  })),
  clearEnemy: () => set({ id: "" }), // TODO: Improve clearEnemy. When clearing out all attr, no enemy is being registered
}))