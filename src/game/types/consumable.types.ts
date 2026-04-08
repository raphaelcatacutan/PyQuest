export interface Consumable { 
  id: string;
  filename: string;
  name: string;
  description: string;
  consumableImg: string;
  
  cooldown: number;

  heal: number;
  dmgIncrease: number;
  defIncrease: number;
  energyIncrease: number;
  atkSpeedIncrease: number;

  // Negative Buffs
  healthInflict: number;
  dmgInflict: number;
  defInflict: number;
  energyInflict: number;
  atkSpeedInflict: number;
  duration: number;

  dropRate: number;
  sellCost: number;
  buyCost: number;
}
