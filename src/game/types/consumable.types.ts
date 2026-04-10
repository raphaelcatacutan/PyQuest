// 1. Define the specific Effect Types
interface RestoreEffect { type: 'restore'; stat: 'hp' | 'energy' | 'def'; amount: number; }
interface BuffEffect { type: 'buff'; stat: 'dmg' | 'def' | 'speed'; multiplier: number; duration: number; }
interface DebuffEffect { type: 'debuff'; stat: 'hp' | 'energy' | 'speed'; amount: number; duration: number; }

// 2. Create the Union
type ConsumableEffect = RestoreEffect | BuffEffect | DebuffEffect;

// 3. The final Consumable interface
export interface Consumable { 
  id: string;
  name: string;
  description: string;
  consumableImg: string;
  cooldown: number;
  
  // Use an array if an item can do multiple things (e.g., Heal + Buff)
  effects: ConsumableEffect[]; 

  dropRate: number;
  sellCost: number;
  buyCost: number;
}