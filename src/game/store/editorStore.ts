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
  activeFileId: string | null;
  activeFile: string;
  activeFilePath: string;
  activeCode: string;
  highlightRange: HighLightRange | null;
  isActiveFileReadOnly: boolean;
  openFile: (file: {
    id: string;
    name: string;
    path: string;
    code: string;
    readOnly?: boolean;
  }) => void;
  clearActiveFile: () => void;
  setActiveFile: (file: string) => void;
  setActiveCode: (code: string) => void;
  setHighlightRange: (range: HighLightRange | null) => void;
}

export const useEditorStore = create<EditorStoreProps>((set) => ({
  activeFileId: null,
  activeFile: "hello_world.py",
  activeFilePath: "hello_world.py",
  activeCode: "# Welcome to PyQuest!\n# Start writing your coding journey in Python here!",
  isActiveFileReadOnly: false,

  highlightRange: null,

  openFile: ({ id, name, path, code, readOnly = false }) =>
    set({
      activeFileId: id,
      activeFile: name,
      activeFilePath: path,
      activeCode: code,
      isActiveFileReadOnly: readOnly,
    }),

  clearActiveFile: () =>
    set({
      activeFileId: null,
      activeFile: "hello_world.py",
      activeFilePath: "hello_world.py",
      activeCode: "# Welcome to PyQuest!\n# Start writing your coding journey in Python here!",
      isActiveFileReadOnly: false,
      highlightRange: null,
    }),

  setActiveFile: (file) => set({ activeFile: file, activeFilePath: file }),
  setActiveCode: (code) => set({ activeCode: code }),
  setHighlightRange: (range) => set({ highlightRange: range }),
}))