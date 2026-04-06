import { Consumable } from "../types/consumable.types";

/**
 * 
 *  Consumable Database
 */

export const Consumables: Record<string, Consumable> = {
  health_potion: {
    id: "health_potion",
    filename: "health_potion",
    name: "Health Potion",
    description: "Restores 50 HP when consumed.",
    consumableImg: "",

    cooldown: 5000,

    heal: 20,
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
    
    dropRate: 0.15,
    sellCost: 25,
    buyCost: 50,
  }
}