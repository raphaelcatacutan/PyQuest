import { LootDrop } from "./loot.types";
import { SceneTypes } from "./scene.types";

interface HealEffect { type: 'heal'; healAmount: number; }
interface StunEffect { type: 'stun'; durationSeconds: number; duration?: number; target?: 'self' | 'player'; }
interface PoisonEffect { type: 'poison'; dmgPerSecond: number; durationSeconds: number; tickIntervalSeconds: number; target?: 'self' | 'player'; }
interface BleedEffect { type: 'bleed'; dmgPerSecond: number; durationSeconds: number; tickIntervalSeconds: number; target?: 'self' | 'player'; }
interface EmpowerEffect { type: 'empower'; dmgMultiplier: number; durationSeconds: number; target?: 'self' | 'player'; }
interface SpeedUpEffect { type: 'speedup'; speedUp: number; durationSeconds: number; target?: 'self' | 'player'; }
interface ConfusionEffect { type: 'confusion'; durationSeconds: number; dmg?: number; target?: 'self' | 'player'; }

type SkillEffect = 
  | HealEffect 
  | StunEffect 
  | PoisonEffect 
  | BleedEffect 
  | EmpowerEffect 
  | SpeedUpEffect 
  | ConfusionEffect;

export interface Skill {
  id?: string;
  name: string;
  description: string;
  energyCost: number;
  cooldownSeconds?: number;
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
  energyRegenPerSecond: number;
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
