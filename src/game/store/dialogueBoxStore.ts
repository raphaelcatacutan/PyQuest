import { create } from "zustand";

/**
 * 
 *  DialogueBox State
 */

interface DialogueBoxProps {
  displayDialogueBox: boolean;
  header: string;
  body: string;
  toggleDisplayDialogueBox: () => void;
  setHeader: (text: string) => void;
  setBody: (text: string) => void;
}

export const useDialogueBoxStore = create<DialogueBoxProps>((set) => ({
  displayDialogueBox: false,
  header: "Hello, Traveler!",
  body: "Welcome to PyQuest",
  toggleDisplayDialogueBox: () => set((state) => ({ displayDialogueBox: !state.displayDialogueBox })),
  setHeader: (text) => set({ header: text }),
  setBody: (text) => set({ body: text }),
}))