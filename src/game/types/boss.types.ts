import { LootDrop } from "./loot.types";
import { BossSceneTypes } from "./scene.types";

export interface Skill {
  name: string;
  dmg: number;
  energyCost: number;
}

export interface Boss {
  id: string;
  name: string;
  description: string;
  bossImg: string;

  hp: number;
  maxHp: number;
  energy: number;
  def: number;
  maxDef: number;
  maxEnergy: number;
  skills: Skill[];
  dmg: number;
  atkSpeed: number;
  critDmg: number;
  critChance: number;
  evasion: number;

  location: Partial<Record<BossSceneTypes, number>>;
  lootDrop: LootDrop;
  // TODO: Infliction
}