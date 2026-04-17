export type WorldEncounterKind = "enemy" | "boss" | null;

type PickWorldEncounterKindInput = {
  enemyCount: number;
  bossCount: number;
  enemyChance?: number;
  rng?: () => number;
};

function normalizeCount(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.floor(value));
}

function clampChance(value: number): number {
  if (!Number.isFinite(value)) {
    return 0.9;
  }
  return Math.max(0, Math.min(1, value));
}

export function pickWorldEncounterKind(input: PickWorldEncounterKindInput): WorldEncounterKind {
  const enemyCount = normalizeCount(input.enemyCount);
  const bossCount = normalizeCount(input.bossCount);
  const hasEnemies = enemyCount > 0;
  const hasBosses = bossCount > 0;

  if (!hasEnemies && !hasBosses) {
    return null;
  }
  if (hasEnemies && !hasBosses) {
    return "enemy";
  }
  if (!hasEnemies && hasBosses) {
    return "boss";
  }

  const chance = clampChance(input.enemyChance ?? 0.9);
  const rng = input.rng ?? Math.random;
  return rng() < chance ? "enemy" : "boss";
}

