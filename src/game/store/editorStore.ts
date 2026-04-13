import { create } from "zustand";

/**
 * 
 *  Editor Store
 */

interface EditorStoreProps {
  activeFile: string;
  setActiveFile: (file: string) => void;
}

export const useEditorStore = create<EditorStoreProps>((set) => ({
  activeFile: "hello_world.py",

  setActiveFile: (file) => set({ activeFile: file })
}))