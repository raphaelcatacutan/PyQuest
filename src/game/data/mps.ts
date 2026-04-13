import mpData from '../json/mps.json'
import { MPData, MachineProblem } from '../types/mp.types'

/**
 * 
 *  Guide Database
 */

export const MachineProblems: MPData = mpData as MPData

export const getRandomMPByScene = (scene: string): MachineProblem => {
  // 1. Access the array for the specific level
  const problemsForLevel = MachineProblems[scene];

  // 3. Generate a random index based on the length of THAT specific level's array
  const randomIndex = Math.floor(Math.random() * problemsForLevel.length);

  // 4. Return the random problem
  return problemsForLevel[randomIndex];
}