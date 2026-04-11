import innKeeperImg from "@/src/assets/npcs/innkeeper3.png"
import { useTutorialStore } from "@/src/game/store"
import Button from '../ui/Button'
import { useShallow } from 'zustand/shallow'


export default function Tutorial(){
  const { isTutorial, instruction, nextStep, previousStep, toggleIsTutorial } = useTutorialStore(
    useShallow(s => ({
      isTutorial: s.isTutorial,
      instruction: s.instruction,
      nextStep: s.nextStep,
      previousStep: s.previousStep,
      toggleIsTutorial: s.toggleIsTutorial,
    }))
  )

  if (!isTutorial) return null

  return (
    <div className="absolute flex items-center justify-center z-6 h-full w-full">
      <div onClick={() => nextStep()} className="relative flex w-6/7 h-6/7">
        
        <div>
          <img className="absolute bottom-20 right-0 w-100 h-100" src={innKeeperImg}/>
        </div>
        <div className="absolute flex flex-col w-full h-40 p-3 bottom-0 rounded-2xl bg-header border border-blue-500">
          <span className="text-base mb-2">Marta the Innkeeper</span>
          <span className="overflow-y-auto mb-1 font-[code1] text-1xl whitespace-pre-wrap [tab-size:4]">{instruction || "..."}</span>
          <div className='flex flex-row-reverse mr-10 gap-2'>
            {/* <Button 
              variant='icon-only-btn' 
              text="Next" 
              onClick={nextStep}
            />
            <Button 
              variant='icon-only-btn' 
              text='Back' 
              onClick={previousStep}
            />
            <Button 
              variant='icon-only-btn' 
              text='Close' 
              onClick={() => toggleIsTutorial(false)}
            /> */}
          </div>
        </div>
      </div>
    </div>
  )  
}