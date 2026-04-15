export type CombatantKind = 'mob' | 'boss';

export type EnemySkillEffect =
  | { type: 'heal'; healAmount: number; target?: 'self' | 'player' }
  | { type: 'stun'; durationMs: number; target?: 'self' | 'player' }
  | {
      type: 'poison';
      dmgPerSecond: number;
      durationMs: number;
      tickIntervalMs: number;
      target?: 'self' | 'player';
    }
  | {
      type: 'bleed';
      dmgPerSecond: number;
      durationMs: number;
      tickIntervalMs: number;
      target?: 'self' | 'player';
    }
  | { type: 'empower'; dmgMultiplier: number; durationMs: number; target?: 'self' | 'player' }
  | { type: 'speedup'; speedUp: number; durationMs: number; target?: 'self' | 'player' }
  | { type: 'confusion'; durationMs: number; target?: 'self' | 'player' };

export type EnemySkill = {
  id: string;
  name: string;
  energyCost: number;
  cooldownMs: number;
  effect: EnemySkillEffect;
};

export type EnemySnapshot = {
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  energyRegenPerSecond: number;
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

export type PlayerAttackInput = {
  baseDamage: number;
  source: string;
};

export type ActionType = 'skill' | 'base_attack';

export type Action = {
  id: string;
  type: ActionType;
  label: string;
  skillIndex?: number;
  energyCost: number;
  source: 'json_skill' | 'base_runtime';
};

export type ActionTag = 'none' | 'skill' | 'base_attack' | 'skip';

export type QTable = Map<string, number[]>;

export type TickInput = {
  player: PlayerSnapshot;
  enemy: EnemySnapshot;
  playerAttacks?: PlayerAttackInput[];
  deltaMs: number;
};

export type EncounterAnalytics = {
  elapsedMs: number;
  totalDamageToPlayer: number;
  totalDamageToEnemy: number;
  totalDotDamageToPlayer: number;
  totalDotDamageToEnemy: number;
  totalPlayerAttacks: number;
  totalEnemyActions: number;
  totalEnemySkillCasts: number;
};

export type TickResult = {
  didEnemyAct: boolean;
  enemyAction?: Action;
  damageToPlayer: number;
  damageToEnemy: number;
  healEnemy: number;
  energyDelta: number;
  reward: number;
  damageCauses: string[];
  playerAttacksConsumed: number;
  analytics: EncounterAnalytics;
  done: boolean;
};

export type EncounterConfig = {
  kind: CombatantKind;
  enemy: EnemySnapshot;
};
