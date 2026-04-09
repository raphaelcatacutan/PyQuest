export interface Metrics {
  playerId: string;
  playtime: number;   // TODO: BigInt? Cannot case math methods
  lastPlayed: number;

  sessionCount: number;
  totalDamageTaken: number;
  totalDeaths: number;

  errorPerLevel: Record<number, number>;
  consumablesUsedPerLevel: Record<number, number>;
  enemiesDefeatedPerLevel: Record<number, number>;
  bossesDefeatedPerLevel: Record<number, number>;
  coinsEarnedPerLevel: Record<number, number>; 
  coinsSpentPerLevel: Record<number, number>; 
  xpGainedPerLevel: Record<number, number>;
  deathsPerLevel: Record<number, number>;
  
  firstEntry: boolean;
  
  // TODO: energySpentPerLevel
}