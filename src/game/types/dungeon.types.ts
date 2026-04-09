import { LootDrop } from "./loot.types";

export type DungeonDifficultyTypes = 'easy' | 'medium' | 'hard' | ''

export interface MachineProblem {
  difficulty: DungeonDifficultyTypes;
  problem: string;
  correct_code: string;
  expected_output: string;
  reward: LootDrop;
}

export interface Dungeon {
  playerId: string;
  
  inDungeon: boolean;
  mode: DungeonDifficultyTypes
  machineProblem: string;

  currEasy: number;
  maxEasy: number;

  currMedium: number;
  maxMedium: number;

  currHard: number;
  maxHard: number;

  currAttempt: number;
  maxAttempts: number;
}
