import { create } from "zustand";
import { Tutorial } from "../types/tutorial.types";
import { Tutorials } from "../data/tutorial";

/**
 * 
 *  Tutorial Store
 */

interface TutorialStoreProps {
  isTutorial: boolean;
  currentPhaseIndex: number;
  currentInstructionIndex: number;
  instruction: string;
  sequence: Tutorial[];

  enableNextButton: boolean;

  toggleIsTutorial: (state?: boolean) => void;
  setInstruction: (instruction: string) => void;
  setSequence: (sequence: Tutorial[]) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipToPhase: (phaseIndex: number) => void;
  toggleEnableNextButton: (state?: boolean) => void;
  clearTutorial: () => void;
}

export const useTutorialStore = create<TutorialStoreProps>((set, get) => ({
  isTutorial: false,
  currentPhaseIndex: 0,
  currentInstructionIndex: 0,
  instruction: Tutorials[0]?.instructions[0] || '',
  sequence: Tutorials,

  enableNextButton: true,

  toggleIsTutorial: (state?) => {
    set((prev) => ({
      isTutorial: state !== undefined ? state : !prev.isTutorial,
    }));
  },

  setInstruction: (instruction: string) => {
    set({ instruction });
  },

  setSequence: (sequence: Tutorial[]) => {
    set({
      sequence,
      currentPhaseIndex: 0,
      currentInstructionIndex: 0,
      instruction: sequence[0]?.instructions[0] || '',
    });
  },

  nextStep: () => {
    const { currentPhaseIndex, currentInstructionIndex, sequence } = get();
    const currentPhase = sequence[currentPhaseIndex];

    if (!currentPhase) return;

    // Check if there are more instructions in current phase
    if (currentInstructionIndex < currentPhase.instructions.length - 1) {
      set({
        currentInstructionIndex: currentInstructionIndex + 1,
        instruction: currentPhase.instructions[currentInstructionIndex + 1],
      });
    }
    // Move to next phase if available
    else if (currentPhaseIndex < sequence.length - 1) {
      set({
        currentPhaseIndex: currentPhaseIndex + 1,
        currentInstructionIndex: 0,
        instruction: sequence[currentPhaseIndex + 1]?.instructions[0] || '',
      });
    }
    // Tutorial complete
    else {
      set({ isTutorial: false });
    }
  },

  previousStep: () => {
    const { currentPhaseIndex, currentInstructionIndex, sequence } = get();

    if (currentInstructionIndex > 0) {
      set({
        currentInstructionIndex: currentInstructionIndex - 1,
        instruction: sequence[currentPhaseIndex]?.instructions[currentInstructionIndex - 1] || '',
      });
    } else if (currentPhaseIndex > 0) {
      const prevPhase = sequence[currentPhaseIndex - 1];
      const lastInstructionIndex = prevPhase?.instructions.length - 1 || 0;
      set({
        currentPhaseIndex: currentPhaseIndex - 1,
        currentInstructionIndex: lastInstructionIndex,
        instruction: prevPhase?.instructions[lastInstructionIndex] || '',
      });
    }
  },

  skipToPhase: (phaseIndex: number) => {
    const { sequence } = get();
    if (phaseIndex >= 0 && phaseIndex < sequence.length) {
      set({
        currentPhaseIndex: phaseIndex,
        currentInstructionIndex: 0,
        instruction: sequence[phaseIndex]?.instructions[0] || '',
      });
    }
  },

  toggleEnableNextButton: (state) => set((s) => ({ enableNextButton: state ?? !s.enableNextButton })),

  clearTutorial: () => {
    set({
      isTutorial: false,
      currentPhaseIndex: 0,
      currentInstructionIndex: 0,
      instruction: '',
      sequence: Tutorials,
    });
  },
}));