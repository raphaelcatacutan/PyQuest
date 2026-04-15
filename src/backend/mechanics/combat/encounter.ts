import { buildActions, clamp, computeDamage, getAttackIntervalMs, getValidSkillIndices } from './actions';
import { buildStateKey, bucketEnergy, bucketHp, bucketLevel, bucketRecentDamage, getPhase } from './state-buckets';
import { selectActionIndex, updateQ } from './qlearning';
import {
  Action,
  ActionTag,
  CombatantKind,
  EncounterAnalytics,
  EncounterConfig,
  EnemySkill,
  EnemySkillEffect,
  EnemySnapshot,
  PlayerAttackInput,
  PlayerSnapshot,
  TickInput,
  TickResult,
} from './types';

const DEFAULT_PARAMS = {
  alpha: 0.3,
  gamma: 0.8,
  epsilon: 0.2,
};

type DotEffectType = 'poison' | 'bleed';

type DotInstance = {
  type: DotEffectType;
  dmgPerSecond: number;
  remainingMs: number;
  tickIntervalMs: number;
  tickAccumulatorMs: number;
};

type UnitStatusState = {
  stunMs: number;
  confusionMs: number;
  empowerMs: number;
  empowerMultiplier: number;
  speedUpMs: number;
  speedUpMultiplier: number;
  dots: DotInstance[];
};

type SkillOutcome = {
  damageToPlayer: number;
  damageToEnemy: number;
  healEnemy: number;
};

type EffectTarget = 'self' | 'player';

type DotTickResult = {
  total: number;
  poison: number;
  bleed: number;
};

type PlayerAttackResolution = {
  damageToEnemy: number;
  damageToPlayer: number;
  appliedCount: number;
  redirectedCount: number;
  blockedCount: number;
};

export class EncounterController {
  private kind: CombatantKind;
  private actions: Action[];
  private qtable: Map<string, number[]>;
  private lastAction: ActionTag;
  private lastDamageToPlayer: number;
  private lastDamageToEnemy: number;
  private enemyAttackAccumulatorMs: number;
  private skillCooldownsMs: number[];
  private enemyStatus: UnitStatusState;
  private playerStatus: UnitStatusState;
  private analytics: EncounterAnalytics;

  constructor(config: EncounterConfig) {
    this.kind = config.kind;
    this.actions = buildActions(config.enemy);
    this.qtable = new Map();
    this.lastAction = 'none';
    this.lastDamageToPlayer = 0;
    this.lastDamageToEnemy = 0;
    this.enemyAttackAccumulatorMs = 0;
    this.skillCooldownsMs = new Array(this.actions.length).fill(0);
    this.enemyStatus = createUnitStatusState();
    this.playerStatus = createUnitStatusState();
    this.analytics = createEncounterAnalytics();
  }

  tick(input: TickInput): TickResult {
    if (input.player.hp <= 0 || input.enemy.hp <= 0) {
      return {
        didEnemyAct: false,
        damageToPlayer: 0,
        damageToEnemy: 0,
        healEnemy: 0,
        energyDelta: 0,
        reward: 0,
        damageCauses: [],
        playerAttacksConsumed: 0,
        analytics: { ...this.analytics },
        done: true,
      };
    }

    const deltaMs = Math.max(0, input.deltaMs || 0);
    tickCooldowns(this.skillCooldownsMs, deltaMs);
    tickUnitDurations(this.enemyStatus, deltaMs);
    tickUnitDurations(this.playerStatus, deltaMs);

    let enemyEnergy = input.enemy.energy;
    const regenPerSecond = Math.max(0, input.enemy.energyRegenPerSecond);
    if (regenPerSecond > 0 && input.enemy.maxEnergy > 0) {
      enemyEnergy = clamp(
        enemyEnergy + (regenPerSecond * deltaMs) / 1000,
        0,
        input.enemy.maxEnergy,
      );
    }

    let damageToPlayer = 0;
    let damageToEnemy = 0;
    let healEnemy = 0;
    const damageCauses: string[] = [];
    let didEnemyAct = false;
    let enemyAction: Action | undefined;
    let selectedSkillIndex = -1;
    let selectedSkillStateKey: string | null = null;
    let totalDotDamageToPlayer = 0;
    let totalDotDamageToEnemy = 0;

    const playerDotDamage = applyDotTicks(this.playerStatus, deltaMs);
    if (playerDotDamage.total > 0) {
      damageToPlayer += playerDotDamage.total;
      totalDotDamageToPlayer += playerDotDamage.total;
      if (playerDotDamage.poison > 0) {
        damageCauses.push(`poison_to_player(${playerDotDamage.poison})`);
      }
      if (playerDotDamage.bleed > 0) {
        damageCauses.push(`bleed_to_player(${playerDotDamage.bleed})`);
      }
    }

    const enemyDotDamage = applyDotTicks(this.enemyStatus, deltaMs);
    if (enemyDotDamage.total > 0) {
      damageToEnemy += enemyDotDamage.total;
      totalDotDamageToEnemy += enemyDotDamage.total;
      if (enemyDotDamage.poison > 0) {
        damageCauses.push(`poison_to_enemy(${enemyDotDamage.poison})`);
      }
      if (enemyDotDamage.bleed > 0) {
        damageCauses.push(`bleed_to_enemy(${enemyDotDamage.bleed})`);
      }
    }

    const playerAttacks = input.playerAttacks ?? [];
    const playerAttacksConsumed = playerAttacks.length;
    const playerAttackResolution = this.resolvePlayerAttacks(
      playerAttacks,
      input.player,
      input.enemy.def,
    );
    if (playerAttackResolution.damageToEnemy > 0) {
      damageToEnemy += playerAttackResolution.damageToEnemy;
      damageCauses.push(`player_attack(${playerAttackResolution.appliedCount})`);
    }
    if (playerAttackResolution.damageToPlayer > 0) {
      damageToPlayer += playerAttackResolution.damageToPlayer;
      damageCauses.push(`player_confusion_self_hit(${playerAttackResolution.redirectedCount})`);
    }
    if (playerAttackResolution.blockedCount > 0) {
      damageCauses.push(`player_attack_blocked_stun(${playerAttackResolution.blockedCount})`);
    }

    const isEnemyStunned = this.enemyStatus.stunMs > 0;
    if (isEnemyStunned) {
      damageCauses.push('enemy_stunned');
    }
    if (!isEnemyStunned) {
      const attackIntervalMs = getAttackIntervalMs(
        input.enemy.atkSpeed,
        getSpeedUpMultiplier(this.enemyStatus),
      );

      if (attackIntervalMs != null) {
        this.enemyAttackAccumulatorMs += deltaMs;
        if (this.enemyAttackAccumulatorMs >= attackIntervalMs) {
          this.enemyAttackAccumulatorMs -= attackIntervalMs;
          didEnemyAct = true;

          const stateKey = buildStateKey(
            buildState(
              input.player,
              { ...input.enemy, energy: enemyEnergy },
              this.lastAction,
              this.lastDamageToPlayer,
              this.lastDamageToEnemy,
              this.kind,
            ),
            this.kind,
          );

          const validSkillIndices = getValidSkillIndices(
            this.actions,
            enemyEnergy,
            this.skillCooldownsMs,
          );

          if (validSkillIndices.length > 0) {
            selectedSkillIndex = selectActionIndex(
              this.qtable,
              stateKey,
              this.actions,
              validSkillIndices,
              DEFAULT_PARAMS.epsilon,
            );
            selectedSkillStateKey = stateKey;

            const action = this.actions[selectedSkillIndex];
            const skill = getSkillByAction(input.enemy, action);
            if (skill) {
              enemyAction = action;
              enemyEnergy = clamp(enemyEnergy - skill.energyCost, 0, input.enemy.maxEnergy);
              this.skillCooldownsMs[selectedSkillIndex] = Math.max(0, skill.cooldownMs);

              const outcome = applySkillEffect(skill, this.enemyStatus, this.playerStatus);
              damageToPlayer += outcome.damageToPlayer;
              damageToEnemy += outcome.damageToEnemy;
              healEnemy += outcome.healEnemy;
              damageCauses.push(`enemy_skill:${skill.id}`);
              this.lastAction = 'skill';
            } else {
              this.lastAction = 'skip';
            }
          } else {
            enemyAction = {
              id: 'base_attack',
              type: 'base_attack',
              label: this.enemyStatus.confusionMs > 0 ? 'Confused Self Attack' : 'Base Attack',
              energyCost: 0,
              source: 'base_runtime',
            };

            const outgoingBaseDamage =
              input.enemy.dmg * getEmpowerMultiplier(this.enemyStatus);
            const targetDef = this.enemyStatus.confusionMs > 0 ? input.enemy.def : input.player.def;
            const damage = computeDamage(
              outgoingBaseDamage,
              input.enemy.critChance,
              input.enemy.critDmg,
              targetDef,
            );

            if (this.enemyStatus.confusionMs > 0) {
              damageToEnemy += damage;
              damageCauses.push(`enemy_confusion_self_hit(${damage})`);
            } else {
              damageToPlayer += damage;
              damageCauses.push(`enemy_base_attack(${damage})`);
            }

            this.lastAction = 'base_attack';
          }
        }
      }
    }

    const beforePlayerHp = input.player.hp;
    const beforeEnemyHp = input.enemy.hp;
    const afterPlayerHp = clamp(beforePlayerHp - damageToPlayer, 0, input.player.maxHP);
    const afterEnemyHp = clamp(beforeEnemyHp - damageToEnemy + healEnemy, 0, input.enemy.maxHp);

    const reward = computeReward(
      beforePlayerHp,
      afterPlayerHp,
      beforeEnemyHp,
      afterEnemyHp,
      input.player.maxHP,
      input.enemy.maxHp,
    );

    this.lastDamageToPlayer = damageToPlayer;
    this.lastDamageToEnemy = damageToEnemy;
    const done = afterPlayerHp <= 0 || afterEnemyHp <= 0;

    this.analytics.elapsedMs += deltaMs;
    this.analytics.totalDamageToPlayer += damageToPlayer;
    this.analytics.totalDamageToEnemy += damageToEnemy;
    this.analytics.totalDotDamageToPlayer += totalDotDamageToPlayer;
    this.analytics.totalDotDamageToEnemy += totalDotDamageToEnemy;
    this.analytics.totalPlayerAttacks += playerAttacksConsumed;
    if (didEnemyAct) {
      this.analytics.totalEnemyActions += 1;
      if (enemyAction?.type === 'skill') {
        this.analytics.totalEnemySkillCasts += 1;
      }
    }

    if (selectedSkillIndex >= 0 && selectedSkillStateKey) {
      const nextStateKey = buildStateKey(
        buildState(
          { ...input.player, hp: afterPlayerHp },
          { ...input.enemy, hp: afterEnemyHp, energy: enemyEnergy },
          this.lastAction,
          this.lastDamageToPlayer,
          this.lastDamageToEnemy,
          this.kind,
        ),
        this.kind,
      );

      updateQ(
        this.qtable,
        selectedSkillStateKey,
        selectedSkillIndex,
        reward,
        nextStateKey,
        DEFAULT_PARAMS,
        done,
        this.actions.length,
      );
    }

    return {
      didEnemyAct,
      enemyAction,
      damageToPlayer,
      damageToEnemy,
      healEnemy,
      energyDelta: enemyEnergy - input.enemy.energy,
      reward,
      damageCauses,
      playerAttacksConsumed,
      analytics: { ...this.analytics },
      done,
    };
  }

  endEncounter(): void {
    this.qtable.clear();
    this.lastAction = 'none';
    this.lastDamageToEnemy = 0;
    this.lastDamageToPlayer = 0;
    this.enemyAttackAccumulatorMs = 0;
    this.skillCooldownsMs.fill(0);
    this.enemyStatus = createUnitStatusState();
    this.playerStatus = createUnitStatusState();
    this.analytics = createEncounterAnalytics();
  }

  private resolvePlayerAttacks(
    attacks: PlayerAttackInput[],
    player: PlayerSnapshot,
    enemyDef: number,
  ): PlayerAttackResolution {
    const result: PlayerAttackResolution = {
      damageToEnemy: 0,
      damageToPlayer: 0,
      appliedCount: 0,
      redirectedCount: 0,
      blockedCount: 0,
    };

    if (attacks.length === 0) {
      return result;
    }

    if (this.playerStatus.stunMs > 0) {
      result.blockedCount = attacks.length;
      return result;
    }

    const isPlayerConfused = this.playerStatus.confusionMs > 0;
    for (const attack of attacks) {
      const outgoingDamage = computeDamage(
        attack.baseDamage,
        player.baseCritChance,
        player.baseCritDmg,
        isPlayerConfused ? player.def : enemyDef,
      );
      if (isPlayerConfused) {
        result.damageToPlayer += outgoingDamage;
        result.redirectedCount += 1;
      } else {
        result.damageToEnemy += outgoingDamage;
        result.appliedCount += 1;
      }
    }

    return result;
  }
}

export function createEncounterController(config: EncounterConfig): EncounterController {
  return new EncounterController(config);
}

function getSkillByAction(enemy: EnemySnapshot, action: Action): EnemySkill | null {
  const index = action.skillIndex;
  if (index == null || index < 0 || index >= enemy.skills.length) {
    return null;
  }

  const skill = enemy.skills[index];
  if (!skill) {
    return null;
  }

  if (!Number.isFinite(skill.energyCost) || skill.energyCost < 0) {
    return null;
  }

  if (!Number.isFinite(skill.cooldownMs) || skill.cooldownMs < 0) {
    return null;
  }

  return skill;
}

function createUnitStatusState(): UnitStatusState {
  return {
    stunMs: 0,
    confusionMs: 0,
    empowerMs: 0,
    empowerMultiplier: 1,
    speedUpMs: 0,
    speedUpMultiplier: 1,
    dots: [],
  };
}

function tickCooldowns(cooldownsMs: number[], deltaMs: number): void {
  if (deltaMs <= 0) return;
  for (let i = 0; i < cooldownsMs.length; i++) {
    cooldownsMs[i] = Math.max(0, (cooldownsMs[i] ?? 0) - deltaMs);
  }
}

function tickUnitDurations(status: UnitStatusState, deltaMs: number): void {
  if (deltaMs <= 0) return;

  status.stunMs = Math.max(0, status.stunMs - deltaMs);
  status.confusionMs = Math.max(0, status.confusionMs - deltaMs);
  status.empowerMs = Math.max(0, status.empowerMs - deltaMs);
  status.speedUpMs = Math.max(0, status.speedUpMs - deltaMs);

  if (status.empowerMs <= 0) {
    status.empowerMultiplier = 1;
  }
  if (status.speedUpMs <= 0) {
    status.speedUpMultiplier = 1;
  }
}

function applyDotTicks(status: UnitStatusState, deltaMs: number): DotTickResult {
  if (deltaMs <= 0 || status.dots.length === 0) {
    return {
      total: 0,
      poison: 0,
      bleed: 0,
    };
  }

  let poison = 0;
  let bleed = 0;
  const nextDots: DotInstance[] = [];
  for (const dot of status.dots) {
    dot.remainingMs -= deltaMs;
    dot.tickAccumulatorMs += deltaMs;

    while (dot.tickAccumulatorMs >= dot.tickIntervalMs && dot.remainingMs > -dot.tickIntervalMs) {
      dot.tickAccumulatorMs -= dot.tickIntervalMs;
      const tickDamage = Math.max(0, Math.round((dot.dmgPerSecond * dot.tickIntervalMs) / 1000));
      if (dot.type === 'poison') {
        poison += tickDamage;
      } else {
        bleed += tickDamage;
      }
    }

    if (dot.remainingMs > 0) {
      nextDots.push(dot);
    }
  }

  status.dots = nextDots;
  return {
    total: poison + bleed,
    poison,
    bleed,
  };
}

function applySkillEffect(
  skill: EnemySkill,
  enemyStatus: UnitStatusState,
  playerStatus: UnitStatusState,
): SkillOutcome {
  const effect = skill.effect;
  const target = resolveEffectTarget(effect);

  const targetStatus = target === 'self' ? enemyStatus : playerStatus;
  const outcome: SkillOutcome = {
    damageToPlayer: 0,
    damageToEnemy: 0,
    healEnemy: 0,
  };

  switch (effect.type) {
    case 'heal':
      if (target === 'self') {
        outcome.healEnemy += Math.max(0, effect.healAmount);
      }
      break;
    case 'stun':
      targetStatus.stunMs = Math.max(targetStatus.stunMs, toNonNegative(effect.durationMs));
      break;
    case 'poison':
    case 'bleed':
      targetStatus.dots.push({
        type: effect.type,
        dmgPerSecond: toNonNegative(effect.dmgPerSecond),
        remainingMs: toNonNegative(effect.durationMs),
        tickIntervalMs: Math.max(1, toNonNegative(effect.tickIntervalMs)),
        tickAccumulatorMs: 0,
      });
      break;
    case 'empower':
      if (target === 'self') {
        enemyStatus.empowerMultiplier = Math.max(
          enemyStatus.empowerMultiplier,
          Math.max(1, toNonNegative(effect.dmgMultiplier)),
        );
        enemyStatus.empowerMs = Math.max(enemyStatus.empowerMs, toNonNegative(effect.durationMs));
      }
      break;
    case 'speedup':
      if (target === 'self') {
        enemyStatus.speedUpMultiplier = Math.max(
          enemyStatus.speedUpMultiplier,
          1 + toNonNegative(effect.speedUp),
        );
        enemyStatus.speedUpMs = Math.max(enemyStatus.speedUpMs, toNonNegative(effect.durationMs));
      }
      break;
    case 'confusion':
      targetStatus.confusionMs = Math.max(targetStatus.confusionMs, toNonNegative(effect.durationMs));
      break;
    default:
      break;
  }

  return outcome;
}

function resolveEffectTarget(effect: EnemySkillEffect): EffectTarget {
  if (effect.target) {
    return effect.target;
  }

  switch (effect.type) {
    case 'heal':
    case 'empower':
    case 'speedup':
      return 'self';
    case 'stun':
    case 'poison':
    case 'bleed':
    case 'confusion':
    default:
      return 'player';
  }
}

function getEmpowerMultiplier(status: UnitStatusState): number {
  if (status.empowerMs <= 0) return 1;
  return Math.max(1, status.empowerMultiplier);
}

function getSpeedUpMultiplier(status: UnitStatusState): number {
  if (status.speedUpMs <= 0) return 1;
  return Math.max(1, status.speedUpMultiplier);
}

function toNonNegative(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }
  return value;
}

function buildState(
  player: PlayerSnapshot,
  enemy: EnemySnapshot,
  lastAction: ActionTag,
  lastDmgToPlayer: number,
  lastDmgToEnemy: number,
  kind: CombatantKind,
) {
  const base = {
    pHp: bucketHp(player.hp, player.maxHP),
    eHp: bucketHp(enemy.hp, enemy.maxHp),
    eEnergy: bucketEnergy(enemy.energy, enemy.maxEnergy),
    pLevel: bucketLevel(player.level),
    lastAction,
  };

  if (kind === 'boss') {
    return {
      ...base,
      phase: getPhase(enemy.hp, enemy.maxHp),
      pRecentDmg: bucketRecentDamage(lastDmgToPlayer, player.maxHP),
      eRecentDmg: bucketRecentDamage(lastDmgToEnemy, enemy.maxHp),
    };
  }

  return base;
}

function computeReward(
  beforePlayerHp: number,
  afterPlayerHp: number,
  beforeEnemyHp: number,
  afterEnemyHp: number,
  playerMaxHp: number,
  enemyMaxHp: number,
): number {
  const dp = (beforePlayerHp - afterPlayerHp) / Math.max(1, playerMaxHp);
  const de = (beforeEnemyHp - afterEnemyHp) / Math.max(1, enemyMaxHp);

  let reward = dp - de;
  const playerHpRatio = afterPlayerHp / Math.max(1, playerMaxHp);
  if (playerHpRatio >= 0.3 && playerHpRatio <= 0.6) {
    reward += 0.05;
  } else {
    reward -= 0.02;
  }

  if (playerHpRatio < 0.2 && dp > 0) {
    reward -= 0.08;
  }

  if (afterPlayerHp <= 0) reward += 1;
  if (afterEnemyHp <= 0) reward -= 1;
  return reward;
}

function createEncounterAnalytics(): EncounterAnalytics {
  return {
    elapsedMs: 0,
    totalDamageToPlayer: 0,
    totalDamageToEnemy: 0,
    totalDotDamageToPlayer: 0,
    totalDotDamageToEnemy: 0,
    totalPlayerAttacks: 0,
    totalEnemyActions: 0,
    totalEnemySkillCasts: 0,
  };
}
