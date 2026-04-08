import { create } from "zustand";

/**
 * 
 *  Terminal State
 */

interface TerminalStoreProps {
  logs: string[];
  maxLogs: number;
  setLogs: (logs: string[]) => void;
  appendToLog: (msg: string) => void;
  clearLogs: () => void;
}

export const useTerminalStore = create<TerminalStoreProps>((set) => ({
  logs: ["[BATTLE_LOG]: You defeated a goblin! 76 exp rewarded.", "Hellows"],
  maxLogs: 100,
  setLogs: (logs) => set({ logs: logs }),
  appendToLog: (msg) => set((state) => {
    const newLogs = state.logs.length >= state.maxLogs
      ? [...state.logs.slice(1), msg]
      : [...state.logs, msg];
    return { logs: newLogs };
  }),
  clearLogs: () => set({ logs: [] })
}))