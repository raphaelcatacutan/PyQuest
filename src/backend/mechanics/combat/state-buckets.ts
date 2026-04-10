import { ActionTag, CombatantKind } from './types';

export type BucketedState = {
  pHp: number;
  eHp: number;
  eEnergy: number;
  pLevel: number;
  lastAction: ActionTag;
  phase?: number;
  pRecentDmg?: number;
  eRecentDmg?: number;
};

export function bucketHp(hp: number, maxHp: number): number {
  if (maxHp <= 0) return 0;
  const pct = hp / maxHp;
  if (pct <= 0.2) return 0;
  if (pct <= 0.4) return 1;
  if (pct <= 0.6) return 2;
  if (pct <= 0.8) return 3;
  return 4;
}

export function bucketEnergy(energy: number, maxEnergy: number): number {
  if (maxEnergy <= 0) return 0;
  const pct = energy / maxEnergy;
  if (pct <= 0.01) return 0;
  if (pct <= 0.25) return 1;
  if (pct <= 0.6) return 2;
  return 3;
}

export function bucketLevel(level: number): number {
  if (level <= 4) return 0;
  if (level <= 9) return 1;
  return 2;
}

export function bucketRecentDamage(damage: number, maxHp: number): number {
  if (maxHp <= 0) return 0;
  const pct = damage / maxHp;
  if (pct <= 0.01) return 0;
  if (pct <= 0.05) return 1;
  if (pct <= 0.15) return 2;
  return 3;
}

export function getPhase(hp: number, maxHp: number): number {
  if (maxHp <= 0) return 1;
  const pct = hp / maxHp;
  if (pct >= 0.7) return 1;
  if (pct >= 0.4) return 2;
  return 3;
}

export function buildStateKey(state: BucketedState, kind: CombatantKind): string {
  const base = [
    `pHP${state.pHp}`,
    `eHP${state.eHp}`,
    `eEN${state.eEnergy}`,
    `lvl${state.pLevel}`,
    `last${state.lastAction}`
  ];

  if (kind === 'boss') {
    base.push(`ph${state.phase ?? 1}`);
    base.push(`pD${state.pRecentDmg ?? 0}`);
    base.push(`eD${state.eRecentDmg ?? 0}`);
  }

  return base.join('|');
}
