import { LootDrop } from "./loot.types";
import { SceneTypes } from "./scene.types";


interface HealEffect { type: 'heal'; healAmount: number; }
interface StunEffect { type: 'stun'; durationMs: number; duration?: number; target?: 'self' | 'player'; }
interface PoisonEffect { type: 'poison'; dmgPerSecond: number; durationMs: number; tickIntervalMs: number; target?: 'self' | 'player'; }
interface BleedEffect { type: 'bleed'; dmgPerSecond: number; durationMs: number; tickIntervalMs: number; target?: 'self' | 'player'; }
interface EmpowerEffect { type: 'empower'; dmgMultiplier: number; durationMs: number; target?: 'self' | 'player'; }
interface SpeedUpEffect { type: 'speedup'; speedUp: number; durationMs: number; target?: 'self' | 'player'; }
interface ConfusionEffect { type: 'confusion'; durationMs: number; dmg?: number; target?: 'self' | 'player'; }

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
  cooldownMs?: number;
  effect: SkillEffect;
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
  energyRegenPerSecond: number;
  def: number;
  maxDef: number;
  skills: Skill[];
  dmg: number;
  atkSpeed: number;
  critDmg: number;
  critChance: number;
  evasion: number;

  location: Partial<Record<SceneTypes, number>>;
  lootDrop: LootDrop 
}
