import { DungeonDifficultyTypes, MachineProblem } from "../types/dungeon.types"

const EasyDungeonMP: Record<string, MachineProblem> = {
  // Basic Arithmetic Problems
  easy_1: {
    problem: '',
    correct_code: '',
    expected_output: ''
  },
  easy_2: {
    problem: '',
    correct_code: '',
    expected_output: ''
  },
  easy_3: {
    problem: '',
    correct_code: '',
    expected_output: ''
  },
  easy_4: {
    problem: '',
    correct_code: '',
    expected_output: ''
  },
  easy_5: {
    problem: '',
    correct_code: '',
    expected_output: ''
  },
}

const MediumDungeonMP: Record<string, MachineProblem> = {
  // Medium Machine Problems
  medium_1: {
    problem: '',
    correct_code: '',
    expected_output: ''
  },
  medium_2: {
    problem: '',
    correct_code: '',
    expected_output: ''
  },
  medium_3: {
    problem: '',
    correct_code: '',
    expected_output: ''
  },
  medium_4: {
    problem: '',
    correct_code: '',
    expected_output: ''
  },
  medium_5: {
    problem: '',
    correct_code: '',
    expected_output: ''
  },
}

const HardDungeonMP: Record<string, MachineProblem> = {
  // Data Structure Problems
  hard_1: {
    problem: '',
    correct_code: '',
    expected_output: ''
  },
  hard_2: {
    problem: '',
    correct_code: '',
    expected_output: ''
  },
  hard_3: {
    problem: '',
    correct_code: '',
    expected_output: ''
  }
}

export const MPsByDifficulty: Record<DungeonDifficultyTypes, Record<string, MachineProblem>> = {
  easy: EasyDungeonMP,
  medium: MediumDungeonMP,
  hard: HardDungeonMP
}