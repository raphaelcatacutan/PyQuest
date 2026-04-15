import { Action, EnemySnapshot } from './types';

export function buildActions(enemy: EnemySnapshot): Action[] {
  if (!enemy.skills || enemy.skills.length === 0) {
    return [];
  }

  return enemy.skills.map((skill, index) => ({
    id: skill.id,
    type: 'skill',
    label: skill.name,
    skillIndex: index,
    energyCost: skill.energyCost,
    source: 'json_skill',
  }));
}

export function getValidSkillIndices(
  actions: Action[],
  enemyEnergy: number,
  skillCooldownsMs: number[],
): number[] {
  const valid: number[] = [];
  actions.forEach((action, index) => {
    const cooldown = skillCooldownsMs[index] ?? 0;
    if (cooldown <= 0 && action.energyCost <= enemyEnergy) {
      valid.push(index);
    }
  });
  return valid;
}

export function getAttackIntervalMs(attacksPerSecond: number, atkSpeedMultiplier = 1): number | null {
  if (!Number.isFinite(attacksPerSecond) || attacksPerSecond <= 0) {
    return null;
  }

  const multiplier = Number.isFinite(atkSpeedMultiplier) && atkSpeedMultiplier > 0
    ? atkSpeedMultiplier
    : 1;
  const effectiveRate = attacksPerSecond * multiplier;
  if (effectiveRate <= 0) {
    return null;
  }

  return 1000 / effectiveRate;
}

export function computeDamage(base: number, critChance: number, critDmg: number, targetDef: number): number {
  if (!Number.isFinite(base) || base <= 0) {
    return 0;
  }

  let dmg = base;
  if (Math.random() < normalizeChance(critChance)) {
    dmg = dmg * (1 + Math.max(0, critDmg));
  }

  dmg = dmg - Math.max(0, targetDef);
  return Math.max(1, Math.round(dmg));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeChance(chance: number): number {
  if (!Number.isFinite(chance) || chance <= 0) return 0;
  if (chance > 1) return Math.min(chance / 100, 1);
  return chance;
}
