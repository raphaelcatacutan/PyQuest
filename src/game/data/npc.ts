import { NPC } from "../types/npc.types"; 
import {

} from '@/src/assets'

/**
 * 
 *  NPC Database
 */

export const NPCs: Record<string, NPC> = {
  blacksmith: {
    id: "blacksmith",
    name: "Martin",
    npcImg: "",
    type: "blacksmith",

    dialogues: ["Howdy!", "Welcomeerr!"],
    currDialogue: "",

    quests: [],
    shop: {},
  }
}