import { create } from 'zustand'
import { useInventoryStore } from './inventoryStore';

/**
 * 
 *  Player State
 */

// TODO: Plan how to store Inventory Tree attr

interface PlayerStoreProps {
  user_id: string;
  username: string;
  password: string;
  hp: number;
  maxHP: number;
  def: number;
  maxDef: number;
  energy: number;
  maxEnergy: number;
  level: number;
  XP: number;
  maxXP: number;
  isDamaged: boolean;
  leftHand: string;
  rightHand: string;
  baseDmg: number;
  baseCritChance: number;
  atkSpeed: number;
  setUserId: (user_id: string) => void;
  setUsername: (username: string) => void;
  setPassword: (pass: string) => void;
  setDamage: (amount: number) => void;
  resetDamage: () => void;
  takeDamage: (amount: number) => void;
  setAtkSpeed: (amount: number) => void;
  gainHealth: (amount: number) => void;
  gainXP: (amount: number) => void;
  gainEnergy: (amount: number) => void;
  loseEnergy: (amount: number) => void;
  toggleIsDamaged: () => void;
  equipLeftHandWith: (weapon: string, weaponDmg: number) => void;
  equipRightHandWith: (weapon: string, weaponDmg: number) => void;
  unequipLeftHand: () => void;
  unequipRightHand: () => void;
  logOut: () => void;
}

export const usePlayerStore = create<PlayerStoreProps>((set) => ({
  user_id: "",
  username: "",
  password: "",
  hp: 0,
  maxHP: 100,
  def: 0,
  maxDef: 0,
  energy: 0,
  maxEnergy: 100,
  level: 0,
  XP: 0,
  maxXP: 0,
  isDamaged: false,
  leftHand: "",
  rightHand: "",
  baseDmg: 2,
  baseCritChance: 3, 
  atkSpeed: 3000,
  setUserId: (user_id) => set(({ user_id: user_id })),
  setUsername: (username) => set(({ username: username })),
  setPassword: (pass) => set(({ password: pass })),
  setDamage: (amount) => set((state) => ({ baseDmg: amount })),
  resetDamage: () => set({ baseDmg: 2 }),
  takeDamage: (amount) => set((state) => ({ hp: Math.max(0, state.hp - amount) })),
  setAtkSpeed: (amount) => set((state) => ({ atkSpeed: amount })), // TODO: Configure
  gainHealth: (amount) => set((state) => ({ hp: state.hp + amount })),
  gainXP: (amount) => set((state) => ({ XP: state.XP + amount })),
  gainEnergy: (amount) => set((state) => ({ energy: state.energy + amount})),
  loseEnergy: (amount) => set((state) => ({ energy: state.energy - amount })),
  toggleIsDamaged: () => set((state) => ({ isDamaged: !state.isDamaged })),
  equipLeftHandWith: (weapon, weaponDmg) => set({ 
    leftHand: weapon,
    baseDmg: weaponDmg
  }),
  equipRightHandWith: (weapon, weaponDmg) => set({ 
    rightHand: weapon,
    baseDmg: weaponDmg 
  }),
  unequipLeftHand: () => set({ leftHand: "", baseDmg: 2 }),
  unequipRightHand: () => set({ rightHand: "", baseDmg: 2 }),
  logOut: () => {
    useInventoryStore.setState({ player_id: "" })
    set({ 
      user_id: "",
      username: "",
      password: "",
      hp: 0,
      energy: 0,
      XP: 0,
      leftHand: "",
      rightHand: "",
      isDamaged: false
    })
  }
}))