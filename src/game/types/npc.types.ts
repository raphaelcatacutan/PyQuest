import { Armor } from "./armor.types";
import { Consumable } from "./consumable.types";
import { LootDrop } from "./loot.types";
import { Tutorial } from "./tutorial.types";
import { Weapon } from "./weapon.types";

type NPCType = 'trader' | 'blacksmith' | 'innkeeper' | 'villager'

interface Quest {
  request: string
  reward: LootDrop
}

interface ShopInventory {
  armors: Armor[];
  weapons: Weapon[];
  consumables: Consumable[];
}

interface Dialogue {
  dialogue: string;
  choices: string[];
}

export interface NPC {
  id: string;
  name: string
  npcImg: string;
  type: NPCType;

  dialogues: Dialogue[];
  currDialogue: string;
  tutorialDialogues: Tutorial[];

  quests?: Quest[];
  shop: ShopInventory;
}