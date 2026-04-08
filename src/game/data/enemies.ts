import { SceneTypes } from '../types/scene.types';
import { Enemy } from '../types/enemy.types';
import enemyData from '../json/enemies.json'
import { 
  slimeEnemy, 
  skeletonHeadEnemy 
} from '@/src/assets'

/**
 * 
 *  Enemy Database
 */

export const Enemies: Record<string, Enemy> = enemyData as Record<string, Enemy>


export const DungeonEnemies: Record<string, Enemy> = {
  
}

export const ForestEnemies: Record<string, Enemy> = {

}

// export const DungeonEnemies: Record<string, Enemy> = {
//   slime: {
//     id: "slime",
//     name: "Slime",
//     description: "A gelatinous blob that bounces around.",
//     enemyImg: slimeEnemy,
//     hp: 100,
//     maxHp: 100,
//     energy: 50,
//     maxEnergy: 50,
//     def: 1,
//     maxDef: 1,
//     skills: [
//       { name: "Bouncing Tackle", dmg: 10, energyCost: 15 }
//     ],
//     dmg: 8,
//     atkSpeed: 1,
//     critDmg: 0,
//     critChance: 0,
//     evasion: 0.05,
//     spawnRate: 0.6,
//     lootDrop: {
//       coinDropMin: 0,
//       coinDropMax: 0,
//       xpDropMin: 0,
//       xpDropMax: 0,
//       weapons: [],
//       armors: [],
//       consumables: [],
//     },
//   },
//   skeleton: {
//     id: "skeleton",
//     name: "Skeleton Archer",
//     description: "An undead skeleton wielding a bow.",
//     enemyImg: skeletonHeadEnemy,
//     hp: 80,
//     maxHp: 80,
//     energy: 100,
//     maxEnergy: 100,
//     def: 2,
//     maxDef: 2,
//     skills: [
//       { name: "Bone Arrow", dmg: 25, energyCost: 30 }
//     ],
//     dmg: 15,
//     atkSpeed: 1.2,
//     critDmg: 0.5,
//     critChance: 0.1,
//     evasion: 0.1,
//     spawnRate: 0.4,
//     lootDrop: {
//       coinDropMin: 0,
//       coinDropMax: 0,
//       xpDropMin: 0,
//       xpDropMax: 0,
//       weapons: [],
//       armors: [],
//       consumables: [],
//     },
//   }
//   // TODO: Add more enemies
// }

export const DungeonBosses: Record<string, Enemy> = {

}

/* INDEXES */
export const EnemiesByScene: Record<SceneTypes, Record<string, Enemy> | null> = {
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

export const BossesByScene: Record<SceneTypes, Record<string, Enemy> | null> = { // TODO: Remove null once initialized
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