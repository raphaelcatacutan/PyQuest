import { PlayerInventoryTree } from "@/src/components/game-ui/PlayerInventoryTree/PlayerInventoryTree"
import { useState } from "react"
import Button from "../ui/Button"


export default function SideBar(){
  const [inv, toggleInv] = useState(false)
  
  return (
    <div className="h-full flex flex-row">
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${inv ? 'max-w-96' : 'max-w-0'}`}>
        <div className="relative bg-black p-5">
          <PlayerInventoryTree />
        </div>
      </div>

      <Button text="BAG" onClick={() => toggleInv(prev => !prev)}/>
      
      {/* <button
        className="relative w-10 bg-amber-700 p-0 border-none outline-none"
        onClick={() => toggleInv(prev => !prev)}
      >
        <div>
          B A G
        </div>
      </button> */}
    </div>
  )
}