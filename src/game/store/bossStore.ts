import { create } from "zustand";
import { Boss } from "../types/boss.types";

/**
 * 
 *  Boss State
 */

interface BossStoreProps extends Boss {
  spawnBoss: (boss: Boss) => void;
  takeDamage: (amount: number) => void;
  gainHp: (amount: number) => void;
  gainEnergy: (amount: number) => void;
  clearBoss: () => void;
}

export const useBossStore = create<BossStoreProps>((set) => ({
  id: "",
  name: "...",
  description: "",
  bossImg: "",

  hp: 0,
  maxHp: 0,
  energy: 0,
  def: 0,
  maxDef: 0,
  maxEnergy: 0,
  skills: [],
  dmg: 0,
  atkSpeed: 0,
  critDmg: 0,
  critChance: 0,
  evasion: 0,

  location: {},
  lootDrop: {
    xpDropMin: 0,
    xpDropMax: 0,
    coinDropMin: 0,
    coinDropMax: 0,
    weapons: [],
    armors: [],
    consumables: [],
  },

  spawnBoss: (boss) => set({ ...boss }),  
  
  takeDamage: (amount) => set((state) => ({
    hp: Math.max(0, state.hp - amount)
  })),

  gainHp: (amount) => set((state) => ({
    hp: Math.min(state.maxHp, state.hp + amount)
  })),
  
  gainEnergy: (amount) => set((state) => ({
    energy: Math.min(state.maxEnergy, state.energy + amount)
  })),

  clearBoss: () => set({
    id: "",
    name: "...",
    description: "",
    bossImg: "",

    hp: 0,
    maxHp: 0,
    energy: 0,
    def: 0,
    maxDef: 0,
    maxEnergy: 0,
    skills: [],
    dmg: 0,
    atkSpeed: 0,
    critDmg: 0,
    critChance: 0,
    evasion: 0,

    location: {},
    lootDrop: {
      xpDropMin: 0,
      xpDropMax: 0,
      coinDropMin: 0,
      coinDropMax: 0,
      weapons: [],
      armors: [],
      consumables: [],
    },
  })
})) 