import { useState, useEffect } from "react"
import { useRef } from "react"
import CodeEditor from "@/src/components/game-ui/CodeEditor"
import { RightSideBar } from "@/src/components/game-ui/RightSideBar"
import LeftSideBar from "@/src/components/game-ui/LeftSideBar"
import Button from "@/src/components/ui/Button"
import exitIcon from "@/public/assets/icons/exit.svg?url"
import rightPanelIcon from "@/public/assets/icons/right_panel.svg?url"
import villageBg from "@/public/assets/maps/village1.png?url"
import showToast from "@/src/components/ui/Toast"
import { InventoryNode } from "@/src/domain/inventory"
import dmgHud from "@/public/assets/pain.png?url"
import slimeEnemy from "@/public/assets/enemies/slime.png?url"
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
  const [enemy, setEnemy] = useState(false)
  const [dmg, isDmg] = useState(false)
  const [loot, isLoot] = useState(true)
  const [inVillage, setInVillage] = useState(true)

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

        <div className="relative flex h-full w-full"> {/* scene */}
          <div className="absolute h-full z-99">
            <LeftSideBar playerInventory={playerInventory} setPlayerInventory={setPlayerInventory}/>
          </div>

          <div className="absolute flex w-full h-full z-1" style={{ backgroundImage: `url(${villageBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: "repeat" }}/>

          {/* Enemy Encounter */}
          {enemy && (
            <div className="absolute flex h-full w-full z-1"> 
              <EnemyEncounter enemyName={"Slime"} health={80} maxHealth={100} enemyImg={slimeEnemy}/>
            </div>
          )}

          {/* Dmg HUD */}
          {dmg && (
            <div className="absolute w-full h-full z-2 opacity-50 transition" style={{ backgroundImage: `url(${dmgHud})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: "repeat" }}/>
          )}

          {!rightPanel ? 
          <div className="absolute right-1 top-1 z-99">
            <Button variant="icon-only-btn" icon={rightPanelIcon} iconSize={25} onClick={() => toggleRightPanel(rightPanel => !rightPanel)}/> 
          </div>
          : 
          <div className="absolute flex right-0 h-full z-99">
            <RightSideBar 
              onClose={() => toggleRightPanel(false)} 
              onItemTransferred={handleItemTransferred} 
              lootInventoryRef={lootInventoryRef}
              atVillage={inVillage}

              />
          </div>
          }
        </div>
      </div>
    </div>
  )
}
