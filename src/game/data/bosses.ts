import { Boss } from "../types/boss.types"
import bossData from '../json/bosses.json'
import { SceneTypes } from "../types/scene.types";

/**
 * 
 *  Boss Database
 */

export const Bosses: Record<string, Boss> = bossData as Record<string, Boss>;

export const getBossesByLocation = (scene: SceneTypes): Record<string, Boss> => {
  return Object.fromEntries(
    Object.entries(Bosses).filter(([_, boss]) => {
      return scene in boss.location;
    })
  );
};