import { create } from "zustand";
import {
  DEFAULT_MAIN_FILE_CODE,
  DEFAULT_MAIN_FILE_ID,
  DEFAULT_MAIN_FILE_NAME,
  DEFAULT_MAIN_FILE_PATH,
} from "@/src/game/constants/editor";

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
  activeFileId: DEFAULT_MAIN_FILE_ID,
  activeFile: DEFAULT_MAIN_FILE_NAME,
  activeFilePath: DEFAULT_MAIN_FILE_PATH,
  activeCode: DEFAULT_MAIN_FILE_CODE,
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
      activeFileId: DEFAULT_MAIN_FILE_ID,
      activeFile: DEFAULT_MAIN_FILE_NAME,
      activeFilePath: DEFAULT_MAIN_FILE_PATH,
      activeCode: DEFAULT_MAIN_FILE_CODE,
      isActiveFileReadOnly: false,
      highlightRange: null,
    }),

  setActiveFile: (file) => set({ activeFile: file, activeFilePath: file }),
  setActiveCode: (code) => set({ activeCode: code }),
  setHighlightRange: (range) => set({ highlightRange: range }),
}))