import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Tutorial, TutorialTest } from "../types/tutorial.types";
import { Tutorials } from "../data/tutorial";
import { useEditorStore } from "./editorStore";
import { useBountyQuestStore } from "./bountyQuestStore";

/**
 * 
 *  Tutorial Store
 */

interface TutorialStoreProps {
  player_id: string;
  hasStoredProgress: boolean;
  isTutorial: boolean;
  currentPhaseIndex: number;
  currentInstructionIndex: number;
  instruction: string;
  sequence: Tutorial[];
  blockedReason: string;
  isCompleted: boolean;

  enableNextButton: boolean;

  toggleIsTutorial: (state?: boolean) => void;
  setInstruction: (instruction: string) => void;
  setSequence: (sequence: Tutorial[]) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipToPhase: (phaseIndex: number) => void;
  toggleEnableNextButton: (state?: boolean) => void;
  setProgress: (phaseIndex: number, instructionIndex: number) => void;
  startGameLoop: (increment?: number) => void;
  clearTutorial: () => void;
}

const getInstructionByIndexes = (
  sequence: Tutorial[],
  phaseIndex: number,
  instructionIndex: number,
) => sequence[phaseIndex]?.instructions[instructionIndex]?.message || "";

const resolvePhaseIndexFromIncrement = (increment: number | undefined, sequence: Tutorial[]) => {
  const maxPhaseIndex = Math.max(sequence.length - 1, 0);
  const normalizedIncrement = typeof increment === "number" && increment > 0 ? increment : 1;
  return Math.min(normalizedIncrement - 1, maxPhaseIndex);
};

const validateTutorialTest = (test: TutorialTest, code: string) => {
  const normalizedCode = code.trim();

  if (!normalizedCode) {
    return false;
  }

  if (test.mode === "contains-all") {
    return test.patterns.every((pattern) => normalizedCode.includes(pattern));
  }

  return test.patterns.every((pattern) => new RegExp(pattern, "m").test(normalizedCode));
};

const resetToPhaseStart = (sequence: Tutorial[], phaseIndex: number) => ({
  currentPhaseIndex: phaseIndex,
  currentInstructionIndex: 0,
  instruction: getInstructionByIndexes(sequence, phaseIndex, 0),
  blockedReason: "",
  enableNextButton: true,
});

const clampIndex = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const useTutorialStore = create<TutorialStoreProps>()(
  persist(
    (set, get) => ({
      player_id: "",
      hasStoredProgress: false,
      isTutorial: false,
      currentPhaseIndex: 0,
      currentInstructionIndex: 0,
      instruction: Tutorials[0]?.instructions[0]?.message || "",
      sequence: Tutorials,
      blockedReason: "",
      isCompleted: false,

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
          instruction: sequence[0]?.instructions[0]?.message || "",
          blockedReason: "",
          enableNextButton: true,
          isCompleted: false,
        });
      },

      nextStep: () => {
        const { currentPhaseIndex, currentInstructionIndex, sequence } = get();
        const currentPhase = sequence[currentPhaseIndex];
        const currentStep = currentPhase?.instructions[currentInstructionIndex];

        if (!currentPhase || !currentStep) return;

        if (currentStep.test) {
          const currentCode = useEditorStore.getState().activeCode;
          const passed = validateTutorialTest(currentStep.test, currentCode);

          if (!passed) {
            set({
              blockedReason: currentStep.test.errorMessage,
              enableNextButton: false,
            });
            return;
          }
        }

        if (currentInstructionIndex < currentPhase.instructions.length - 1) {
          const nextInstructionIndex = currentInstructionIndex + 1;
          set({
            currentInstructionIndex: nextInstructionIndex,
            instruction: currentPhase.instructions[nextInstructionIndex]?.message || "",
            blockedReason: "",
            enableNextButton: true,
            isCompleted: false,
            hasStoredProgress: true,
          });
        } else {
          const isFreeRoamPhase = currentPhase.phase === "phase-7";
          if (!isFreeRoamPhase) {
            useBountyQuestStore.getState().setHeader("New bounty quests are available.");
            useBountyQuestStore.getState().toggleDisplayBountyQuest(true);
          }

          set({
            isTutorial: false,
            blockedReason: "",
            enableNextButton: true,
            isCompleted: true,
            hasStoredProgress: true,
          });
        }
      },

      previousStep: () => {
        const { currentPhaseIndex, currentInstructionIndex, sequence } = get();

        if (currentInstructionIndex > 0) {
          const prevInstructionIndex = currentInstructionIndex - 1;
          set({
            currentInstructionIndex: prevInstructionIndex,
            instruction: sequence[currentPhaseIndex]?.instructions[prevInstructionIndex]?.message || "",
            blockedReason: "",
            enableNextButton: true,
            isCompleted: false,
          });
        } else if (currentPhaseIndex > 0) {
          const prevPhase = sequence[currentPhaseIndex - 1];
          const lastInstructionIndex = prevPhase?.instructions.length - 1 || 0;
          set({
            currentPhaseIndex: currentPhaseIndex - 1,
            currentInstructionIndex: lastInstructionIndex,
            instruction: prevPhase?.instructions[lastInstructionIndex]?.message || "",
            blockedReason: "",
            enableNextButton: true,
            isCompleted: false,
          });
        }
      },

      skipToPhase: (phaseIndex: number) => {
        const { sequence } = get();
        if (phaseIndex >= 0 && phaseIndex < sequence.length) {
          set({
            ...resetToPhaseStart(sequence, phaseIndex),
            isCompleted: false,
          });
        }
      },

      toggleEnableNextButton: (state) => set((s) => ({ enableNextButton: state ?? !s.enableNextButton })),

      setProgress: (phaseIndex, instructionIndex) => {
        const { sequence } = get();
        const safePhaseIndex = clampIndex(phaseIndex, 0, Math.max(sequence.length - 1, 0));
        const maxInstructionIndex = Math.max((sequence[safePhaseIndex]?.instructions.length || 1) - 1, 0);
        const safeInstructionIndex = clampIndex(instructionIndex, 0, maxInstructionIndex);
        set({
          currentPhaseIndex: safePhaseIndex,
          currentInstructionIndex: safeInstructionIndex,
          instruction: getInstructionByIndexes(sequence, safePhaseIndex, safeInstructionIndex),
          blockedReason: "",
          enableNextButton: true,
        });
      },

      startGameLoop: (increment) => {
        const {
          sequence,
          hasStoredProgress,
          currentPhaseIndex,
          currentInstructionIndex,
          isCompleted,
        } = get();

        if (!hasStoredProgress) {
          set({
            currentPhaseIndex: 0,
            currentInstructionIndex: 0,
            instruction: getInstructionByIndexes(sequence, 0, 0),
            blockedReason: "",
            enableNextButton: true,
            isCompleted: false,
            isTutorial: true,
          });
          return;
        }

        const incrementPhaseIndex = resolvePhaseIndexFromIncrement(increment, sequence);
        const safeStoredPhaseIndex = clampIndex(currentPhaseIndex, 0, Math.max(sequence.length - 1, 0));
        const storedPhaseLength = sequence[safeStoredPhaseIndex]?.instructions.length || 1;
        const safeStoredInstructionIndex = clampIndex(currentInstructionIndex, 0, Math.max(storedPhaseLength - 1, 0));
        const shouldAdvanceFromIncrement = safeStoredPhaseIndex < incrementPhaseIndex;

        const phaseIndexToUse = shouldAdvanceFromIncrement ? incrementPhaseIndex : safeStoredPhaseIndex;
        const instructionIndexToUse = shouldAdvanceFromIncrement ? 0 : safeStoredInstructionIndex;

        const shouldOpenTutorial = shouldAdvanceFromIncrement || !isCompleted;

        set({
          currentPhaseIndex: phaseIndexToUse,
          currentInstructionIndex: instructionIndexToUse,
          instruction: getInstructionByIndexes(sequence, phaseIndexToUse, instructionIndexToUse),
          blockedReason: "",
          enableNextButton: true,
          isCompleted: shouldAdvanceFromIncrement ? false : isCompleted,
          isTutorial: shouldOpenTutorial,
        });
      },

      clearTutorial: () => {
        set({
          isTutorial: false,
          currentPhaseIndex: 0,
          currentInstructionIndex: 0,
          instruction: "",
          sequence: Tutorials,
          blockedReason: "",
          enableNextButton: true,
          isCompleted: false,
        });
      },
    }),
    {
      name: "player-tutorial-default",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        player_id: state.player_id,
        currentPhaseIndex: state.currentPhaseIndex,
        currentInstructionIndex: state.currentInstructionIndex,
        isCompleted: state.isCompleted,
      }),
    },
  ),
);

export const loadTutorialProfile = async (playerId: string) => {
  if (!playerId) return;

  const storageKey = `${playerId}-tutorial`;
  const existingData = localStorage.getItem(storageKey);

  let hasStoredProgress = false;
  if (existingData) {
    try {
      const parsed = JSON.parse(existingData) as {
        state?: {
          currentPhaseIndex?: unknown;
          currentInstructionIndex?: unknown;
          isCompleted?: unknown;
        };
      };

      hasStoredProgress =
        Number.isInteger(parsed?.state?.currentPhaseIndex) &&
        Number.isInteger(parsed?.state?.currentInstructionIndex) &&
        typeof parsed?.state?.isCompleted === "boolean";
    } catch {
      hasStoredProgress = false;
    }
  }

  if (existingData && !hasStoredProgress) {
    localStorage.removeItem(storageKey);
  }

  useTutorialStore.persist.setOptions({
    name: storageKey,
  });

  if (!hasStoredProgress) {
    useTutorialStore.setState({
      player_id: playerId,
      hasStoredProgress: false,
      isTutorial: false,
      currentPhaseIndex: 0,
      currentInstructionIndex: 0,
      instruction: getInstructionByIndexes(Tutorials, 0, 0),
      sequence: Tutorials,
      blockedReason: "",
      isCompleted: false,
      enableNextButton: true,
    });
    return;
  }

  await useTutorialStore.persist.rehydrate();

  const { sequence, currentPhaseIndex, currentInstructionIndex, isCompleted } = useTutorialStore.getState();
  const safePhaseIndex = clampIndex(currentPhaseIndex, 0, Math.max(sequence.length - 1, 0));
  const maxInstructionIndex = Math.max((sequence[safePhaseIndex]?.instructions.length || 1) - 1, 0);
  const safeInstructionIndex = clampIndex(currentInstructionIndex, 0, maxInstructionIndex);

  useTutorialStore.setState({
    player_id: playerId,
    hasStoredProgress: true,
    currentPhaseIndex: safePhaseIndex,
    currentInstructionIndex: safeInstructionIndex,
    instruction: getInstructionByIndexes(sequence, safePhaseIndex, safeInstructionIndex),
    blockedReason: "",
    enableNextButton: true,
    isCompleted: Boolean(isCompleted),
  });
};

export const resetTutorialPersist = () => {
  useTutorialStore.persist.setOptions({
    name: "player-tutorial-default",
  });
};