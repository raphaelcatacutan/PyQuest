import { useKillTrackerStore } from "@/src/game/store";
import Button from "./Button";
import { closeIcon } from "@/src/assets";
import { useBountyQuestStore } from "@/src/game/store/bountyQuestStore";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export default function BountyQuest() {
  const { 
    displayBountyQuest, 
    toggleDisplayBountyQuest, 
    questLevel, 
    allQuests, 
    toggleQuest,
    checkQuestProgress, 
    header 
  } = useBountyQuestStore(
    useShallow((s) => ({
      displayBountyQuest: s.displayBountyQuest,
      toggleDisplayBountyQuest: s.toggleDisplayBountyQuest,
      questLevel: s.questLevel,
      allQuests: s.allQuests,
      toggleQuest: s.toggleQuest,
      checkQuestProgress: s.checkQuestProgress,
      header: s.header,
    }))
  );
  const killCounts = useKillTrackerStore(s => s.killCounts)
  
  useEffect(() => {
    if (displayBountyQuest) {
      checkQuestProgress();
    }
  }, [displayBountyQuest, checkQuestProgress]);
  
  const currentQuests = allQuests[questLevel.toString()] || [];
  
  if (!displayBountyQuest) return null;

  return (
    <div className="absolute flex w-full h-dvh z-99 bg-black/50 justify-center items-center">
      <div className="w-400 h-150 border-5 border-[#a34c24] rounded-xl p-10 m-80 overflow-y-auto bg-[#ffd06c]">
        <div className="flex flex-row-reverse w-full right-0" title="Close">
          <Button
            variant="icon-only-btn"
            icon={closeIcon}
            iconSize={30}
            onClick={() => toggleDisplayBountyQuest()}
          />
        </div>
        
        {/* Level Indicator - helpful for the player to see which level they are on */}
        <div className="text-xl font-bold text-[#a34c24] mb-1">
          LEVEL {questLevel}
        </div>

        <span className="block text-4xl text-black mb-5">
          {header}
        </span>

        <ul className="text-3xl text-black truncate">
          {currentQuests.map((quest) => (
            <li key={quest.questId} className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={quest.isCompleted}
                readOnly // Better practice for non-interactable inputs
                className="pointer-events-none accent-[#a34c24]" 
                style={{ transform: "scale(1.8)" }}
              />
              <span
                className="pl-5"
                style={{
                  textDecoration: quest.isCompleted ? "line-through" : "none",
                  opacity: quest.isCompleted ? 0.6 : 1, // Visual cue for completion
                }}
              >
                {/* {quest.description} */}
                {/* {quest.description} ({killCounts[quest.targetId] || 0} / {quest.requiredAmount}) */}
                {quest.description} 
                {/* ⚡️ Only show the counter if targetId exists */}
                {quest.targetId && quest.requiredAmount && (
                  <span className="ml-2 text-2xl text-[#a34c24]">
                    ({killCounts[quest.targetId] || 0} / {quest.requiredAmount})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {/* Fallback if no quests exist for this level */}
        {currentQuests.length === 0 && (
          <p className="text-black italic">No quests available for this level.</p>
        )}
      </div>
    </div>
  );
}