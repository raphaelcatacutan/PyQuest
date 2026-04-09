import { Action, QTable } from './types';

export type QLearningParams = {
  alpha: number;
  gamma: number;
  epsilon: number;
};

export function ensureQRow(qtable: QTable, key: string, actionCount: number): number[] {
  const existing = qtable.get(key);
  if (existing && existing.length === actionCount) return existing;
  const row = new Array(actionCount).fill(0);
  qtable.set(key, row);
  return row;
}

export function selectActionIndex(
  qtable: QTable,
  key: string,
  actions: Action[],
  validIndices: number[],
  epsilon: number
): number {
  const row = ensureQRow(qtable, key, actions.length);
  if (validIndices.length === 0) return 0;

  if (Math.random() < epsilon) {
    return validIndices[Math.floor(Math.random() * validIndices.length)];
  }

  let best = validIndices[0];
  let bestValue = row[best];
  for (let i = 1; i < validIndices.length; i++) {
    const idx = validIndices[i];
    const value = row[idx];
    if (value > bestValue) {
      bestValue = value;
      best = idx;
    } else if (value === bestValue && Math.random() < 0.5) {
      best = idx;
    }
  }

  return best;
}

export function updateQ(
  qtable: QTable,
  stateKey: string,
  actionIndex: number,
  reward: number,
  nextStateKey: string,
  params: QLearningParams,
  terminal: boolean,
  actionCount: number
): void {
  const row = ensureQRow(qtable, stateKey, actionCount);
  const current = row[actionIndex] ?? 0;
  let target = reward;

  if (!terminal) {
    const nextRow = ensureQRow(qtable, nextStateKey, actionCount);
    const maxNext = Math.max(...nextRow);
    target = reward + params.gamma * maxNext;
  }

  row[actionIndex] = current + params.alpha * (target - current);
}
