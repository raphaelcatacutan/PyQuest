import { MachineProblem, DungeonDifficultyTypes } from "../types/dungeon.types"
import mpData from "../json/dungeon.json"

/**
 * 
 *  Machine Problem Database
 */

export const MachineProblems: MachineProblem[] = mpData as MachineProblem[]

export const getMPByDifficulty = (diff: DungeonDifficultyTypes) => {
  return MachineProblems.filter(mp => mp.difficulty === diff);
}