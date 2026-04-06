import { create } from "zustand";
import { Consumable } from "../types/consumable.types";

/**
 * 
 *  Consumable State
 */

interface ConsumableStateProps extends Consumable {
  setConsumable: (consumable: Consumable) => void;
  clearConsumable: () => void;
}

export const useConsumableState = create<ConsumableStateProps>((set) => ({
  id: "",
  filename: "",
  name: "",
  description: "",
  consumableImg: "",

  cooldown: 0,
  
  heal: 0,
  dmgIncrease: 0,
  defIncrease: 0,
  energyIncrease: 0,
  atkSpeedIncrease: 0,

  healthInflict: 0,
  dmgInflict: 0,
  defInflict: 0,
  energyInflict: 0,
  atkSpeedInflict: 0,
  duration: 0,

  dropRate: 0,
  sellCost: 0,
  buyCost: 0,

  setConsumable: (consumable) => ({ ...consumable }),
  clearConsumable: () => ({
    id: "",
    filename: "",
    name: "",
    description: "",
    consumableImg: "",

    cooldown: 0,
    
    heal: 0,
    dmgIncrease: 0,
    defIncrease: 0,
    energyIncrease: 0,
    atkSpeedIncrease: 0,

    healthInflict: 0,
    dmgInflict: 0,
    defInflict: 0,
    energyInflict: 0,
    atkSpeedInflict: 0,
    duration: 0,

    dropRate: 0,
    sellCost: 0,
    buyCost: 0,
  })
}))