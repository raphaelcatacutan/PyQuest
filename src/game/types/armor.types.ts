import { itemClass, itemRarity } from "./item.types";

type SlotType = 'head' | 'body' | ''

// 1. Define the nature of the change
type ModifierNature = 'bonus' | 'penalty';

// 2. Define the stats that can be changed
type ArmorStat = 'def' | 'evasion' | 'dmg' | 'energy' | 'atkSpeed' | 'health' | 'dmgReduction';

// 3. The explicit Modifier interface
interface StatModifier {
  stat: ArmorStat;
  nature: ModifierNature; // ⚡️ Explicit classifier
  value: number;          // Always keep this as a positive number for clarity
}

export interface Armor {
  id: string;
  filename: string;
  name: string;
  description: string;
  armorImg: string;
  class: itemClass;
  rarity: itemRarity;
  slotType: SlotType;
  
  baseDef: number;
  durability: number;

  // List of explicit modifiers
  modifiers: StatModifier[];

  dropRate: number;
  sellCost: number;
  buyCost: number;
}