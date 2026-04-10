import { SceneTypes } from "../types/scene.types";
import { Enemy } from "../types/enemy.types";
import enemyData from "../json/enemies.json";

/**
 *
 *  Enemy Database
 */

export const Enemies: Record<string, Enemy> = enemyData as Record<string, Enemy>;

export const getEnemiesByLocation = (scene: SceneTypes): Record<string, Enemy> => {
  return Object.fromEntries(
    Object.entries(Enemies).filter(([, enemy]) => {
      return scene in enemy.location;
    }),
  );
};
