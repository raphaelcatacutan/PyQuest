import innKeeperImg from "@/src/assets/npcs/innkeeper3.png"
import { useTutorialStore } from "@/src/game/store"
import { useShallow } from 'zustand/shallow'


export default function Tutorial(){
  const {
    isTutorial,
    instruction,
    nextStep,
    previousStep,
    toggleIsTutorial,
    blockedReason,
    currentInstructionIndex,
    currentPhaseIndex,
    sequence,
  } = useTutorialStore(
    useShallow(s => ({
      isTutorial: s.isTutorial,
      instruction: s.instruction,
      nextStep: s.nextStep,
      previousStep: s.previousStep,
      toggleIsTutorial: s.toggleIsTutorial,
      blockedReason: s.blockedReason,
      currentInstructionIndex: s.currentInstructionIndex,
      currentPhaseIndex: s.currentPhaseIndex,
      sequence: s.sequence,
    }))
  )

  if (!isTutorial) return null

  const currentPhase = sequence[currentPhaseIndex]
  const currentStep = currentPhase?.instructions[currentInstructionIndex]
  const isCheckpoint = currentStep?.type === 'test'

  return (
    <div className="absolute flex items-center justify-center z-6 h-full w-full">
      <div className="relative flex w-6/7 h-6/7">
        
        <div>
          <img className="absolute bottom-20 right-0 w-100 h-100" src={innKeeperImg}/>
        </div>
        <div className="absolute flex flex-col w-full h-40 p-3 bottom-0 rounded-2xl bg-header border border-blue-500">
          <div className="relative flex flex-col h-full">
            <span className="text-base mb-2">Marta the Innkeeper</span>
            {isCheckpoint && (
              <span className="text-xs mb-1 text-yellow-300 uppercase tracking-wide">Checkpoint</span>
            )}
            <span className="overflow-y-auto mb-1 font-[code1] text-1xl whitespace-pre-wrap [tab-size:4]">{instruction || "..."}</span>
            {blockedReason && (
              <span className="text-xs mb-1 text-red-300">{blockedReason}</span>
            )}
          </div>
          <div className='flex flex-row-reverse mr-10 gap-2'>
            <button
              className='rounded-lg border border-slate-500 px-3 py-1 text-sm hover:bg-slate-700 cursor-pointer'
              onClick={nextStep}
            >
              Next
            </button>
            <button
              className='rounded-lg border border-slate-500 px-3 py-1 text-sm hover:bg-slate-700 cursor-pointer'
              onClick={previousStep}
            >
              Back
            </button>
            <button
              className='rounded-lg border border-slate-500 px-3 py-1 text-sm hover:bg-slate-700 cursor-pointer'
              onClick={() => toggleIsTutorial(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )  
}