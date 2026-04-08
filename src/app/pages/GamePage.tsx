import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useShallow } from "zustand/shallow"
import CodeEditor from "@/src/components/game-ui/CodeEditor"
import LeftSideBar from "@/src/components/game-ui/LeftSideBar"
import Button from "@/src/components/ui/Button"
import showToast from "@/src/components/ui/Toast"
import EnemyEncounter from "@/src/components/events/EnemyEncounter"
import Combat from "@/src/components/events/Combat"
import { RightSideBar } from "@/src/components/game-ui/RightSideBar"
import { 
  exitIcon,
  rightPanelIcon,
  painHud,
} from '@/src/assets'
import { 
  useSceneStore,
  useGameStore,
  usePlayerStore,
  useInventoryStore,
  useDialogueBoxStore,
} from "@/src/game/store"
import { InventoryNode } from "@/src/game/types/inventory.types"
import DialogueBox from "@/src/components/ui/DialogueBox"
import DevTool from "@/src/components/DevTool"
import Damaged from "@/src/components/events/Damaged"

// TODO: Add Player HP UI

export default function GamePage() {
  const navigate = useNavigate()
  const inVillage = useGameStore(s => s.inVillage)
  const logOut = usePlayerStore(s => s.logOut)
  const { scene, sceneBg } = useSceneStore()
  const { rightPanel, toggleRightPanel } = useGameStore(
    useShallow((state) => ({
      rightPanel: state.rightPanel,
      toggleRightPanel: state.toggleRightPanel
    }))
  )
  const { player_id, playerInventory, addInventoryItem, deleteInventoryItem, renameInventoryItem, moveInventoryItem } = useInventoryStore(
    useShallow((s) => ({
      player_id: s.player_id,
      playerInventory: s.playerInventory,
      addInventoryItem: s.addInventoryItem,
      deleteInventoryItem: s.deleteInventoryItem,
      renameInventoryItem: s.renameInventoryItem,
      moveInventoryItem: s.moveInventoryItem,
    }))
  )
  
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
    // TODO: Add Confirmation Toast
    logOut()
    navigate('/login')
  }

  function handleItemTransferred(item: InventoryNode) {
    console.log("GamePage.handleItemTransferred called with item:", item);
    
    const uniqueId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log("Generated unique ID:", uniqueId);
    
    addInventoryItem("pickedup_folder", { 
      ...item, 
      id: uniqueId 
    });
  }

  return (
    <div className="relative flex flex-col w-full h-full">
      <div className="flex flex-row-reverse h-10 p-1 bg-header shadow-[0_0_2px_rgba(255,255,255,1)]">{/* nav div */}
        <Button variant="icon-only-btn" icon={exitIcon} iconSize={30} title="Exit" onClick={handleExitGame}></Button>
      </div> 
      
      <div className="relative flex flex-row h-full p-5"> {/* body div */}

        <CodeEditor/>

        <div className="relative flex h-full w-full"> {/* scene */}
          <div className="absolute flex w-full h-full z-1" style={{ backgroundImage: `url(${sceneBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: "repeat" }}/>
          
          <div className="absolute h-full z-50">
            <LeftSideBar 
              playerInventory={playerInventory} 
              addInventoryItem={addInventoryItem}
              deleteInventoryItem={deleteInventoryItem}
              renameInventoryItem={renameInventoryItem}
              moveInventoryItem={moveInventoryItem}
            />
          </div>

          {!rightPanel ? 
          <div className="absolute right-1 top-1 z-50">
            <Button variant="icon-only-btn" icon={rightPanelIcon} iconSize={25} onClick={toggleRightPanel}/> 
          </div>
          : 
          <div className="absolute flex right-0 h-full z-50">
            <RightSideBar 
              onClose={toggleRightPanel} 
              onItemTransferred={handleItemTransferred} 
              lootInventoryRef={lootInventoryRef}
              atVillage={inVillage}
              />
          </div>
          }

          <Combat/>

        </div>
      </div>

      {/* Misc */}
      <DialogueBox/>
      <Damaged/>
      <DevTool/>
    </div>
  )
}
