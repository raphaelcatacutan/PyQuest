import { BossSceneTypes, EnemySceneTypes, SceneNameTypes } from '../types/scene.types';
import { Enemy } from '../types/enemy.types';
import { 
  slimeEnemy, 
  skeletonHeadEnemy 
} from '@/src/assets'

/**
 * 
 *  Enemy Database
 */

export const ForestEnemies: Record<string, Enemy> = {

}

export const DungeonEnemies: Record<string, Enemy> = {
  slime: {
    enemy_id: "1",
    enemy_name: "Slime",
    enemyImg: slimeEnemy,
    enemy_hp: 100,
    enemy_maxHp: 100,
    enemy_energy: 50,
    enemy_maxEnergy: 50,
    enemy_skills: [{ name: "Bouncing Tackle", dmg: 10 }]
  },
  skeleton: {
    enemy_id: "2",
    enemy_name: "Skeleton Archer",
    enemyImg: skeletonHeadEnemy,
    enemy_hp: 80,
    enemy_maxHp: 80,
    enemy_energy: 100,
    enemy_maxEnergy: 100,
    enemy_skills: [{ name: "Bone Arrow", dmg: 25 }]
  }
  // TODO: Add more enemies
}

export const DungeonBosses: Record<string, Enemy> = {

}

interface EnemiesCollection {
  [key: string]: Enemy;
}

/* INDEXES */
export const EnemiesByScene: Record<SceneNameTypes, Record<string, Enemy> | null> = {
  // forest: null,
  // swamp: null,
  // temple: null,
  // tundra: null, 
  // desert: null,
  // cemetery: null,
  // jungle: null,
  labyrinth: null,
  dungeon: DungeonEnemies,
  village: DungeonEnemies,
}

export const BossesByScene: Record<SceneNameTypes, Record<string, Enemy> | null> = { // TODO: Remove null once initialized
  // forest: null,
  // swamp: null,
  // temple: null,
  // tundra: null, 
  // desert: null,
  // cemetery: null,
  // jungle: null,
  labyrinth: null,
  dungeon: DungeonEnemies,
  village: null,
}