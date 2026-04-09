import { create } from "zustand";
import { Metrics } from "../types/metrics.types";

/**
 * 
 *  Metrics Store
 */

interface MetricStoreProps extends Metrics {
  // Setters
  setPlayerId: (playerId: string) => void;
  
  // Metrics trackers
  trackPlaytime: (msElapsed: number) => void;
  trackDamageTaken: (dmg: number) => void;
  trackDeath: () => void;
  trackEnemyDefeated: (level: number) => void;
  trackBossDefeated: (level: number) => void;
  trackCoinsEarned: (coins: number, level: number) => void;
  trackCoinsSpent: (coins: number, level: number) => void;
  trackXpGained: (xp: number, level: number) => void;
  trackConsumableUsed: (level: number) => void;
  trackError: (level: number) => void;
  incrementSessionCount: () => void;
  recordLastPlayed: () => void;
}

const saveMetricsToLocalStorage = (playerId: string, metrics: Metrics) => {
  if (playerId) {
    localStorage.setItem(`metrics-${playerId}`, JSON.stringify(metrics));
  }
};

const loadMetricsFromLocalStorage = (playerId: string): Partial<Metrics> => {
  if (!playerId) return {};
  const saved = localStorage.getItem(`metrics-${playerId}`);
  return saved ? JSON.parse(saved) : {};
};

export const useMetricStore = create<MetricStoreProps>((set) => ({
  playerId: "",
  playtime: 0,
  lastPlayed: 0,
  sessionCount: 0,
  totalDamageTaken: 0,
  totalDeaths: 0,
  errorPerLevel: {},
  consumablesUsedPerLevel: {},
  enemiesDefeatedPerLevel: {},
  bossesDefeatedPerLevel: {},
  coinsEarnedPerLevel: {},
  coinsSpentPerLevel: {},
  xpGainedPerLevel: {},
  deathsPerLevel: {},
  firstEntry: true,

  setPlayerId: (playerId: string) =>
    set((state) => {
      // Save current player's metrics before switching
      if (state.playerId && state.playerId !== playerId) {
        saveMetricsToLocalStorage(state.playerId, {
          playerId: state.playerId,
          playtime: state.playtime,
          lastPlayed: state.lastPlayed,
          sessionCount: state.sessionCount,
          totalDamageTaken: state.totalDamageTaken,
          totalDeaths: state.totalDeaths,
          errorPerLevel: state.errorPerLevel,
          consumablesUsedPerLevel: state.consumablesUsedPerLevel,
          enemiesDefeatedPerLevel: state.enemiesDefeatedPerLevel,
          bossesDefeatedPerLevel: state.bossesDefeatedPerLevel,
          coinsEarnedPerLevel: state.coinsEarnedPerLevel,
          coinsSpentPerLevel: state.coinsSpentPerLevel,
          xpGainedPerLevel: state.xpGainedPerLevel,
          deathsPerLevel: state.deathsPerLevel,
          firstEntry: state.firstEntry,
        });
      }

      // Load new player's metrics
      const savedMetrics = loadMetricsFromLocalStorage(playerId);
      return {
        playerId,
        playtime: savedMetrics.playtime ?? 0,
        lastPlayed: savedMetrics.lastPlayed ?? 0,
        sessionCount: savedMetrics.sessionCount ?? 0,
        totalDamageTaken: savedMetrics.totalDamageTaken ?? 0,
        totalDeaths: savedMetrics.totalDeaths ?? 0,
        errorPerLevel: savedMetrics.errorPerLevel ?? {},
        consumablesUsedPerLevel: savedMetrics.consumablesUsedPerLevel ?? {},
        enemiesDefeatedPerLevel: savedMetrics.enemiesDefeatedPerLevel ?? {},
        bossesDefeatedPerLevel: savedMetrics.bossesDefeatedPerLevel ?? {},
        coinsEarnedPerLevel: savedMetrics.coinsEarnedPerLevel ?? {},
        coinsSpentPerLevel: savedMetrics.coinsSpentPerLevel ?? {},
        xpGainedPerLevel: savedMetrics.xpGainedPerLevel ?? {},
        deathsPerLevel: savedMetrics.deathsPerLevel ?? {},
        firstEntry: savedMetrics.firstEntry ?? true,
      };
    }),

  trackPlaytime: (msElapsed: number) =>
    set((state) => {
      const newPlaytime = state.playtime + msElapsed;
      const newState = { playtime: newPlaytime };
      saveMetricsToLocalStorage(state.playerId, { ...state, ...newState });
      return newState;
    }),

  trackDamageTaken: (dmg: number) =>
    set((state) => {
      const newState = { totalDamageTaken: state.totalDamageTaken + dmg };
      saveMetricsToLocalStorage(state.playerId, { ...state, ...newState });
      return newState;
    }),

  trackDeath: () =>
    set((state) => {
      const newState = { totalDeaths: state.totalDeaths + 1 };
      saveMetricsToLocalStorage(state.playerId, { ...state, ...newState });
      return newState;
    }),

  trackEnemyDefeated: (level: number) =>
    set((state) => {
      const newEnemiesDefeated = { ...state.enemiesDefeatedPerLevel };
      newEnemiesDefeated[level] = (newEnemiesDefeated[level] ?? 0) + 1;
      const newState = { enemiesDefeatedPerLevel: newEnemiesDefeated };
      saveMetricsToLocalStorage(state.playerId, { ...state, ...newState });
      return newState;
    }),

  trackBossDefeated: (level: number) =>
    set((state) => {
      const newBossesDefeated = { ...state.bossesDefeatedPerLevel };
      newBossesDefeated[level] = (newBossesDefeated[level] ?? 0) + 1;
      const newState = { bossesDefeatedPerLevel: newBossesDefeated };
      saveMetricsToLocalStorage(state.playerId, { ...state, ...newState });
      return newState;
    }),

  trackCoinsEarned: (coins: number, level: number) =>
    set((state) => {
      const newCoinsEarned = { ...state.coinsEarnedPerLevel };
      newCoinsEarned[level] = (newCoinsEarned[level] ?? 0) + coins;
      const newState = { coinsEarnedPerLevel: newCoinsEarned };
      saveMetricsToLocalStorage(state.playerId, { ...state, ...newState });
      return newState;
    }),

  trackCoinsSpent: (coins: number, level: number) =>
    set((state) => {
      const newCoinsSpent = { ...state.coinsSpentPerLevel };
      newCoinsSpent[level] = (newCoinsSpent[level] ?? 0) + coins;
      const newState = { coinsSpentPerLevel: newCoinsSpent };
      saveMetricsToLocalStorage(state.playerId, { ...state, ...newState });
      return newState;
    }),

  trackXpGained: (xp: number, level: number) =>
    set((state) => {
      const newXpGained = { ...state.xpGainedPerLevel };
      newXpGained[level] = (newXpGained[level] ?? 0) + xp;
      const newState = { xpGainedPerLevel: newXpGained };
      saveMetricsToLocalStorage(state.playerId, { ...state, ...newState });
      return newState;
    }),

  trackConsumableUsed: (level: number) =>
    set((state) => {
      const newConsumablesUsed = { ...state.consumablesUsedPerLevel };
      newConsumablesUsed[level] = (newConsumablesUsed[level] ?? 0) + 1;
      const newState = { consumablesUsedPerLevel: newConsumablesUsed };
      saveMetricsToLocalStorage(state.playerId, { ...state, ...newState });
      return newState;
    }),

  trackError: (level: number) =>
    set((state) => {
      const newErrors = { ...state.errorPerLevel };
      newErrors[level] = (newErrors[level] ?? 0) + 1;
      const newState = { errorPerLevel: newErrors };
      saveMetricsToLocalStorage(state.playerId, { ...state, ...newState });
      return newState;
    }),

  incrementSessionCount: () =>
    set((state) => {
      const newState = { sessionCount: state.sessionCount + 1 };
      saveMetricsToLocalStorage(state.playerId, { ...state, ...newState });
      return newState;
    }),

  recordLastPlayed: () =>
    set((state) => {
      const newState = { lastPlayed: Date.now() };
      saveMetricsToLocalStorage(state.playerId, { ...state, ...newState });
      return newState;
    }),
}))