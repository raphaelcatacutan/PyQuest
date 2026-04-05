import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import CodeEditor from "@/src/components/game-ui/CodeEditor"
import LeftSideBar from "@/src/components/game-ui/LeftSideBar"
import Button from "@/src/components/ui/Button"
import showToast from "@/src/components/ui/Toast"
import EnemyEncounter from "@/src/components/events/EnemyEncounter"
import { RightSideBar } from "@/src/components/game-ui/RightSideBar"
import { 
  exitIcon,
  rightPanelIcon,
  skeletonHeadEnemy,
  slimeEnemy,
  painHud,
} from '@/src/assets'
import { InventoryNode } from "@/src/domain/inventory/inventory.types"
import { useSceneStore } from "@/src/game/store/sceneStore"
import { useGameStore } from "@/src/game/store/gameStore"
import { usePlayerStore } from "@/src/game/store"
import { useEnemyStore } from "@/src/game/store/enemyStore"
import { useShallow } from "zustand/shallow"
import { SceneNameTypes } from "@/src/game/store/scene.types"
import Test from "@/src/components/Test"

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
  const takeDamage = useEnemyStore(s => s.takeDamage)
  const { scene, setScene, getSceneBg } = useSceneStore()
  const { inVillage, toggleInVillage } = useGameStore(
    useShallow((state) => ({
      inVillage: state.inVillage,
      toggleInVillage: state.toggleInVillage
    }))
  )
  // const { isMerchant, setIsMerchant } = useGameStore(
  //   useShallow((state) => ({
  //     isMerchant: state.isMerchant,
  //     setIsMerchant: state.setIsMerchant
  //   }))
  // )
  const { isThereEnemy, toggleIsThereEnemy } = useGameStore(
    useShallow((state) => ({
      isThereEnemy: state.isThereEnemy,
      toggleIsThereEnemy: state.toggleIsThereEnemy
    }))
  )
  const { rightPanel, toggleRightPanel } = useGameStore(
    useShallow((state) => ({
      rightPanel: state.rightPanel,
      toggleRightPanel: state.toggleRightPanel
    }))
  )
  const { isDamaged, toggleIsDamaged } = usePlayerStore(
    useShallow((state) => ({
      isDamaged: state.isDamaged,
      toggleIsDamaged: state.toggleIsDamaged
    }))
  )
  
  // const isThereEnemy = useGameStore((state) => state.isThereEnemy)
  // const rightPanel = useGameStore((state) => state.rightPanel)

  const bg: Array<SceneNameTypes> = ['village', 'labyrinth'] 
  const RandScene = bg[Math.floor(Math.random() * bg.length)]

  const [playerInventory, setPlayerInventory] = useState(InitialPlayerInventory)
  
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

  useEffect(() => {
    console.log(scene)
  }, [scene])

  function handleExitGame(){

    // Debug
    // toggleIsDamaged()
    toggleIsThereEnemy()
    // setScene(RandScene)
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
      {/* Dmg HUD */}
      {isDamaged && (
        <div className="absolute w-full h-full z-100 opacity-50 transition pointer-events-none" style={{ backgroundImage: `url(${painHud})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: "repeat" }}/>
      )}
      <div className="flex flex-row-reverse h-10 p-1 bg-header shadow-[0_0_2px_rgba(255,255,255,1)]">{/* nav div */}
        <Button variant="icon-only-btn" icon={exitIcon} iconSize={30} title="Exit" onClick={handleExitGame}></Button>
      </div> 
      
      {/* DEBUGGER */}
      <Test/>
        {/* <div className='absolute'>
          <button onClick={handleTest}>Test</button>
        </div> */}

      <div className="relative flex flex-row h-full p-5"> {/* body div */}

        <div className="relative w-150">  {/* CodeEditor div */}
          <CodeEditor/>
        </div>

        <div className="relative flex h-full w-full"> {/* scene */}
          <div className="absolute h-full z-50">
            <LeftSideBar playerInventory={playerInventory} setPlayerInventory={setPlayerInventory}/>
          </div>

          <div className="absolute flex w-full h-full z-1" style={{ backgroundImage: `url(${getSceneBg(scene)})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: "repeat" }}/>

          {/* Enemy Encounter */}
          {isThereEnemy && (
            <div className="absolute flex h-full w-full z-1"> 
              <EnemyEncounter/>
            </div>
          )}

          {!rightPanel ? 
          <div className="absolute right-1 top-1 z-50">
            <Button variant="icon-only-btn" icon={rightPanelIcon} iconSize={25} onClick={() => toggleRightPanel()}/> 
          </div>
          : 
          <div className="absolute flex right-0 h-full z-50">
            <RightSideBar 
              onClose={() => toggleRightPanel()} 
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
