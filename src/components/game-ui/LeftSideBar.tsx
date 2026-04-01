import { PlayerInventoryTree } from "@/src/components/game-ui/PlayerInventoryTree/PlayerInventoryTree"
import { useState } from "react"
import Button from "../ui/Button"
import bagIcon from "@/public/assets/icons/bag.svg?url" 
import coinsIcon from "@/public/assets/icons/coins.svg?url"
import leatherBg from "@/public/assets/inventory_bg.png" // adjust path to your image 

export default function LeftSideBar(){
  const [inv, toggleInv] = useState(false)
  
  const coin = 0;

  return (
    <div className="relative h-full flex flex-row">
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${inv ? 'max-w-96' : 'max-w-0'}`} style={{ backgroundImage: `url(${leatherBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: "repeat" }}>
        <div className="relative p-5 h-full flex flex-col">
          <div className="flex-1">
            <PlayerInventoryTree/>
          </div>
          <div className="pt-1 pb-1">
            <img src={coinsIcon} className="w-7 h-7 inline"/> 
            {coin}
          </div>
        </div>
      </div>

      <Button variant="bag-btn" icon={bagIcon} iconSize={20} onClick={() => toggleInv(prev => !prev)}/>
    </div>
  )
}