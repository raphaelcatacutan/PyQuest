import { create } from "zustand";

/**
 * 
 *  Editor Store
 */

interface EditorStoreProps {
  activeFile: string;
  activeCode: string;
  setActiveFile: (file: string) => void;
  setActiveCode: (code: string) => void;
}

export const useEditorStore = create<EditorStoreProps>((set) => ({
  activeFile: "hello_world.py",
  activeCode: "",

  setActiveFile: (file) => set({ activeFile: file }),
  setActiveCode: (code) => set({ activeCode: code })
}))