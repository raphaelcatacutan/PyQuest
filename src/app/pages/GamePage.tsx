import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import CodeEditor from "@/src/components/game-ui/CodeEditor";
import LeftSideBar from "@/src/components/game-ui/LeftSideBar";
import Button from "@/src/components/ui/Button";
import showToast from "@/src/components/ui/Toast";
import Combat from "@/src/components/events/Combat";
import { RightSideBar } from "@/src/components/game-ui/RightSideBar";
import { rightPanelIcon } from "@/src/assets";
import {
  useSceneStore,
  useGameStore,
  usePlayerStore,
  useInventoryStore,
  loadInventoryProfile,
  loadDungeonProfile,
  loadUserProfile,
} from "@/src/game/store";
import { InventoryNode } from "@/src/game/types/inventory.types";
import BountyQuest from "@/src/components/ui/BountyQuest";
import DevTool from "@/src/components/DevTool";
import Damaged from "@/src/components/events/Damaged";
import NavBar from "@/src/components/ui/NavBar";
import Dungeon from "@/src/components/events/Dungeon";
import Trials from "@/src/components/events/Trials";
import NPC from "@/src/components/events/NPC";
import Tutorial from "@/src/components/events/Tutorial";
import { loadBountyProfile } from "@/src/game/store";
import { loadKillProfile } from "@/src/game/store/killTrackerStore";

export default function GamePage() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayBg, setDisplayBg] = useState("");
  const inVillage = useGameStore((s) => s.inVillage);
  const user_id = usePlayerStore((s) => s.user_id);
  const { scene, sceneBg } = useSceneStore(
    useShallow((s) => ({
      scene: s.scene,
      sceneBg: s.sceneBg,
    })),
  );
  const { rightPanel, toggleRightPanel } = useGameStore(
    useShallow((state) => ({
      rightPanel: state.rightPanel,
      toggleRightPanel: state.toggleRightPanel,
    })),
  );
  const {
    player_id,
    playerInventory,
    addInventoryItem,
    deleteInventoryItem,
    renameInventoryItem,
    moveInventoryItem,
  } = useInventoryStore(
    useShallow((s) => ({
      player_id: s.player_id,
      playerInventory: s.playerInventory,
      addInventoryItem: s.addInventoryItem,
      deleteInventoryItem: s.deleteInventoryItem,
      renameInventoryItem: s.renameInventoryItem,
      moveInventoryItem: s.moveInventoryItem,
    })),
  );

  const lootInventoryRef = useRef<{
    getItems: (nodeIds: string[]) => InventoryNode[];
    removeItems: (nodeIds: string[]) => void;
  } | null>(null);

  useEffect(() => {
    // Listen for drop events from loot inventory
    const handleLootDrop = (event: Event) => {
      const customEvent = event as CustomEvent<string[]>;
      const nodeIds = customEvent.detail;
      console.log(
        "GamePage received loot-dropped-to-player event for nodeIds:",
        nodeIds,
      );

      // Get the items from loot inventory and transfer them
      if (lootInventoryRef.current?.getItems) {
        const items = lootInventoryRef.current.getItems(nodeIds);
        console.log("Retrieved items:", items);
        items.forEach((item) => {
          handleItemTransferred(item);
        });

        // Remove items from loot after transfer
        if (lootInventoryRef.current?.removeItems) {
          lootInventoryRef.current.removeItems(nodeIds);
          console.log("Removed items from loot");
        }
      }
    };

    window.addEventListener("loot-dropped-to-player", handleLootDrop);
    return () =>
      window.removeEventListener("loot-dropped-to-player", handleLootDrop);
  }, []);

  // Transition effect when sceneBg changes
  useEffect(() => {
    setIsTransitioning(true);

    // Update background image halfway through the dimming
    const updateBgTimer = setTimeout(() => {
      setDisplayBg(sceneBg);
    }, 300); // Halfway through the fade

    // Complete the transition and brighten
    const completeTimer = setTimeout(() => {
      setIsTransitioning(false);
    }, 600); // Total transition duration

    return () => {
      clearTimeout(updateBgTimer);
      clearTimeout(completeTimer);
    };
  }, [sceneBg]); // Trigger whenever sceneBg changes

  // Initialize background on first load
  useEffect(() => {
    setDisplayBg(sceneBg);
  }, []);

  // Load all datas
  useEffect(() => {
    const initApp = async () => {
      // Wait for player session to load
      if (!usePlayerStore.persist.hasHydrated()) {
        await usePlayerStore.persist.rehydrate();
      }

      const currentId = usePlayerStore.getState().user_id;

      if (currentId) {
        console.log(`Data Found for ${currentId}`);
        // Only load if we have a valid ID
        await loadUserProfile(currentId);
        await loadInventoryProfile(currentId);
        await loadBountyProfile(currentId);
        await loadDungeonProfile(currentId);
        await loadKillProfile(currentId);
        // load other data
      } else {
        console.log(`Data NOT Found for ${currentId}`);
      }
    };
    initApp();
  }, []); // Adding user_id here covers both refresh AND login

  function handleItemTransferred(item: InventoryNode) {
    console.log("GamePage.handleItemTransferred called with item:", item);

    const uniqueId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log("Generated unique ID:", uniqueId);

    addInventoryItem("pickedup_folder", {
      ...item,
      id: uniqueId,
    });
  }

  return (
    <div className="relative flex flex-col w-full h-full">
      <NavBar />

      <div id="origin" className="relative flex flex-row h-full p-5">
        {" "}
        {/* body div */}
        <CodeEditor />
        <div id="scene" className="relative flex h-full w-full bg-black">
          {" "}
          {/* scene */}
          <NPC />
          <Trials />
          <Dungeon />
          <Tutorial />
          <div
            className="absolute flex w-full h-full z-1"
            style={{
              backgroundImage: `url(${displayBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "repeat",
              transition: "opacity 0.3s ease-in, filter 0.3s ease-in-out",
              opacity: isTransitioning ? 0.4 : 1,
              filter: isTransitioning ? "brightness(0)" : "brightness(1)",
            }}
          />
          <div className="absolute h-full z-50">
            <LeftSideBar
              playerInventory={playerInventory}
              addInventoryItem={addInventoryItem}
              deleteInventoryItem={deleteInventoryItem}
              renameInventoryItem={renameInventoryItem}
              moveInventoryItem={moveInventoryItem}
            />
          </div>
          {!rightPanel ? (
            <div id="right-btn" className="absolute right-1 top-1 z-50">
              <Button
                variant="icon-only-btn"
                icon={rightPanelIcon}
                iconSize={25}
                onClick={toggleRightPanel}
              />
            </div>
          ) : (
            <div className="absolute flex right-0 h-full z-50">
              <RightSideBar
                onClose={toggleRightPanel}
                onItemTransferred={handleItemTransferred}
                lootInventoryRef={lootInventoryRef}
                atVillage={inVillage}
              />
            </div>
          )}
          <Combat/>
        </div>
      </div>

      {/* Misc */}
      <BountyQuest />
      <Damaged />
      <DevTool />
    </div>
  );
}
