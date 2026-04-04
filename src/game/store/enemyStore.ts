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

interface Skill {
  name: string;
  dmg: number;
}

interface EnemyStoreProps {
  enemy_id: string;
  enemyImg: string;
  enemy_name: string;
  enemy_hp: number;
  enemy_maxHp: number;
  enemy_energy: number;
  enemy_maxEnergy: number;
  enemy_skills: Skill[];
  setEnemyImg: (source: string) => void;
  setEnemyId: (enemy_id: string) => void;
  setEnemyName: (enemy_name: string) => void;
  takeDamage: (amount: number) => void;
  clearEnemy: () => void;
}

export const useEnemyStore = create<EnemyStoreProps>((set) => ({
  enemy_id: "",
  enemyImg: "",
  enemy_name: "Slime",
  enemy_hp: 100,
  enemy_maxHp: 100,
  enemy_energy: 100,
  enemy_maxEnergy: 100,
  enemy_skills: [],
  setEnemyImg: (source) => set({ enemyImg: source }),
  setEnemyId: (enemy_id) => set({ enemy_id: enemy_id }),
  setEnemyName: (enemy_name) => set({ enemy_name: enemy_name }),
  takeDamage: (amount) => set((state) => ({ enemy_hp: state.enemy_hp - amount })),
  clearEnemy: () => set({ enemy_id: null }),
}))