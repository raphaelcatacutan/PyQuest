import { Weapon } from "../types/weapon.types";
import {

} from '@/src/assets'

/**
 * 
 *  Weapon Database
 */

export const Weapons: Record<string, Weapon> = {
  wooden_sword: {
    id: "wooden_sword",
    filename: "wooden_sword",
    name: "Wooden Sword",
    description: "Just a wood.",
    weaponImg: "",
    wieldType: "one",
    class: "Warrior",
    rarity: "Common",
    
    dmg: 3,
    critDmg: 0,
    critChance: 0,
    durability: 0,
    
    energyCost: 0,

    dmgBonus: 0,
    atkSpeedBonus: 0,

    dropRate: 0,
  }
}