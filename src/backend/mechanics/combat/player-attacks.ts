import { PlayerAttackInput } from "./types";

const playerAttackQueue: PlayerAttackInput[] = [];

export function enqueuePlayerAttack(baseDamage: number, source = "player.attack"): void {
  if (!Number.isFinite(baseDamage) || baseDamage <= 0) {
    return;
  }

  playerAttackQueue.push({
    baseDamage,
    source,
  });
}

export function drainPlayerAttacks(): PlayerAttackInput[] {
  if (playerAttackQueue.length === 0) {
    return [];
  }

  return playerAttackQueue.splice(0, playerAttackQueue.length);
}

export function clearPlayerAttacks(): void {
  playerAttackQueue.length = 0;
}
