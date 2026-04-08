import { create } from "zustand";
import { NPC } from "../types/npc.types";

/**
 * 
 *  NPC State
 */

interface NPCStoreProps extends NPC {
  currNPC: NPC | null;
  displayNPC: boolean;
  speak: (dialogue: string) => void;
  setCurrNPC: (npc: NPC) => void;
  clearCurrNPC: () => void;
  toggleDisplayNPC: () => void;
}

export const useNPCStore = create<NPCStoreProps>((set) => ({
  id: "",
  name: "",
  npcImg: "",
  type: "villager",

  dialogues: [],
  currDialogue: "",
  
  quests: [],
  shop: {},
  
  currNPC: null,
  displayNPC: false,
  
  speak: (dialogue) => set(({ currDialogue: dialogue })),
  
  setCurrNPC: (npc) => set({ currNPC: npc }),
  
  clearCurrNPC: () => set({
    currNPC: null,
    id: "",
    name: "",
    npcImg: "",
    type: "villager",
    dialogues: [],
    quests: [],
    shop: {},
    displayNPC: false
  }),
  
  toggleDisplayNPC: () => set((state) => ({
    displayNPC: !state.displayNPC
  })),
}))