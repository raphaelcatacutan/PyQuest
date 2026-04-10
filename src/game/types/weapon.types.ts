import { itemClass, itemRarity } from "./item.types";

type WieldType = 'one' | 'dual' | '';
type WeaponType = 'sword' | 'wand' | 'bow' | 'dagger' | 'shield';

// 1. Reuse the Modifier pattern for Stat Bonuses/Penalties
type WeaponStat = 'dmg' | 'atkSpeed' | 'critDmg' | 'critChance' | 'energyMax';
type ModifierNature = 'bonus' | 'penalty';

interface WeaponModifier {
  stat: WeaponStat;
  nature: ModifierNature;
  value: number;
}

// 2. Define Weapon Skills (Active abilities)
interface WeaponSkill {
  name: string;
  description: string;
  energyCost: number;
  // Reusing the SkillEffect logic we discussed for Enemies
  effect: {
    type: 'damage' | 'stun' | 'heal' | 'bleed';
    value: number;
    duration?: number;
  };
}

// 3. Define Inflictions (Passive chances on hit)
interface Infliction {
  type: 'poison' | 'bleed' | 'stun' | 'burn';
  chance: number; // e.g., 0.1 for 10%
  duration: number;
}

export interface Weapon {
  id: string;
  filename: string;
  name: string;
  description: string;
  weaponImg: string;
  wieldType: WieldType;
  weaponType: WeaponType;
  class: itemClass;
  rarity: itemRarity;
  
  // Base Stats
  baseDmg: number;
  baseCritDmg: number;
  baseCritChance: number;
  durability: number;
  energyCostPerSwing: number;

  // ⚡️ New Dynamic Systems
  modifiers: WeaponModifier[]; // Passive stat changes while equipped
  skills: WeaponSkill[];       // Active skills the player can use
  inflictions: Infliction[];   // Passive status effects triggered on hit

  dropRate: number;
  sellCost: number;
  buyCost: number;
}