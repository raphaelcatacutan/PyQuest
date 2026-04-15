import mpData from '../json/mps.json'
import { MPData, MachineProblem } from '../types/mp.types'

/**
 * 
 *  Guide Database
 */

export const MachineProblems: MPData = mpData as MPData

const FALLBACK_PROBLEM: MachineProblem = {
  problem: "No machine problem is available for this scene yet.",
  correct_code: "print('No machine problem is available for this scene yet.')",
  expected_output: "No machine problem is available for this scene yet.",
  reward: {
    xpDropMin: 0,
    xpDropMax: 0,
    coinDropMin: 0,
    coinDropMax: 0,
    weapons: [],
    armors: [],
    consumables: [],
  },
};

export const getRandomMPByScene = (scene: string): MachineProblem => {
  const problemsForLevel = MachineProblems[scene];
  if (!Array.isArray(problemsForLevel) || problemsForLevel.length === 0) {
    return FALLBACK_PROBLEM;
  }

  const randomIndex = Math.floor(Math.random() * problemsForLevel.length);
  return problemsForLevel[randomIndex] ?? FALLBACK_PROBLEM;
}
