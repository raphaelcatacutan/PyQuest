import { DebugProblem, LabyrinthDifficultyTypes } from "../types/labyrinth.types"

/**
 * 
 *  Labyrinth Database
 */

const EasyLabyrinthDebugProbs: Record<string, DebugProblem> = {
  easy_1: {
    debug_problem: "",
    correct_code: ""
  },
  easy_2: {
    debug_problem: "",
    correct_code: ""
  },
  easy_3: {
    debug_problem: "",
    correct_code: ""
  },
  easy_4: {
    debug_problem: "",
    correct_code: ""
  },
  easy_5: {
    debug_problem: "",
    correct_code: ""
  }
}

const MediumLabyrinthDebugProbs: Record<string, DebugProblem> = {
  medium_1: {
    debug_problem: "",
    correct_code: ""
  },
  medium_2: {
    debug_problem: "",
    correct_code: ""
  },
  medium_3: {
    debug_problem: "",
    correct_code: ""
  },
  medium_4: {
    debug_problem: "",
    correct_code: ""
  },
  medium_5: {
    debug_problem: "",
    correct_code: ""
  }
}

const HardLabyrinthDebugProbs: Record<string, DebugProblem> = {
  hard_1: {
    debug_problem: "",
    correct_code: ""
  },
  hard_2: {
    debug_problem: "",
    correct_code: ""
  },
  hard_3: {
    debug_problem: "",
    correct_code: ""
  },
  hard_4: {
    debug_problem: "",
    correct_code: ""
  },
  hard_5: {
    debug_problem: "",
    correct_code: ""
  }
}

export const DebugByDifficulty: Record<LabyrinthDifficultyTypes, Record<string, DebugProblem>> = {
  easy: EasyLabyrinthDebugProbs,
  medium: MediumLabyrinthDebugProbs,
  hard: HardLabyrinthDebugProbs
}