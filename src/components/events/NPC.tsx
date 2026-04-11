import bs from '../../assets/npcs/blacksmith.png'
import { useNPCStore } from "@/src/game/store"
import Button from '../ui/Button'
import { useShallow } from 'zustand/shallow'

export default function NPC(){
  const { displayNPC, npc, currentDialogueIndex, toggleDisplayNPC, nextDialogue, previousDialogue } = useNPCStore(
    useShallow(s => ({
      displayNPC: s.displayNPC,
      npc: s.npc,
      currentDialogueIndex: s.currentDialogueIndex,
      toggleDisplayNPC: s.toggleDisplayNPC,
      nextDialogue: s.nextDialogue,
      previousDialogue: s.previousDialogue,
    }))
  )

  if (!displayNPC || !npc) return null

  const currentDialogue = npc.dialogues[currentDialogueIndex]

  return (
    <div className="absolute flex items-center justify-center z-6 h-full w-full">
      <div onClick={() => console.log("NEXT")} className="relative flex w-6/7 h-6/7">
        
        <div>
          <img className="absolute bottom-20 right-0 w-100 h-100" src={npc.npcImg || bs}/>
        </div>
        <div className="absolute flex flex-col w-full h-40 p-3 bottom-0 rounded-2xl bg-header border">
          <span className="text-base mb-2">{npc.name}</span>
          <span className="overflow-y-auto mb-1 font-[code1] text-1xl">{currentDialogue?.dialogue || "..."}</span>
          <div className='flex flex-row-reverse mr-10 gap-2'>
            <Button 
              variant='icon-only-btn' 
              text="Next" 
              onClick={nextDialogue}
            />
            <Button 
              variant='icon-only-btn' 
              text='Back' 
              onClick={previousDialogue}
            />
            <Button 
              variant='icon-only-btn' 
              text='Close' 
              onClick={() => toggleDisplayNPC(false)}
            />
          </div>
        </div>
      </div>
    </div>
  )  
}