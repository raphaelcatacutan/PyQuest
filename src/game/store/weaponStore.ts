import { create } from "zustand"
import { Weapon } from "../types/weapon.types"

/**
 * 
 *  Weapon State
 */

interface WeaponStoreProps extends Weapon {
  setWeapon: (weapon: Weapon) => void
  clearWeapon: () => void
}

export const useWeaponStore = create<WeaponStoreProps>((set) => ({
  id: "",
  filename: "",      
  name: "",         
  description: "",
  weaponImg: "",     
  wieldType: "",
  class: "",        
  rarity: "Common",
  
  dmg: 0,          
  critDmg: 0,      
  critChance: 0,   
  durability: 0,   
  
  energyCost: 0,   
  
  dmgBonus: 0,
  atkSpeedBonus: 0,

  dropRate: 0,

  setWeapon: (weapon) => ({ ...weapon }),
  clearWeapon: () => ({
    id: "",
    filename: "",      
    name: "",         
    description: "",
    weaponImg: "",     
    wieldType: "",
    class: "",        
    rarity: "Common",
    
    dmg: 0,          
    critDmg: 0,      
    critChance: 0,   
    durability: 0,   
    
    energyCost: 0,   
    
    dmgBonus: 0,
    atkSpeedBonus: 0,

    dropRate: 0,
  })
}))