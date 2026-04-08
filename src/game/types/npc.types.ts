type NPCType = 'trader' | 'blacksmith' | 'innkeeper' | 'villager'

interface Quest {

}

interface ShopInventory {

}

export interface NPC {
  id: string;
  name: string
  npcImg: string;
  type: NPCType;

  dialogues: string[];
  currDialogue: string;

  quests?: Quest[];
  shop: ShopInventory;
}