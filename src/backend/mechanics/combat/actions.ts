import { Action, ActionTag, EnemySnapshot, PlayerSnapshot } from './types';

const FALLBACK_REGEN_RATIO = 0.2;
const FALLBACK_REGEN_THRESHOLD_RATIO = 0.35;

export type ActionOutcome = {
  damageToPlayer: number;
  healEnemy: number;
  energyDelta: number;
  actionTag: ActionTag;
};

export function buildActions(enemy: EnemySnapshot): Action[] {
  if (!enemy.skills || enemy.skills.length === 0) {
    return [];
  }

  return enemy.skills.map((skill, index) => ({
    id: `skill_${index}`,
    type: 'skill',
    label: skill.name,
    skillIndex: index,
    energyCost: skill.energyCost ?? 0,
    source: 'json_skill',
  }));
}

export function getValidActionIndices(actions: Action[], enemyEnergy: number): number[] {
  const valid: number[] = [];
  actions.forEach((action, index) => {
    if (action.energyCost <= enemyEnergy) {
      valid.push(index);
    }
  });
  return valid;
}

export function createFallbackAction(enemy: EnemySnapshot): Action | null {
  const hasDamage = enemy.dmg > 0;
  const hasEnergyPool = enemy.maxEnergy > 0;
  const canRegen = hasEnergyPool && enemy.energy < enemy.maxEnergy;

  if (!hasDamage && !canRegen) {
    return null;
  }

  const regenThreshold = Math.ceil(enemy.maxEnergy * FALLBACK_REGEN_THRESHOLD_RATIO);
  const minSkillCost = enemy.skills.length > 0
    ? Math.min(...enemy.skills.map((skill) => skill.energyCost ?? 0))
    : Number.POSITIVE_INFINITY;

  if (canRegen && (enemy.energy < minSkillCost || enemy.energy <= regenThreshold || !hasDamage)) {
    return {
      id: 'fallback_energy_regen',
      type: 'fallback_energy_regen',
      label: 'Fallback Energy Regen',
      energyCost: 0,
      source: 'fallback',
    };
  }

  if (hasDamage) {
    return {
      id: 'fallback_basic_attack',
      type: 'fallback_basic_attack',
      label: 'Fallback Basic Attack',
      energyCost: 0,
      source: 'fallback',
    };
  }

  return null;
}

export function resolveEnemyAction(
  action: Action,
  enemy: EnemySnapshot,
  player: PlayerSnapshot
): ActionOutcome {
  if (action.type === 'fallback_energy_regen') {
    const regen = Math.max(1, Math.round(enemy.maxEnergy * FALLBACK_REGEN_RATIO));
    return {
      damageToPlayer: 0,
      healEnemy: 0,
      energyDelta: regen,
      actionTag: 'fallback_regen',
    };
  }

  const rawDamage =
    action.type === 'skill' ? getSkillDamage(enemy, action.skillIndex) : enemy.dmg;
  const healEnemy =
    action.type === 'skill' ? getSkillHeal(enemy, action.skillIndex) : 0;
  const damage = computeDamage(rawDamage, enemy.critChance, enemy.critDmg, player.def);

  return {
    damageToPlayer: damage,
    healEnemy,
    energyDelta: -action.energyCost,
    actionTag: action.type === 'skill' ? 'skill' : 'fallback_basic',
  };
}

function getSkillDamage(enemy: EnemySnapshot, index?: number): number {
  if (index == null || index < 0 || index >= enemy.skills.length) {
    return 0;
  }
  const skill = enemy.skills[index];
  if (!skill) return 0;

  if (typeof skill.dmg === 'number') {
    return Math.max(0, skill.dmg);
  }

  const effect = skill.effect;
  if (!effect) {
    return Math.max(0, enemy.dmg);
  }

  switch (effect.type) {
    case 'confusion':
      return Math.max(0, effect.dmg);
    case 'poison':
    case 'bleed':
      return Math.max(0, effect.dmgPerSecond);
    case 'empower':
      return Math.max(0, Math.round(enemy.dmg * Math.max(1, effect.dmgMultiplier)));
    case 'speedup':
      return Math.max(0, Math.round(enemy.dmg * (1 + Math.max(0, effect.speedUp))));
    case 'stun':
      return Math.max(0, enemy.dmg);
    case 'heal':
      return 0;
    default:
      return Math.max(0, enemy.dmg);
  }
}

function getSkillHeal(enemy: EnemySnapshot, index?: number): number {
  if (index == null || index < 0 || index >= enemy.skills.length) {
    return 0;
  }

  const effect = enemy.skills[index]?.effect;
  if (!effect || effect.type !== 'heal') {
    return 0;
  }

  return Math.max(0, effect.healAmount);
}

function normalizeChance(chance: number): number {
  if (chance <= 0) return 0;
  if (chance > 1) return Math.min(chance / 100, 1);
  return chance;
}

function computeDamage(base: number, critChance: number, critDmg: number, targetDef: number): number {
  if (base <= 0) return 0;

  let dmg = base;
  const chance = normalizeChance(critChance);
  if (Math.random() < chance) {
    dmg = dmg * (1 + Math.max(0, critDmg));
  }
  dmg = dmg - Math.max(0, targetDef);
  return Math.max(1, Math.round(dmg));
}
