import { buildActions, createFallbackAction, getValidActionIndices, resolveEnemyAction } from './actions';
import { buildStateKey, bucketEnergy, bucketHp, bucketLevel, bucketRecentDamage, getPhase } from './state-buckets';
import { selectActionIndex, updateQ } from './qlearning';
import {
  Action,
  ActionTag,
  CombatantKind,
  EncounterConfig,
  EnemySnapshot,
  PlayerSnapshot,
  TickInput,
  TickResult,
} from './types';

const DEFAULT_PARAMS = {
  alpha: 0.3,
  gamma: 0.8,
  epsilon: 0.2,
};

export class EncounterController {
  private kind: CombatantKind;
  private actions: Action[];
  private qtable: Map<string, number[]>;
  private lastAction: ActionTag;
  private lastDamageToPlayer: number;
  private lastDamageToEnemy: number;
  private enemyCooldownMs: number;

  constructor(config: EncounterConfig) {
    this.kind = config.kind;
    this.actions = buildActions(config.enemy);
    this.qtable = new Map();
    this.lastAction = 'none';
    this.lastDamageToPlayer = 0;
    this.lastDamageToEnemy = 0;
    this.enemyCooldownMs = 0;
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
        done: true,
      };
    }

    const delta = Math.max(0, input.deltaMs || 0);
    this.enemyCooldownMs += delta;

    const enemyAtkMs = toMsFromAtkSpeed(input.enemy.atkSpeed, 1200);
    const enemyReady = this.enemyCooldownMs >= enemyAtkMs;
    if (!enemyReady) {
      return {
        didEnemyAct: false,
        damageToPlayer: 0,
        damageToEnemy: 0,
        healEnemy: 0,
        energyDelta: 0,
        reward: 0,
        done: false,
      };
    }

    this.enemyCooldownMs -= enemyAtkMs;

    const beforePlayerHp = input.player.hp;
    const beforeEnemyHp = input.enemy.hp;

    let enemyAction: Action | undefined;
    let damageToPlayer = 0;
    let healEnemy = 0;
    let energyDelta = 0;
    let reward = 0;
    let selectedSkillIndex = -1;

    const stateKey = buildStateKey(
      buildState(
        input.player,
        input.enemy,
        this.lastAction,
        this.lastDamageToPlayer,
        this.lastDamageToEnemy,
        this.kind,
      ),
      this.kind,
    );

    const validSkillIndices = getValidActionIndices(this.actions, input.enemy.energy);
    if (this.actions.length > 0 && validSkillIndices.length > 0) {
      selectedSkillIndex = selectActionIndex(
        this.qtable,
        stateKey,
        this.actions,
        validSkillIndices,
        DEFAULT_PARAMS.epsilon,
      );
      enemyAction = this.actions[selectedSkillIndex];
    } else {
      const fallbackAction = createFallbackAction(input.enemy);
      if (!fallbackAction) {
        this.lastAction = 'skip';
        this.lastDamageToPlayer = 0;
        this.lastDamageToEnemy = 0;
        warnDevelopment('Enemy has no usable JSON skill and no safe fallback action. Turn skipped.');
        return {
          didEnemyAct: false,
          damageToPlayer: 0,
          damageToEnemy: 0,
          healEnemy: 0,
          energyDelta: 0,
          reward: 0,
          done: false,
        };
      }

      enemyAction = fallbackAction;
      const reason = this.actions.length === 0
        ? 'no JSON skills defined'
        : 'no JSON skills were usable this tick';
      warnDevelopment(`Using fallback action "${enemyAction.id}" because ${reason}.`);
    }

    const outcome = resolveEnemyAction(enemyAction, input.enemy, input.player);
    damageToPlayer = outcome.damageToPlayer;
    healEnemy = outcome.healEnemy;
    energyDelta = outcome.energyDelta;
    this.lastAction = outcome.actionTag;

    const afterPlayerHp = clamp(beforePlayerHp - damageToPlayer, 0, input.player.maxHP);
    const afterEnemyHp = clamp(beforeEnemyHp + healEnemy, 0, input.enemy.maxHp);
    const nextEnemyEnergy = clamp(input.enemy.energy + energyDelta, 0, input.enemy.maxEnergy);

    reward = computeReward(
      beforePlayerHp,
      afterPlayerHp,
      beforeEnemyHp,
      afterEnemyHp,
      input.player.maxHP,
      input.enemy.maxHp,
    );

    this.lastDamageToPlayer = damageToPlayer;
    this.lastDamageToEnemy = 0;

    const done = afterPlayerHp <= 0 || afterEnemyHp <= 0;
    if (selectedSkillIndex >= 0) {
      const nextStateKey = buildStateKey(
        buildState(
          { ...input.player, hp: afterPlayerHp },
          { ...input.enemy, hp: afterEnemyHp, energy: nextEnemyEnergy },
          this.lastAction,
          this.lastDamageToPlayer,
          this.lastDamageToEnemy,
          this.kind,
        ),
        this.kind,
      );

      updateQ(
        this.qtable,
        stateKey,
        selectedSkillIndex,
        reward,
        nextStateKey,
        DEFAULT_PARAMS,
        done,
        this.actions.length,
      );
    }

    return {
      didEnemyAct: true,
      enemyAction,
      damageToPlayer,
      damageToEnemy: 0,
      healEnemy,
      energyDelta,
      reward,
      done,
    };
  }

  endEncounter(): void {
    this.qtable.clear();
    this.lastAction = 'none';
    this.lastDamageToEnemy = 0;
    this.lastDamageToPlayer = 0;
  }
}

export function createEncounterController(config: EncounterConfig): EncounterController {
  return new EncounterController(config);
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

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toMsFromAtkSpeed(value: number, fallback: number): number {
  if (!Number.isFinite(value) || value <= 0) return fallback;
  if (value <= 10) return Math.round(value * 1000);
  return Math.round(value);
}

function warnDevelopment(message: string): void {
  const isDev = (() => {
    try {
      return Boolean(import.meta.env.DEV);
    } catch {
      return true;
    }
  })();

  if (isDev) {
    console.warn(`[CombatAI] ${message}`);
  }
}
