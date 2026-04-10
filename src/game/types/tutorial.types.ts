type PhaseType = 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4' | 'phase-5' | 'phase-6';

export interface Tutorial {
  phase: PhaseType;
  instructions: string[];
}
