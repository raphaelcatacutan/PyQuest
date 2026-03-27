import { PlayerInventoryTree } from "@/src/components/game-ui/PlayerInventoryTree/PlayerInventoryTree"
import { useState } from "react"


export default function SideBar(){
  const [inv, toggleInv] = useState(false)
  
  return (
    <div className="h-full flex flex-row">
      {inv && 
      <div className="relative bg-black p-5">
        <PlayerInventoryTree />
      </div>
      }

      <button
        className="relative w-10 bg-amber-700 p-0 border-none outline-none"
        onClick={() => toggleInv(prev => !prev)}
      >
        <div>
          B A G
        </div>
      </button>
    </div>
  )
}