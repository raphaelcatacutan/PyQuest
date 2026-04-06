import { LootDrop } from "./loot.types";

interface Skill {
  name: string;
  dmg: number;
  energyCost: number;
  // TODO: Confirm Skill attributes
}

export interface Enemy {
  id: string;
  name: string;
  description: string;
  enemyImg: string;

  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  def: number;
  maxDef: number;
  skills: Skill[];
  dmg: number;
  atkSpeed: number;
  critDmg: number;
  critChance: number;
  evasion: number;

  spawnRate: number;
  lootDrop: LootDrop
  // TODO: Add rewards, coin range reward, 
}