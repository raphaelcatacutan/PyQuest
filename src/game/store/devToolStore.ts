import { create } from "zustand";

/**
 * 
 *  Dev Tool Store
 */

interface DevToolProps {
  devTool: boolean;
  toggleDevTool: () => void;
}

export const useDevToolStore = create<DevToolProps>((set) => ({
  devTool: true,
  toggleDevTool: () => set((state) => ({devTool: !state.devTool}))
}))