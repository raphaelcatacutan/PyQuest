import { itemClass, itemRarity } from "./item.types";

type WieldType = 'one' | 'dual' | ''
type WeaponType = 'sword' | 'wand' | 'bow' | 'dagger'

export interface Weapon {
  id: string;
  filename: string;     // wooden_armor (+ .py?)
  name: string;         // Wooden Armor
  description: string;
  weaponImg: string;     // 20x20?
  wieldType: WieldType;
  class: itemClass;        
  rarity: itemRarity;
  
  dmg: number;          // [0, 100]
  critDmg: number;      // [0, 1]
  critChance: number;   // [0, 1]
  durability: number;   // [0, 100]

  energyCost: number;   // [0, 100]
  
  dmgBonus: number;
  atkSpeedBonus: number;

  // TODO: Add inflictions

  dropRate: number;     // [0, 100]
}