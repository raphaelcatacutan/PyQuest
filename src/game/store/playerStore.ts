import { create } from 'zustand'

/**
 * 
 *  Player State
 */

// TODO: Plan how to store Inventory Tree attr
interface PlayerStoreProps {
  user_id: string | null;
  username: string;
  password: string;
  hp: number;
  maxHP: string;
  energy: number;
  maxEnergy: number;
  level: number;
  XP: number;
  maxXP: number;
  isDamaged: boolean;
  setUserId: (user_id: string) => void;
  setUsername: (username: string) => void;
  setPassword: (pass: string) => void;
  takeDamage: (amount: number) => void;
  gainHealth: (amount: number) => void;
  gainXP: (amount: number) => void;
  gainEnergy: (amount: number) => void;
  loseEnergy: (amount: number) => void;
  toggleIsDamaged: () => void;
  logOut: () => void;
}

export const usePlayerStore = create<PlayerStoreProps>((set) => ({
  user_id: "",
  username: "",
  password: "",
  hp: 0,
  maxHP: "",
  energy: 0,
  maxEnergy: 0,
  level: 0,
  XP: 0,
  maxXP: 0,
  isDamaged: false,
  setUserId: (user_id) => set(({ user_id: user_id })),
  setUsername: (username) => set(({ username: username })),
  setPassword: (pass) => set(({ password: pass })),
  takeDamage: (amount) => set((state) => ({ hp: state.hp - amount })),
  gainHealth: (amount) => set((state) => ({ hp: state.hp + amount })),
  gainXP: (amount) => set((state) => ({ XP: state.XP + amount })),
  gainEnergy: (amount) => set((state) => ({ energy: state.energy + amount})),
  loseEnergy: (amount) => set((state) => ({ energy: state.energy - amount })),
  toggleIsDamaged: () => set((state) => ({ isDamaged: !state.isDamaged })),
  logOut: () => set({ user_id: null })
}))