import { create } from "zustand";

/**
 * 
 *  Editor Store
 */

interface HighLightRange {
  start: number;
  end: number;
}

interface EditorStoreProps {
  activeFile: string;
  activeCode: string;

  highlightRange: HighLightRange | null;

  setActiveFile: (file: string) => void;
  setActiveCode: (code: string) => void;
  setHighlightRange: (range: HighLightRange | null) => void;
}

export const useEditorStore = create<EditorStoreProps>((set) => ({
  activeFile: "hello_world.py",
  activeCode: "",

  highlightRange: null,
  
  setActiveFile: (file) => set({ activeFile: file }),
  setActiveCode: (code) => set({ activeCode: code }),
  setHighlightRange: (range) => set({ highlightRange: range }),
}))