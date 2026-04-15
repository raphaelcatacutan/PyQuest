import { create } from "zustand";
import { Boss } from "../types/boss.types";
import { MachineProblem } from "../types/mp.types";
import { getRandomMPByScene } from "../data/mps";
import { useSceneStore } from "./sceneStore";
import { useSoundStore } from "./soundStore";

/**
 * 
 *  Boss State
 */

interface BossStoreProps extends Boss {
  activeProblem: MachineProblem; 
  spawnBoss: (boss: Boss) => void;
  takeDamage: (amount: number) => void;
  gainHp: (amount: number) => void;
  gainEnergy: (amount: number) => void;
  takeEnergyCost: (amount: number) => void;
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
  energyRegenPerSecond: 0,
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

  activeProblem: getRandomMPByScene(useSceneStore.getState().scene),

  spawnBoss: (boss) => set({
    ...boss,
    activeProblem: getRandomMPByScene(useSceneStore.getState().scene),
  }),  
  
  takeDamage: (amount) => {
    useSoundStore.getState().playSfx('hit')
    set((state) => ({ hp: Math.max(0, state.hp - amount) }))
  },

  gainHp: (amount) => set((state) => ({
    hp: Math.min(state.maxHp, state.hp + amount)
  })),
  
  gainEnergy: (amount) => set((state) => ({
    energy: Math.min(state.maxEnergy, state.energy + amount)
  })),

  takeEnergyCost: (amount) => set((state) => ({
    energy: Math.max(0, state.energy - amount)
  })),

  clearBoss: () => set({
    id: "",
    name: "...",
    description: "",
    bossImg: "",

    hp: 0,
    maxHp: 0,
    energy: 0,
    energyRegenPerSecond: 0,
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
    activeProblem: getRandomMPByScene(useSceneStore.getState().scene),
  })
})) 
