import { Armor } from "../types/armor.types";
import { 

} from '@/src/assets'

/**
 * 
 *  Armor Database
 */

export const Armors: Record<string, Armor> = {
  wooden_armor: {
    id: 'wooden_armor',
    filename: 'wooden_armor',
    name: 'Wooden Armor',
    description: 'Just a wood.',
    armorImg: '', // TODO: To be added
    class: "Warrior",
    rarity: "Common",
    
    def: 1,
    dmgReduction: 0.1,
    evasion: 0,
    durability: 100,

    dmgPenalty: 0,
    energyPenalty: 0,
    atkSpeedPenalty: 0,
    healthPenalty: 0,

    energyBonus: 0,
    atkSpeedBonus: 0,
    healthBonus: 0,
    defBonus: 0,
    
    dropRate: 90,
  }
  // TODO: Add more armors
}