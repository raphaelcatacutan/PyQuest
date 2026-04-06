import { create } from "zustand";
import { Armor } from "../types/armor.types";

/**
 * 
 *  Armor State
 */

interface ArmorStoreProps extends Armor {
  setArmor: (armor: Armor) => void;
  clearArmor: () => void;
  // TODO: To be added: inflictCurse, etc.
}

export const useArmorStore = create<ArmorStoreProps>((set) => ({
  id: "",
  filename: "",
  name: "",
  description: "",
  armorImg: "",
  class: "",
  rarity: "Common",
  slotType: "",

  def: 0,
  dmgReduction: 0.0,
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
  
  dropRate: 0,
  sellCost: 0,
  buyCost: 0,

  setArmor: (armor) => set({ ...armor }),
  clearArmor: () => set({ 
    id: "",
    filename: "",
    name: "",
    description: "",
    armorImg: "",
    class: "",
    rarity: "Common",
    slotType: "",

    def: 0,
    dmgReduction: 0.0,
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
    
    dropRate: 0,
    sellCost: 0,
    buyCost: 0,
  }),
})) 