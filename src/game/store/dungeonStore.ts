import { create } from "zustand"
import { Dungeon, DungeonDifficultyTypes } from "../types/dungeon.types"

/**
 * 
 *  Dungeon State
 */

interface DungeonStoreProps extends Dungeon {
  setPlayerId: (id: string) => void;

  toggleInDungeon: () => void;
  setMode: (mode: DungeonDifficultyTypes) => void;
  setMachineProblem: (problem: string) => void;

  addSolvedEasy: () => void;
  setMaxEasy: (max: string) => void;
  
  addSolvedMedium: () => void;
  setMaxMedium: (max: string) => void;

  addSolvedHard: () => void;
  setMaxHard: (max: string) => void;
  
  incrementAttempt: () => void;
  resetDungeon: () => void;
}

// Helper to save dungeon data to localStorage
const saveDungeonToLocalStorage = (playerId: string, dungeonData: Omit<Dungeon, 'playerId'>) => {
  if (playerId) {
    localStorage.setItem(
      `player-dungeon-${playerId}`,
      JSON.stringify(dungeonData)
    );
  }
};

export const useDungeonStore = create<DungeonStoreProps>((set) => ({
  playerId: "",
  inDungeon: false,
  mode: "easy",
  machineProblem: "",
  currEasy: 0,
  maxEasy: 5,
  currMedium: 0,
  maxMedium: 5,
  currHard: 0,
  maxHard: 5,
  currAttempt: 0,
  maxAttempts: 3,

  setPlayerId: (id) => set((state) => {
    // Save current player's dungeon data before switching
    if (state.playerId && state.playerId !== id) {
      saveDungeonToLocalStorage(state.playerId, {
        inDungeon: state.inDungeon,
        mode: state.mode,
        machineProblem: state.machineProblem,
        currEasy: state.currEasy,
        maxEasy: state.maxEasy,
        currMedium: state.currMedium,
        maxMedium: state.maxMedium,
        currHard: state.currHard,
        maxHard: state.maxHard,
        currAttempt: state.currAttempt,
        maxAttempts: state.maxAttempts,
      });
    }

    // Load new player's dungeon data
    const savedData = localStorage.getItem(`player-dungeon-${id}`);
    const newDungeonData = savedData
      ? JSON.parse(savedData)
      : {
          inDungeon: false,
          mode: "easy",
          machineProblem: "",
          currEasy: 0,
          maxEasy: 5,
          currMedium: 0,
          maxMedium: 5,
          currHard: 0,
          maxHard: 5,
          currAttempt: 0,
          maxAttempts: 3,
        };

    return {
      playerId: id,
      ...newDungeonData
    };
  }),

  toggleInDungeon: () => set((state) => {
    const newData = { inDungeon: !state.inDungeon };
    saveDungeonToLocalStorage(state.playerId, {
      inDungeon: newData.inDungeon,
      mode: state.mode,
      machineProblem: state.machineProblem,
      currEasy: state.currEasy,
      maxEasy: state.maxEasy,
      currMedium: state.currMedium,
      maxMedium: state.maxMedium,
      currHard: state.currHard,
      maxHard: state.maxHard,
      currAttempt: state.currAttempt,
      maxAttempts: state.maxAttempts,
    });
    return newData;
  }),

  setMode: (mode) => set((state) => {
    saveDungeonToLocalStorage(state.playerId, {
      inDungeon: state.inDungeon,
      mode: mode,
      machineProblem: state.machineProblem,
      currEasy: state.currEasy,
      maxEasy: state.maxEasy,
      currMedium: state.currMedium,
      maxMedium: state.maxMedium,
      currHard: state.currHard,
      maxHard: state.maxHard,
      currAttempt: state.currAttempt,
      maxAttempts: state.maxAttempts,
    });
    return { mode };
  }),

  setMachineProblem: (problem) => set((state) => {
    saveDungeonToLocalStorage(state.playerId, {
      inDungeon: state.inDungeon,
      mode: state.mode,
      machineProblem: problem,
      currEasy: state.currEasy,
      maxEasy: state.maxEasy,
      currMedium: state.currMedium,
      maxMedium: state.maxMedium,
      currHard: state.currHard,
      maxHard: state.maxHard,
      currAttempt: state.currAttempt,
      maxAttempts: state.maxAttempts,
    });
    return { machineProblem: problem };
  }),

  addSolvedEasy: () => set((state) => {
    const newEasy = Math.min(state.currEasy + 1, state.maxEasy);
    saveDungeonToLocalStorage(state.playerId, {
      inDungeon: state.inDungeon,
      mode: state.mode,
      machineProblem: state.machineProblem,
      currEasy: newEasy,
      maxEasy: state.maxEasy,
      currMedium: state.currMedium,
      maxMedium: state.maxMedium,
      currHard: state.currHard,
      maxHard: state.maxHard,
      currAttempt: state.currAttempt,
      maxAttempts: state.maxAttempts,
    });
    return { currEasy: newEasy };
  }),

  setMaxEasy: (max) => set((state) => {
    const newMax = parseInt(max);
    saveDungeonToLocalStorage(state.playerId, {
      inDungeon: state.inDungeon,
      mode: state.mode,
      machineProblem: state.machineProblem,
      currEasy: state.currEasy,
      maxEasy: newMax,
      currMedium: state.currMedium,
      maxMedium: state.maxMedium,
      currHard: state.currHard,
      maxHard: state.maxHard,
      currAttempt: state.currAttempt,
      maxAttempts: state.maxAttempts,
    });
    return { maxEasy: newMax };
  }),

  addSolvedMedium: () => set((state) => {
    const newMedium = Math.min(state.currMedium + 1, state.maxMedium);
    saveDungeonToLocalStorage(state.playerId, {
      inDungeon: state.inDungeon,
      mode: state.mode,
      machineProblem: state.machineProblem,
      currEasy: state.currEasy,
      maxEasy: state.maxEasy,
      currMedium: newMedium,
      maxMedium: state.maxMedium,
      currHard: state.currHard,
      maxHard: state.maxHard,
      currAttempt: state.currAttempt,
      maxAttempts: state.maxAttempts,
    });
    return { currMedium: newMedium };
  }),

  setMaxMedium: (max) => set((state) => {
    const newMax = parseInt(max);
    saveDungeonToLocalStorage(state.playerId, {
      inDungeon: state.inDungeon,
      mode: state.mode,
      machineProblem: state.machineProblem,
      currEasy: state.currEasy,
      maxEasy: state.maxEasy,
      currMedium: state.currMedium,
      maxMedium: newMax,
      currHard: state.currHard,
      maxHard: state.maxHard,
      currAttempt: state.currAttempt,
      maxAttempts: state.maxAttempts,
    });
    return { maxMedium: newMax };
  }),

  addSolvedHard: () => set((state) => {
    const newHard = Math.min(state.currHard + 1, state.maxHard);
    saveDungeonToLocalStorage(state.playerId, {
      inDungeon: state.inDungeon,
      mode: state.mode,
      machineProblem: state.machineProblem,
      currEasy: state.currEasy,
      maxEasy: state.maxEasy,
      currMedium: state.currMedium,
      maxMedium: state.maxMedium,
      currHard: newHard,
      maxHard: state.maxHard,
      currAttempt: state.currAttempt,
      maxAttempts: state.maxAttempts,
    });
    return { currHard: newHard };
  }),

  setMaxHard: (max) => set((state) => {
    const newMax = parseInt(max);
    saveDungeonToLocalStorage(state.playerId, {
      inDungeon: state.inDungeon,
      mode: state.mode,
      machineProblem: state.machineProblem,
      currEasy: state.currEasy,
      maxEasy: state.maxEasy,
      currMedium: state.currMedium,
      maxMedium: state.maxMedium,
      currHard: state.currHard,
      maxHard: newMax,
      currAttempt: state.currAttempt,
      maxAttempts: state.maxAttempts,
    });
    return { maxHard: newMax };
  }),

  incrementAttempt: () => set((state) => {
    const newAttempt = Math.min(state.currAttempt + 1, state.maxAttempts);
    saveDungeonToLocalStorage(state.playerId, {
      inDungeon: state.inDungeon,
      mode: state.mode,
      machineProblem: state.machineProblem,
      currEasy: state.currEasy,
      maxEasy: state.maxEasy,
      currMedium: state.currMedium,
      maxMedium: state.maxMedium,
      currHard: state.currHard,
      maxHard: state.maxHard,
      currAttempt: newAttempt,
      maxAttempts: state.maxAttempts,
    });
    return { currAttempt: newAttempt };
  }),

  resetDungeon: () => set(() => {
    const resetData = {
      inDungeon: false,
      mode: "easy" as DungeonDifficultyTypes,
      machineProblem: "",
      currEasy: 0,
      currMedium: 0,
      currHard: 0,
      currAttempt: 0,
    };
    return resetData;
  }),
}))