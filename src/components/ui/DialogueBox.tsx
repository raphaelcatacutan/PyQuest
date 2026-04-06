import Button from "./Button"
import { closeIcon } from "@/src/assets"
import { useDialogueBoxStore } from "@/src/game/store/dialogueBoxStore"
import { useShallow } from "zustand/shallow"

export default function DialogueBox(){
  const toggleDisplayDialogueBox = useDialogueBoxStore(s => s.toggleDisplayDialogueBox)

  const { header, body } = useDialogueBoxStore(
    useShallow((s) => ({
      header: s.header,
      body: s.body
    }))
  )

  return (
    <div className="absolute flex w-full h-dvh z-99 bg-black/50 justify-center items-center">
      <div className="w-400 h-150 border-5 border-[#a34c24] rounded-xl p-10 m-80 overflow-y-auto bg-[#ffd06c]">
        <div className="flex flex-row-reverse w-full right-0" title="Close">
          <Button variant="icon-only-btn" icon={closeIcon} iconSize={30} onClick={toggleDisplayDialogueBox}/>
        </div>
        <span className="block text-4xl text-black mb-5">
          {header}
        </span>
        <span className="text-2xl text-zinc-800">
          {body}  
        </span>
      </div>
    </div>
  )
}