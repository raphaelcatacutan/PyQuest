import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Quests } from "../data/quests";

export interface QuestItem {
  questId: string;
  description: string;
  isCompleted: boolean;
}

// The structure is an object where the key is the level (string) 
// and the value is an array of QuestItems
export interface QuestData {
  [level: string]: QuestItem[];
}

interface BountyQuestProps {
  displayBountyQuest: boolean;
  header: string;
  questLevel: number;
  allQuests: QuestData; // Our new dictionary structure
  
  // UI Actions
  toggleDisplayBountyQuest: (state?: boolean | null) => void;
  setHeader: (text: string) => void;
  
  // Quest Logic Actions
  incrementQuestLevel: () => void;
  setAllQuests: (data: QuestData) => void;
  toggleQuest: (questId: string) => void;
  resetQuest: () => void;
}

export const useBountyQuestStore = create<BountyQuestProps>()(
  persist(
    (set) => ({
      displayBountyQuest: false,
      header: "Complete tasks to proceed to next level",
      questLevel: 1,
      allQuests: Quests,

      toggleDisplayBountyQuest: (state) => 
        set((s) => ({ 
          displayBountyQuest: typeof state === 'boolean' ? state : !s.displayBountyQuest 
        })),
      
      setHeader: (text) => set({ header: text }),

      incrementQuestLevel: () => set((state) => ({ 
        questLevel: state.questLevel + 1 
      })),

      setAllQuests: (data) => set({ allQuests: data }),

      toggleQuest: (targetId) => set((state) => {
        const currentLevelStr = state.questLevel.toString();
        const currentLevelQuests = state.allQuests[currentLevelStr] || [];
        console.log(state.allQuests)
        return {
          allQuests: {
            ...state.allQuests, // Keep all other levels
            [currentLevelStr]: currentLevelQuests.map((q) =>
              q.questId === targetId ? { ...q, isCompleted: !q.isCompleted } : q
            )
          }
        };
      }),

      resetQuest: () => set({ 
        questLevel: 1, 
        header: "Active Bounties" 
        // Note: You might want to reset allQuests completion status here too
      }),
    }),
    {
      name: "player-bounty-default",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      // 🛡️ CRITICAL: Only persist the data to avoid circular JSON errors
      // partialize: (state) => ({
      //   questLevel: state.questLevel,
      //   allQuests: state.allQuests,
      //   header: state.header
      // }),
    }
  )
);

export const loadBountyProfile = async (playerId: string) => {
  if (!playerId) return;
  useBountyQuestStore.persist.setOptions({
    name: `${playerId}-bounties`,
  });
  await useBountyQuestStore.persist.rehydrate();

  console.log(`Successfully loaded inventory for: ${playerId}`)
};