import { PlayerInventoryTree } from "@/src/components/game-ui/Inventory/PlayerInventoryTree/PlayerInventoryTree"
import { useState } from "react"
import Button from "../ui/Button"
import { InventoryNode } from "@/src/game/types/inventory.types"
import {
  bagIcon,
  coinsIcon,
  playerInventoryBg,
} from '@/src/assets'
import { usePlayerStore } from "@/src/game/store"

interface LeftSideBarProps {
  playerInventory: InventoryNode[];
  deleteInventoryItem: (nodeId: string) => void;
  renameInventoryItem: (nodeId: string, newName: string) => void;
  moveInventoryItem: (dragIds: string[], parentId: string | null, index: number) => void;
  addInventoryItem?: (parentId: string | undefined, item: InventoryNode) => void;
}

export default function LeftSideBar({ playerInventory, deleteInventoryItem, renameInventoryItem, moveInventoryItem, addInventoryItem }: LeftSideBarProps){
  const [inv, toggleInv] = useState(false)
  const coins = usePlayerStore(s => s.coins);

  return (
    <div className="relative h-full flex flex-row">
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${inv ? 'max-w-96' : 'max-w-0'}`} style={{ backgroundImage: `url(${playerInventoryBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: "repeat" }}>
        <div className="relative p-5 h-full flex flex-col">
          <div className="flex-1">
            <PlayerInventoryTree 
              inventory={playerInventory} 
              onDeleteItem={deleteInventoryItem}
              onRenameItem={renameInventoryItem}
              onMoveItem={moveInventoryItem}
              onAddItem={addInventoryItem}
            />
          </div>
          <div className="pt-1 pb-1">
            <img src={coinsIcon} draggable={false} className="w-7 h-7 inline"/> 
            {coins}
          </div>
        </div>
      </div>

      <Button variant="bag-btn" icon={bagIcon} iconSize={20} onClick={() => toggleInv(prev => !prev)}/>
    </div>
  )
}