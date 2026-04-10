import { DebugProblem } from "../types/trials.types";
import dpData from "../json/trials.json"

/**
 * 
 *  Trials Database
 */

export const DebugProblems: DebugProblem[] = dpData as DebugProblem[]

export const getDPByDifficulty = (difficulty: string): DebugProblem[] => {
  return DebugProblems.filter(problem => problem.difficulty === difficulty)
}