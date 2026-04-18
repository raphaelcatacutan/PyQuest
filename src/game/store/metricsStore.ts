import { create } from "zustand";
import { Metrics, LevelStats, TestResult } from "../types/metrics.types";
import { persist, createJSONStorage } from "zustand/middleware";
import { SceneTypes } from "../types/scene.types";

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
  trackDamageInflicted: (dmg: number) => void;
  trackDeath: () => void;
  trackEnemyEncountered: (level: number) => void;
  trackEnemyDefeated: (level: number) => void;
  trackBossEncountered: (level: number) => void;
  trackBossDefeated: (level: number) => void;
  trackCoinsEarned: (coins: number, level: number) => void;
  trackCoinsSpent: (coins: number, level: number) => void;
  trackXpGained: (xp: number, level: number) => void;
  trackWeaponUsed: (level: number) => void;
  trackArmorUsed: (level: number) => void;
  trackConsumableUsed: (level: number) => void;
  trackError: (level: number) => void;
  trackCombo: (comboCount: number, level: number) => void;
  trackTimeAliveInBattle: (timeMs: number, level: number) => void;
  trackTimeAliveInExploration: (timeMs: number, level: number) => void;
  trackMpSolved: (level: number) => void;
  trackGoTo: (scene: SceneTypes) => void;
  trackSyntaxError: (errorType: string) => void;
  recordTestResult: (testId: string, result: TestResult, isPreTest: boolean) => void;
  incrementSessionCount: () => void;
  recordLastPlayed: () => void;
  resetMetrics: () => void;
}



const createEmptyLevelStats = (): LevelStats => ({
  mpSolved: 0,
  errors: 0,
  highestCombo: 0,
  longestTimeAliveInBattle: 0,
  longestTimeAliveDuringExploration: 0,
  weaponsUsed: 0,
  armorsWore: 0,
  consumablesUsed: 0,
  enemiesEncountered: 0,
  enemiesDefeated: 0,
  bossesEncountered: 0,
  bossesDefeated: 0,
  coinsEarned: 0,
  coinsSpent: 0,
  xpGained: 0,
  deaths: 0,
});

export const useMetricStore = create<MetricStoreProps>()(
  persist((set) => ({
    playerId: "",
    playtime: 0,
    lastPlayed: 0,
    sessionCount: 0,
    totalDamageTaken: 0,
    totalDamageInflicted: 0,
    totalDeaths: 0,
    levelData: {},
    testData: {
      preTest: {},
      postTest: {},
      learningGain: 0,
    },
    goToFrequency: {} as Record<SceneTypes, number>,
    syntaxErrorFrequency: {} as Record<string, number>,

    setPlayerId: (playerId: string) =>
      set(() => ({
        playerId,
      })),

    trackPlaytime: (msElapsed: number) =>
      set((state) => ({
        playtime: state.playtime + msElapsed,
      })),

    trackDamageTaken: (dmg: number) =>
      set((state) => ({
        totalDamageTaken: state.totalDamageTaken + dmg,
      })),

    trackDamageInflicted: (dmg: number) =>
      set((state) => ({
        totalDamageInflicted: state.totalDamageInflicted + dmg,
      })),

    trackDeath: () =>
      set((state) => ({
        totalDeaths: state.totalDeaths + 1,
      })),

    trackEnemyEncountered: (level: number) =>
      set((state) => {
        const newLevelData = { ...state.levelData };
        newLevelData[level] = newLevelData[level] ?? createEmptyLevelStats();
        newLevelData[level].enemiesEncountered += 1;
        return { levelData: newLevelData };
      }),

    trackEnemyDefeated: (level: number) =>
      set((state) => {
        const newLevelData = { ...state.levelData };
        newLevelData[level] = newLevelData[level] ?? createEmptyLevelStats();
        newLevelData[level].enemiesDefeated += 1;
        return { levelData: newLevelData };
      }),

    trackBossEncountered: (level: number) =>
      set((state) => {
        const newLevelData = { ...state.levelData };
        newLevelData[level] = newLevelData[level] ?? createEmptyLevelStats();
        newLevelData[level].bossesEncountered += 1;
        return { levelData: newLevelData };
      }),

    trackBossDefeated: (level: number) =>
      set((state) => {
        const newLevelData = { ...state.levelData };
        newLevelData[level] = newLevelData[level] ?? createEmptyLevelStats();
        newLevelData[level].bossesDefeated += 1;
        return { levelData: newLevelData };
      }),

    trackCoinsEarned: (coins: number, level: number) =>
      set((state) => {
        const newLevelData = { ...state.levelData };
        newLevelData[level] = newLevelData[level] ?? createEmptyLevelStats();
        newLevelData[level].coinsEarned += coins;
        return { levelData: newLevelData };
      }),

    trackCoinsSpent: (coins: number, level: number) =>
      set((state) => {
        const newLevelData = { ...state.levelData };
        newLevelData[level] = newLevelData[level] ?? createEmptyLevelStats();
        newLevelData[level].coinsSpent += coins;
        return { levelData: newLevelData };
      }),

    trackXpGained: (xp: number, level: number) =>
      set((state) => {
        const newLevelData = { ...state.levelData };
        newLevelData[level] = newLevelData[level] ?? createEmptyLevelStats();
        newLevelData[level].xpGained += xp;
        return { levelData: newLevelData };
      }),

    trackWeaponUsed: (level: number) =>
      set((state) => {
        const newLevelData = { ...state.levelData };
        newLevelData[level] = newLevelData[level] ?? createEmptyLevelStats();
        newLevelData[level].weaponsUsed += 1;
        return { levelData: newLevelData };
      }),

    trackArmorUsed: (level: number) =>
      set((state) => {
        const newLevelData = { ...state.levelData };
        newLevelData[level] = newLevelData[level] ?? createEmptyLevelStats();
        newLevelData[level].armorsWore += 1;
        return { levelData: newLevelData };
      }),

    trackConsumableUsed: (level: number) =>
      set((state) => {
        const newLevelData = { ...state.levelData };
        newLevelData[level] = newLevelData[level] ?? createEmptyLevelStats();
        newLevelData[level].consumablesUsed += 1;
        return { levelData: newLevelData };
      }),

    trackError: (level: number) =>
      set((state) => {
        const newLevelData = { ...state.levelData };
        newLevelData[level] = newLevelData[level] ?? createEmptyLevelStats();
        newLevelData[level].errors += 1;
        return { levelData: newLevelData };
      }),

    trackCombo: (comboCount: number, level: number) =>
      set((state) => {
        const newLevelData = { ...state.levelData };
        newLevelData[level] = newLevelData[level] ?? createEmptyLevelStats();
        newLevelData[level].highestCombo = Math.max(newLevelData[level].highestCombo, comboCount);
        return { levelData: newLevelData };
      }),

    trackTimeAliveInBattle: (timeMs: number, level: number) =>
      set((state) => {
        const newLevelData = { ...state.levelData };
        newLevelData[level] = newLevelData[level] ?? createEmptyLevelStats();
        newLevelData[level].longestTimeAliveInBattle = Math.max(newLevelData[level].longestTimeAliveInBattle, timeMs);
        return { levelData: newLevelData };
      }),

    trackTimeAliveInExploration: (timeMs: number, level: number) =>
      set((state) => {
        const newLevelData = { ...state.levelData };
        newLevelData[level] = newLevelData[level] ?? createEmptyLevelStats();
        newLevelData[level].longestTimeAliveDuringExploration = Math.max(newLevelData[level].longestTimeAliveDuringExploration, timeMs);
        return { levelData: newLevelData };
      }),

    trackMpSolved: (level: number) =>
      set((state) => {
        const newLevelData = { ...state.levelData };
        newLevelData[level] = newLevelData[level] ?? createEmptyLevelStats();
        newLevelData[level].mpSolved += 1;
        return { levelData: newLevelData };
      }),

    trackGoTo: (scene: SceneTypes) =>
      set((state) => {
        const newGoToFrequency = { ...state.goToFrequency };
        newGoToFrequency[scene] = (newGoToFrequency[scene] ?? 0) + 1;
        return { goToFrequency: newGoToFrequency };
      }),

    trackSyntaxError: (errorType: string) =>
      set((state) => {
        const newSyntaxErrorFrequency = { ...state.syntaxErrorFrequency };
        newSyntaxErrorFrequency[errorType] = (newSyntaxErrorFrequency[errorType] ?? 0) + 1;
        return { syntaxErrorFrequency: newSyntaxErrorFrequency };
      }),

    recordTestResult: (testId: string, result: TestResult, isPreTest: boolean) =>
      set((state) => {
        const newTestData = { ...state.testData };
        const targetTest = isPreTest ? newTestData.preTest : newTestData.postTest;
        targetTest[testId] = result;
        
        // Calculate learning gain if both tests exist
        if (Object.keys(newTestData.preTest).length > 0 && Object.keys(newTestData.postTest).length > 0) {
          const preAvg = Object.values(newTestData.preTest).reduce((sum, t) => sum + t.score, 0) / Object.keys(newTestData.preTest).length;
          const postAvg = Object.values(newTestData.postTest).reduce((sum, t) => sum + t.score, 0) / Object.keys(newTestData.postTest).length;
          newTestData.learningGain = postAvg - preAvg;
        }
        
        return { testData: newTestData };
      }),

    incrementSessionCount: () =>
      set((state) => ({
        sessionCount: state.sessionCount + 1,
      })),

    recordLastPlayed: () =>
      set(() => ({
        lastPlayed: Date.now(),
      })),

    resetMetrics: () =>
      set(() => ({
        playtime: 0,
        lastPlayed: 0,
        sessionCount: 0,
        totalDamageTaken: 0,
        totalDamageInflicted: 0,
        totalDeaths: 0,
        levelData: {},
        testData: {
          preTest: {},
          postTest: {},
          learningGain: 0,
        },
        goToFrequency: {} as Record<SceneTypes, number>,
        syntaxErrorFrequency: {} as Record<string, number>,
      })),
  }),
  {
    name: "player-metrics-default",
    storage: createJSONStorage(() => localStorage),
    skipHydration: true
  }
))

export const loadMetricsProfile = async (playerId: string) => {
  if (!playerId) return;

  const storageKey = `${playerId}-metrics`;
  const existingData = localStorage.getItem(storageKey);
  const isNewPlayer = !existingData;

  useMetricStore.persist.setOptions({
    name: `${playerId}-metrics`,
  });

  if (isNewPlayer) {
    useMetricStore.setState({
      playerId,
      levelData: {},
      testData: { preTest: {}, postTest: {}, learningGain: 0 },
      goToFrequency: {} as Record<SceneTypes, number>,
      syntaxErrorFrequency: {} as Record<string, number>,
    });
  }

  await useMetricStore.persist.rehydrate();

  useMetricStore.setState({ playerId });

  console.log(`Successfully loaded metrics for: ${playerId}`);
};

export const resetMetricsPersist = () => {
  useMetricStore.persist.setOptions({
    name: "player-metrics-default",
  });
};