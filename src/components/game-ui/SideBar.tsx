import { PlayerInventoryTree } from "@/src/components/game-ui/PlayerInventoryTree/PlayerInventoryTree"
import { useState } from "react"
import Button from "../ui/Button"
import bagIcon from "@/public/assets/icons/bag.svg?url" 
import coinsIcon from "@/public/assets/icons/coins.svg?url" 

export default function SideBar(){
  const [inv, toggleInv] = useState(false)
  
  const coin = 12345;

  return (
    <div className="h-full flex flex-row">
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${inv ? 'max-w-96' : 'max-w-0'}`}>
        <div className="relative bg-black p-5 h-full">
          <PlayerInventoryTree />
          <div className="border pl-5 pr-5 pt-1 pb-1">
            <img src={coinsIcon} className="w-7 h-7 inline"/> 
            {coin}
          </div>
        </div>
      </div>

      <Button variant="bag-btn" icon={bagIcon} iconSize={20} onClick={() => toggleInv(prev => !prev)}/>
    </div>
  )
}