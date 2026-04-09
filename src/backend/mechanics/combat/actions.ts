import { Action, ActionTag, CombatantKind, EnemySnapshot, PlayerSnapshot } from './types';

const DEFEND_MULTIPLIER = 0.6;
const MOB_HEAL_PCT = 0.08;
const BOSS_HEAL_PCT = 0.12;
const MOB_REGEN_PCT = 0.15;
const BOSS_REGEN_PCT = 0.2;
const MOB_HEAL_COST = 20;
const BOSS_HEAL_COST = 25;

export type ActionOutcome = {
  damageToPlayer: number;
  healEnemy: number;
  energyDelta: number;
  defendMultiplier: number;
  actionTag: ActionTag;
};

export function buildActions(enemy: EnemySnapshot, kind: CombatantKind): Action[] {
  const actions: Action[] = [
    { id: 'basic', type: 'basic_attack', label: 'Basic Attack', energyCost: 0 },
  ];

  if (enemy.skills && enemy.skills.length > 0) {
    if (kind === 'boss') {
      enemy.skills.forEach((skill, i) => {
        actions.push({
          id: `skill_${i}`,
          type: 'skill',
          label: skill.name,
          skillIndex: i,
          energyCost: skill.energyCost ?? 0
        });
      });
    } else {
      const primaryIndex = selectPrimarySkillIndex(enemy);
      const skill = enemy.skills[primaryIndex];
      actions.push({
        id: `skill_${primaryIndex}`,
        type: 'skill',
        label: skill.name,
        skillIndex: primaryIndex,
        energyCost: skill.energyCost ?? 0
      });
    }
  }

  actions.push({ id: 'defend', type: 'defend', label: 'Defend', energyCost: 0 });
  actions.push({ id: 'heal', type: 'heal', label: 'Heal', energyCost: kind === 'boss' ? BOSS_HEAL_COST : MOB_HEAL_COST });
  actions.push({ id: 'regen', type: 'regen', label: 'Regen Energy', energyCost: 0 });

  return actions;
}

export function getValidActionIndices(actions: Action[], enemyEnergy: number): number[] {
  const valid: number[] = [];
  actions.forEach((action, i) => {
    if (action.energyCost <= enemyEnergy) {
      valid.push(i);
    }
  });
  return valid.length > 0 ? valid : [0];
}

export function resolveEnemyAction(
  action: Action,
  enemy: EnemySnapshot,
  player: PlayerSnapshot,
  kind: CombatantKind
): ActionOutcome {
  if (action.type === 'defend') {
    return {
      damageToPlayer: 0,
      healEnemy: 0,
      energyDelta: 0,
      defendMultiplier: DEFEND_MULTIPLIER,
      actionTag: 'defend'
    };
  }

  if (action.type === 'heal') {
    const healPct = kind === 'boss' ? BOSS_HEAL_PCT : MOB_HEAL_PCT;
    const healAmount = Math.round(enemy.maxHp * healPct);
    return {
      damageToPlayer: 0,
      healEnemy: healAmount,
      energyDelta: -action.energyCost,
      defendMultiplier: 1,
      actionTag: 'heal'
    };
  }

  if (action.type === 'regen') {
    const regenPct = kind === 'boss' ? BOSS_REGEN_PCT : MOB_REGEN_PCT;
    const regenAmount = Math.round(enemy.maxEnergy * regenPct);
    return {
      damageToPlayer: 0,
      healEnemy: 0,
      energyDelta: regenAmount,
      defendMultiplier: 1,
      actionTag: 'regen'
    };
  }

  const rawDamage = action.type === 'skill'
    ? getSkillDamage(enemy, action.skillIndex)
    : enemy.dmg;

  const damage = computeDamage(rawDamage, enemy.critChance, enemy.critDmg, player.def);

  return {
    damageToPlayer: damage,
    healEnemy: 0,
    energyDelta: -action.energyCost,
    defendMultiplier: 1,
    actionTag: action.type === 'skill' ? 'skill' : 'basic'
  };
}

export function computePlayerAutoAttack(
  player: PlayerSnapshot,
  enemy: EnemySnapshot,
  defendMultiplier: number
): number {
  const raw = player.baseDmg;
  const damage = computeDamage(raw, player.baseCritChance, player.baseCritDmg, enemy.def);
  return Math.round(damage * defendMultiplier);
}

function getSkillDamage(enemy: EnemySnapshot, index?: number): number {
  if (index == null || index < 0 || index >= enemy.skills.length) {
    return enemy.dmg;
  }
  return enemy.skills[index]?.dmg ?? enemy.dmg;
}

function selectPrimarySkillIndex(enemy: EnemySnapshot): number {
  if (!enemy.skills || enemy.skills.length === 0) return 0;
  let bestIdx = 0;
  let bestDmg = enemy.skills[0].dmg ?? 0;
  for (let i = 1; i < enemy.skills.length; i++) {
    const dmg = enemy.skills[i].dmg ?? 0;
    if (dmg > bestDmg) {
      bestDmg = dmg;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function normalizeChance(chance: number): number {
  if (chance <= 0) return 0;
  if (chance > 1) return Math.min(chance / 100, 1);
  return chance;
}

function computeDamage(base: number, critChance: number, critDmg: number, targetDef: number): number {
  let dmg = base;
  const chance = normalizeChance(critChance);
  if (Math.random() < chance) {
    dmg = dmg * (1 + Math.max(0, critDmg));
  }
  dmg = dmg - Math.max(0, targetDef);
  return Math.max(1, Math.round(dmg));
}
