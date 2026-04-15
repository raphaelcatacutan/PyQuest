export type CombatantKind = 'mob' | 'boss';

export type EnemySkillEffect =
  | { type: 'heal'; healAmount: number }
  | { type: 'stun'; duration: number }
  | { type: 'poison'; dmgPerSecond: number }
  | { type: 'bleed'; dmgPerSecond: number }
  | { type: 'empower'; dmgMultiplier: number }
  | { type: 'speedup'; speedUp: number }
  | { type: 'confusion'; dmg: number };

export type EnemySkill = {
  name: string;
  energyCost: number;
  dmg?: number;
  effect?: EnemySkillEffect;
};

export type EnemySnapshot = {
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  def: number;
  dmg: number;
  critChance: number;
  critDmg: number;
  atkSpeed: number;
  skills: EnemySkill[];
};

export type PlayerSnapshot = {
  hp: number;
  maxHP: number;
  def: number;
  baseDmg: number;
  baseCritChance: number;
  baseCritDmg: number;
  atkSpeed: number;
  level: number;
};

export type ActionType = 'skill' | 'fallback_basic_attack' | 'fallback_energy_regen';

export type Action = {
  id: string;
  type: ActionType;
  label: string;
  skillIndex?: number;
  energyCost: number;
  source: 'json_skill' | 'fallback';
};

export type ActionTag = 'none' | 'skill' | 'fallback_basic' | 'fallback_regen' | 'skip';

export type QTable = Map<string, number[]>;

export type TickInput = {
  player: PlayerSnapshot;
  enemy: EnemySnapshot;
  deltaMs: number;
};

export type TickResult = {
  didEnemyAct: boolean;
  enemyAction?: Action;
  damageToPlayer: number;
  damageToEnemy: number;
  healEnemy: number;
  energyDelta: number;
  reward: number;
  done: boolean;
};

export type EncounterConfig = {
  kind: CombatantKind;
  enemy: EnemySnapshot;
};
