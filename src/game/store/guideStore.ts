import { create } from "zustand";

/**
 * 
 *  Tutorial Store
 */

interface Guide {
  targetId: string;
  text: string;
}

interface GuideStoreProps {
  isGuide: boolean;
  currentStep: number;
  steps: Guide[];
  toggleGuide: (state: boolean | null) => void;
  nextStep: () => void;
}

export const useGuideStore = create<GuideStoreProps>((set) => ({
  isGuide: false,
  currentStep: 0,
  steps: [
    { targetId: 'hp-bar', 
      text: "This is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero  is your health. Keep it above zero " 
    },
  ],
  toggleGuide: (state) => { 
    if (state != null){
      return set({ isGuide: state }) 
    } else {
      return set((s) => ({ isGuide: !s.isGuide, currentStep: 0 })) 
    } 
  },
  nextStep: () => set((state) => ({ 
    currentStep: Math.min(state.currentStep + 1, state.steps.length - 1) 
  })),
}))