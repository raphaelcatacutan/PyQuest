import { SceneTypes } from "../types/scene.types";
import { Enemy } from "../types/enemy.types";
import enemyData from "../json/enemies.json";

/**
 *
 *  Enemy Database
 */

type EnemyWithOptionalRegen = Omit<Enemy, "energyRegenPerSecond"> & {
  energyRegenPerSecond?: number;
};

function normalizeEnergyRegen(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  return 0;
}

const rawEnemies = enemyData as unknown as Record<string, EnemyWithOptionalRegen>;

export const Enemies: Record<string, Enemy> = Object.fromEntries(
  Object.entries(rawEnemies).map(([id, enemy]) => [
    id,
    {
      ...enemy,
      energyRegenPerSecond: normalizeEnergyRegen(enemy.energyRegenPerSecond),
    },
  ]),
);

export const getEnemiesByLocation = (scene: SceneTypes): Record<string, Enemy> => {
  return Object.fromEntries(
    Object.entries(Enemies).filter(([, enemy]) => {
      return scene in enemy.location;
    }),
  );
};
