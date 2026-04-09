import { LootDrop } from "./loot.types";
import { SceneTypes } from "./scene.types";

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

  location: Partial<Record<SceneTypes, number>>;
  lootDrop: LootDrop;
  // TODO: Infliction
}