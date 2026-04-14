import Button from "../ui/Button";
import {
  closeIcon,
  lootBg,
} from '@/src/assets'
import Terminal from "./Terminal";
import { LootInventoryTree } from "@/src/components/game-ui/Inventory/LootInventoryTree/LootInventoryTree";
import { InventoryNode } from "@/src/game/types/inventory.types";
import { useState, Ref } from "react";
import { MerchantInventoryTree } from "./Inventory/MerchantInventoryTree/MerchantInventoryTree";
import { useSceneStore } from "@/src/game/store";

interface RightSideBarProps {
  onClose?: () => void;
  onItemTransferred?: (item: InventoryNode) => void;
  lootInventoryRef?: Ref<{ 
    getItems: (nodeIds: string[]) => InventoryNode[],
    removeItems: (nodeIds: string[]) => void 
  }>;
  atVillage?: boolean;
  Merchant?: string;
}

export function RightSideBar({ onClose, onItemTransferred, lootInventoryRef, atVillage, Merchant }: RightSideBarProps){
  const [loot, setLoot] = useState(true) 
  const scene = useSceneStore(s => s.scene)

  return (
    <div className="flex flex-col h-full w-80 border" style={{ backgroundImage: `url(${lootBg})`, backgroundSize: 'cover' }}>
      <div className="flex flex-row-reverse bg-[#23100a] border">
        <Button variant="icon-only-btn" icon={closeIcon} iconSize={25} onClick={onClose}/>
      </div>
        {/* <div className="flex-1">
          <MerchantInventoryTree onItemBought={onItemTransferred}/>
        </div> */}

      {scene == 'village' ? 
        <div className="flex-1">
          {/* <LootInventoryTree onItemTransferred={onItemTransferred} ref={lootInventoryRef}/> */}
          <MerchantInventoryTree onItemBought={onItemTransferred}/>
        </div>
      : 
        <div className="flex h-100 w-full text-5xl justify-center items-center text-zinc-500">
          Not in village...
        </div>
      }
      <div className="flex-1 overflow-hidden">
        <Terminal/>
      </div>
    </div>
  );
}
