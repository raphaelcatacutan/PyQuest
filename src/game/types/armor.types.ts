import { itemClass, itemRarity } from "./item.types";

type SlotType = 'head' | 'body' | ''

export interface Armor {
  id: string;
  filename: string;         // wooden_armor (+ .py?)
  name: string;             // Wooden Armor
  description: string;
  armorImg: string;         // 20x20?
  class: itemClass;        
  rarity: itemRarity;
  slotType: SlotType;
  
  def: number;              // [0, 100]
  dmgReduction: number;     // [0, 1]
  evasion: number;          // [0, 1]
  durability: number;       // [0, 100]

  dmgPenalty: number;       // [0, 1]
  energyPenalty: number;    // [0, 1]
  atkSpeedPenalty: number;  // [0, 1]
  healthPenalty: number;    // [0, 1]

  energyBonus: number;      // [0, 1]
  atkSpeedBonus: number;    // [0, 1]
  healthBonus: number;      // [0, 1]
  defBonus: number;         // [0, 1]
  
  dropRate: number;         // [0, 100]
  sellCost: number;
  buyCost: number;
}