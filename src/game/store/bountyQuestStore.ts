import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Quests } from "../data/quests";
import { useKillTrackerStore } from "./killTrackerStore";

export interface QuestItem {
  questId: string;
  description: string;
  isCompleted: boolean;
  targetId?: string;       // e.g., 'slime'
  requiredAmount?: number; // e.g., 5
}

// The structure is an object where the key is the level (string) 
// and the value is an array of QuestItems
export interface QuestData {
  [level: string]: QuestItem[];
}

interface BountyQuestProps {
  player_id: string;
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
  checkQuestProgress: () => void;
  resetQuest: () => void;
  refreshQuest: () => void;
}

export const useBountyQuestStore = create<BountyQuestProps>()(
  persist(
    (set) => ({
      player_id: "",
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

      checkQuestProgress: () => set((state) => {
        const currentLevelStr = state.questLevel.toString();
        const currentLevelQuests = state.allQuests[currentLevelStr] || [];
        const killCounts = useKillTrackerStore.getState().killCounts;

        const updatedQuests = currentLevelQuests.map((q) => {
          // If it's already done, skip
          if (q.isCompleted) return q;

          // If it's a kill quest, check the tracker
          if (q.targetId && q.requiredAmount) {
            const currentKills = killCounts[q.targetId] || 0;
            if (currentKills >= q.requiredAmount) {
              return { ...q, isCompleted: true };
            }
          }
          return q;
        });

        return {
          allQuests: {
            ...state.allQuests,
            [currentLevelStr]: updatedQuests
          }
        };
      }),

      resetQuest: () => set({ 
        questLevel: 1, 
        header: "Active Bounties",
        // Note: You might want to reset allQuests completion status here too
      }),

      refreshQuest: () => set({ allQuests: Quests })
    }),
    {
      name: "player-bounty-default",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true
    }
  )
);

export const loadBountyProfile = async (playerId: string) => {
  if (!playerId) return;

  const storageKey = `${playerId}-bounties`

  const existingData = localStorage.getItem(storageKey);
  const isNewPlayer = !existingData;

  useBountyQuestStore.persist.setOptions({
    name: `${playerId}-bounties`,
  });

  if (isNewPlayer) {
    useBountyQuestStore.setState({ allQuests: Quests });
  }

  await useBountyQuestStore.persist.rehydrate();

  useBountyQuestStore.setState({ player_id: playerId });

  console.log(`Successfully loaded bounty quests for: ${playerId}`)
};

export const resetBountyPersist = () => {
  useBountyQuestStore.persist.setOptions({
    name: "player-bounty-default",
  });
};