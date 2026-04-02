import { useState } from "react"
import CodeEditor from "@/src/components/game-ui/CodeEditor"
import { RightSideBar } from "@/src/components/game-ui/RightSideBar"
import LeftSideBar from "@/src/components/game-ui/LeftSideBar"
import Button from "@/src/components/ui/Button"
import exitIcon from "@/public/assets/icons/exit.svg?url"
import rightPanelIcon from "@/public/assets/icons/right_panel.svg?url"
import mapBg from "@/public/assets/maps/dungeon.png?url"
import showToast from "@/src/components/ui/Toast"
import { InventoryNode } from "@/src/domain/inventory"
// import mapBg from "@/public/assets/maps/labyrinth.png?url"

const InitialPlayerInventory: InventoryNode[] = [
  { 
    id: "root",
    kind: "folder", 
    name: "User", 
    children: [
      { id: "wp_folder", kind: "folder", name: "Weapons", children: [] },   
      { id: "arm_folder", kind: "folder", name: "Armors", children: [] },   
      { id: "cons_folder", kind: "folder", name: "Consumables", children: [] }
    ]
  },
  { id: "misc_folder", kind: "folder", name: "Miscellaneous", children: [] },
  { id: "pickedup_folder", kind: "folder", name: "Picked-up", children: [] },
];

export default function GamePage() {
  const [rightPanel, toggleRightPanel] = useState(false)
  const [playerInventory, setPlayerInventory] = useState(InitialPlayerInventory)

  function handleExitGame(){
    showToast({ variant: 'info', message: 'Welcome, adventurer!' });
  }

  function handleItemTransferred(item: InventoryNode) {
    // Add the transferred item to the "Picked-up" folder
    const addToPickedUp = (items: InventoryNode[]): InventoryNode[] => {
      return items.map(folderItem => {
        if (folderItem.id === "pickedup_folder" && folderItem.kind === "folder") {
          return {
            ...folderItem,
            children: [...folderItem.children, { ...item, id: `item-${Date.now()}` }]
          };
        }
        if (folderItem.kind === "folder") {
          return { ...folderItem, children: addToPickedUp(folderItem.children) };
        }
        return folderItem;
      });
    };
    setPlayerInventory(addToPickedUp(playerInventory));
  }

  return (
    <div className="relative flex flex-col w-full h-full">

      <div className="flex flex-row-reverse h-10 p-1 bg-header shadow-[0_0_2px_rgba(255,255,255,1)]">{/* nav div */}
        <Button variant="icon-only-btn" icon={exitIcon} iconSize={30} title="Exit" onClick={handleExitGame}></Button>
      </div> 

      <div className="relative flex flex-row h-full p-5"> {/* body div */}

        <div className="relative w-150">  {/* CodeEditor div */}
          <CodeEditor/>
        </div>

        <div className="relative flex h-full w-full" style={{ backgroundImage: `url(${mapBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: "repeat" }}> {/* scene */}
          <LeftSideBar playerInventory={playerInventory} setPlayerInventory={setPlayerInventory}/>
          {!rightPanel ? 
          <div className="absolute right-1 top-1">
            <Button variant="icon-only-btn" icon={rightPanelIcon} iconSize={25} onClick={() => toggleRightPanel(rightPanel => !rightPanel)}/> 
          </div>
          : 
          <div className="absolute flex right-0 h-full">
            <RightSideBar onClose={() => toggleRightPanel(false)} onItemTransferred={handleItemTransferred}/>
          </div>
          }
        </div>
      </div>
    </div>
  )
}
