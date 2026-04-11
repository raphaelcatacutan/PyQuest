import { create } from "zustand";
import { NPC } from "../types/npc.types";
import { NPCs } from "../data/npc";

/**
 * 
 *  NPC Store
 */

interface NPCStoreProps {
  npc: NPC | null;
  displayNPC: boolean;
  currentDialogueIndex: number;

  setNPC: (npc: NPC) => void;
  toggleDisplayNPC: (state?: boolean) => void;
  nextDialogue: () => void;
  previousDialogue: () => void;
  setDialogueIndex: (index: number) => void;
  clearNPC: () => void;
}

export const useNPCStore = create<NPCStoreProps>((set, get) => ({
  npc: NPCs[0],
  displayNPC: false,
  currentDialogueIndex: 0,

  setNPC: (npc: NPC) => set({ npc, currentDialogueIndex: 0, displayNPC: true }),

  toggleDisplayNPC: (state) => set((s) => ({ displayNPC: state !== undefined ? state : !s.displayNPC })),

  nextDialogue: () => {
    const { npc, currentDialogueIndex } = get();
    if (!npc) return;

    if (currentDialogueIndex < npc.dialogues.length - 1) {
      set({ currentDialogueIndex: currentDialogueIndex + 1 });
    }
  },

  previousDialogue: () => {
    const { currentDialogueIndex } = get();
    if (currentDialogueIndex > 0) {
      set({ currentDialogueIndex: currentDialogueIndex - 1 });
    }
  },

  setDialogueIndex: (index: number) => {
    const { npc } = get();
    if (npc && index >= 0 && index < npc.dialogues.length) {
      set({ currentDialogueIndex: index });
    }
  },

  clearNPC: () => set({ npc: null, displayNPC: false, currentDialogueIndex: 0 }),
}));