import { LootDrop } from "./loot.types";
import { SceneTypes } from "./scene.types";

interface HealEffect { type: 'heal'; healAmount: number; }
interface StunEffect { type: 'stun'; duration: number; }
interface PoisonEffect { type: 'poison'; dmgPerSecond: number; }
interface BleedEffect { type: 'bleed'; dmgPerSecond: number; }
interface EmpowerEffect { type: 'empower'; dmgMultiplier: number; }
interface SpeedUpEffect { type: 'speedup'; speedUp: number; }
interface ConfusionEffect { type: 'confusion'; dmg: number; }

type SkillEffect = 
  | HealEffect 
  | StunEffect 
  | PoisonEffect 
  | BleedEffect 
  | EmpowerEffect 
  | SpeedUpEffect 
  | ConfusionEffect;

export interface Skill {
  name: string;
  description: string;
  energyCost: number;
  effect: SkillEffect;
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
}