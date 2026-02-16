import type { StateCreator } from "zustand";

export type PlayerSlice = {
  hp: number;
  energy: number;
  xp: number;
  level: number;
  takeDamage: (amount: number) => void;
};

export const createPlayerSlice: StateCreator<
  PlayerSlice,
  [],
  [],
  PlayerSlice
> = (set) => ({
  hp: 100,
  energy: 100,
  xp: 0,
  level: 1,

  takeDamage: (amount) =>
    set((state) => ({ hp: state.hp - amount })),
});