import { SceneTypes } from "./scene.types";

export interface LevelStats {
  mpSolved: number;
  errors: number;
  highestCombo: number;
  longestTimeAliveInBattle: number;
  longestTimeAliveDuringExploration: number;

  weaponsUsed: number;
  armorsWore: number;
  consumablesUsed: number;

  enemiesEncountered: number;
  enemiesDefeated: number;
  bossesEncountered: number;
  bossesDefeated: number;

  coinsEarned: number;
  coinsSpent: number;
  xpGained: number;
  deaths: number;
}

export interface TestResult {
  score: number;           // 0 to 100
  timeTaken: number;       // ms
  attempts: number;        // How many times they tried to run the code
  code: string;   // The final code they wrote (useful for manual review)
}

export interface Metrics {
  playerId: string;
  playtime: number; // Total ms
  lastPlayed: number; // Timestamp
  sessionCount: number;

  testData: {
    preTest: Record<string, TestResult>;
    postTest: Record<string, TestResult>;
    
    learningGain: number; // Post-score minus Pre-score
  };
  
  levelData: Record<number, LevelStats>; 
  
  goToFrequency: Record<SceneTypes, number>;
  syntaxErrorFrequency: Record<string, number>; // e.g., { "IndentationError": 5, "TabError": 2 }
  
  totalDamageTaken: number;
  totalDamageInflicted: number;
  totalDeaths: number;
}