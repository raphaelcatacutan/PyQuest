export type PhaseType = 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4' | 'phase-5' | 'phase-6';

export type TutorialStepType = 'message' | 'test';

export type TutorialTestMode = 'contains-all' | 'regex-all';

export interface TutorialTest {
  id: string;
  mode: TutorialTestMode;
  patterns: string[];
  errorMessage: string;
}

export interface TutorialStep {
  type: TutorialStepType;
  message: string;
  test?: TutorialTest;
}

export interface RawTutorialStep {
  type?: TutorialStepType;
  message?: string;
  text?: string;
  test?: TutorialTest;
}

export interface Tutorial {
  phase: PhaseType;
  instructions: TutorialStep[];
}

export interface RawTutorial {
  phase: PhaseType;
  instructions: Array<string | RawTutorialStep>;
}
