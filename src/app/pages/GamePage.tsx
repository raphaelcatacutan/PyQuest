import { useState, useEffect } from "react"
import { useRef } from "react"
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
// import skeletonEnemy from  "@/public/assets/enemies/skeleton_head.png?url"
import slimeEnemy from  "@/public/assets/enemies/slime.png?url"
import EnemyEncounter from "@/src/components/events/EnemyEncounter"

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
  const [enemy, setEnemy] = useState(true)

  const lootInventoryRef = useRef<{ 
    getItems: (nodeIds: string[]) => InventoryNode[],
    removeItems: (nodeIds: string[]) => void
  } | null>(null)

  useEffect(() => {
    // Listen for drop events from loot inventory
    const handleLootDrop = (event: Event) => {
      const customEvent = event as CustomEvent<string[]>;
      const nodeIds = customEvent.detail;
      console.log("GamePage received loot-dropped-to-player event for nodeIds:", nodeIds);
      
      // Get the items from loot inventory and transfer them
      if (lootInventoryRef.current?.getItems) {
        const items = lootInventoryRef.current.getItems(nodeIds);
        console.log("Retrieved items:", items);
        items.forEach(item => {
          handleItemTransferred(item);
        });
        
        // Remove items from loot after transfer
        if (lootInventoryRef.current?.removeItems) {
          lootInventoryRef.current.removeItems(nodeIds);
          console.log("Removed items from loot");
        }
      }
    };

    window.addEventListener('loot-dropped-to-player', handleLootDrop);
    return () => window.removeEventListener('loot-dropped-to-player', handleLootDrop);
  }, []);

  function handleExitGame(){
    showToast({ variant: 'info', message: 'Welcome, adventurer!' });
  }

  function handleItemTransferred(item: InventoryNode) {
    console.log("GamePage.handleItemTransferred called with item:", item);
    
    // Use a unique counter to ensure each transferred item has a unique ID
    const uniqueId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log("Generated unique ID:", uniqueId);
    
    // Use functional state update to avoid stale closure issues
    setPlayerInventory(prevInventory => {
      // Add the transferred item to the "Picked-up" folder
      const addToPickedUp = (items: InventoryNode[]): InventoryNode[] => {
        return items.map(folderItem => {
          if (folderItem.id === "pickedup_folder" && folderItem.kind === "folder") {
            console.log("Found Picked-up folder, adding item:", item.name);
            return {
              ...folderItem,
              children: [...folderItem.children, { ...item, id: uniqueId }]
            };
          }
          if (folderItem.kind === "folder" && folderItem.children) {
            return { ...folderItem, children: addToPickedUp(folderItem.children) };
          }
          return folderItem;
        });
      };
      
      const newInventory = addToPickedUp(prevInventory);
      console.log("New inventory after adding item:", newInventory);
      const pickedUpFolder = newInventory.find(i => i.kind === "folder" && i.id === "pickedup_folder");
      if (pickedUpFolder && pickedUpFolder.kind === "folder") {
        console.log("Picked-up folder children count:", pickedUpFolder.children.length);
      }
      return newInventory;
    });
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
          <div className="absolute flex w-full h-full"> {/* Events render */}

            {enemy && (
              <EnemyEncounter enemyName={"Slime"} health={80} maxHealth={100} enemyImg={slimeEnemy}/>
            )}
            {/* <div className="relative flex h-full w-full">
              <div>
                gh
                <div className="absolute flex top-4 left-1/2 -translate-x-1/2 w-48 bg-gray-800 border-2 border-gray-600 rounded h-8 overflow-hidden">
                  <div className="bg-red-600 h-full w-4/4 transition-all duration-300"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">75/100</span>
                </div>
              </div>

              <img src={slimeEnemy} className="w-80  justify-center items-center"></img>
            </div> */}
          </div>
          {!rightPanel ? 
          <div className="absolute right-1 top-1">
            <Button variant="icon-only-btn" icon={rightPanelIcon} iconSize={25} onClick={() => toggleRightPanel(rightPanel => !rightPanel)}/> 
          </div>
          : 
          <div className="absolute flex right-0 h-full">
            <RightSideBar onClose={() => toggleRightPanel(false)} onItemTransferred={handleItemTransferred} lootInventoryRef={lootInventoryRef}/>
          </div>
          }
        </div>
      </div>
    </div>
  )
}
