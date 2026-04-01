import Button from "../ui/Button";
import closeIcon from "@/public/assets/icons/close.svg?url"
import lootBg from "@/public/assets/loot_bg.png?url"
import Terminal from "./Terminal";
import { LootInventoryTree } from "./LootInventoryTree";
import { useState } from "react";


interface RightSideBarProps {
  onClose?: () => void
}

export function RightSideBar({ onClose }: RightSideBarProps){
  const [loot, setLoot] = useState(true) 

  return (
    <div className="flex flex-col h-full w-80 border" style={{ backgroundImage: `url(${lootBg})`, backgroundSize: 'cover' }}>
      <div className="flex flex-row-reverse bg-[#261c13] border">
        <Button variant="icon-only-btn" icon={closeIcon} iconSize={25} onClick={onClose}/>
      </div>

      {loot ? 
        <div className="flex-1 shrink-0">
          <LootInventoryTree/>
        </div>
      : 
        <div className="flex h-100 w-full text-5xl justify-center items-center text-zinc-500">
          No loot found...
        </div>
      }
      <div className="flex-1 overflow-hidden">
        <Terminal messages={["[BATTLE_LOG]: You defeated a goblin! 76 exp rewarded.", "HI"]}/>
      </div>
    </div>
  );
}
