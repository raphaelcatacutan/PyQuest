export type DungeonDifficultyTypes = 'easy' | 'medium' | 'hard'

export interface MachineProblem {
  problem: string;
  correct_code: string;
  expected_output: string;
}