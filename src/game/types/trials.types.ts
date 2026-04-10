import { LootDrop } from "./loot.types";

export type DifficultyType = 'easy' | 'medium' | 'hard' | ''

export interface DebugProblem {
  difficulty: DifficultyType;
  incorrectCode: string;
  correctCode: string;
  expectedOutput: string;
  reward: LootDrop;
}

export interface Trials {
  playerId: string;
  
  inTrials: boolean;
  mode: DifficultyType;
  debugProblem: string;

  currEasy: number;
  maxEasy: number;

  currMedium: number;
  maxMedium: number;

  currHard: number;
  maxHard: number;

  currAttempt: number;
  maxAttempts: number;
}