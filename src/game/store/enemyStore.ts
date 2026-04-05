import { create } from "zustand"
import { 
  slimeEnemy, 
  skeletonHeadEnemy 
} from '@/src/assets'

/**
 * 
 *  Enemy State
 */

// TODO: Initialize enemies

export const Enemies: Record<string, Enemy> = {
  slime: {
    enemy_id: "1",
    enemy_name: "Slime",
    enemyImg: slimeEnemy,
    enemy_hp: 100,
    enemy_maxHp: 100,
    enemy_energy: 50,
    enemy_maxEnergy: 50,
    enemy_skills: [{ name: "Bouncing Tackle", dmg: 10 }]
  },
  skeleton: {
    enemy_id: "2",
    enemy_name: "Skeleton Archer",
    enemyImg: skeletonHeadEnemy,
    enemy_hp: 80,
    enemy_maxHp: 80,
    enemy_energy: 100,
    enemy_maxEnergy: 100,
    enemy_skills: [{ name: "Bone Arrow", dmg: 25 }]
  }
}

interface Skill {
  name: string;
  dmg: number;
}

// Define this once
export interface Enemy {
  enemy_id: string;
  enemyImg: string;
  enemy_name: string;
  enemy_hp: number;
  enemy_maxHp: number;
  enemy_energy: number;
  enemy_maxEnergy: number;
  enemy_skills: Skill[];
}

// Update your Store Props to use it
interface EnemyStoreProps extends Enemy {
  spawnEnemy: (enemy: Enemy) => void; // Accepts ANY enemy
  takeDamage: (amount: number) => void;
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
  clearEnemy: () => set({ enemy_id: "" }),
}))