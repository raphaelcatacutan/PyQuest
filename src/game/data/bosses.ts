import { Boss } from "../types/boss.types"
import bossData from '../json/bosses.json'
import { SceneTypes } from "../types/scene.types";

/**
 * 
 *  Boss Database
 */

type BossWithOptionalRegen = Omit<Boss, "energyRegenPerSecond"> & {
  energyRegenPerSecond?: number;
};

function normalizeEnergyRegen(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  return 0;
}

const rawBosses = bossData as unknown as Record<string, BossWithOptionalRegen>;

export const Bosses: Record<string, Boss> = Object.fromEntries(
  Object.entries(rawBosses).map(([id, boss]) => [
    id,
    {
      ...boss,
      energyRegenPerSecond: normalizeEnergyRegen(boss.energyRegenPerSecond),
    },
  ]),
);

export const getBossesByLocation = (scene: SceneTypes): Record<string, Boss> => {
  return Object.fromEntries(
    Object.entries(Bosses).filter(([_, boss]) => {
      return scene in boss.location;
    })
  );
};
