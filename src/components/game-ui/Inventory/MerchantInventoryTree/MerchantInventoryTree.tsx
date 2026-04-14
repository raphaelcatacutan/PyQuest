import { useEffect } from "react";
import { Tree } from "react-arborist";
import { InventoryNode } from "@/src/game/types/inventory.types";
import { MerchantInventoryNode } from "./MerchantInventoryNode";
import { useMerchantStore, useSceneStore } from "@/src/game/store";

interface MerchantInventoryTreeProps {
  onItemBought?: (item: InventoryNode) => void;
}

export function MerchantInventoryTree({
  onItemBought,
}: MerchantInventoryTreeProps) {
  const merchantInventory = useMerchantStore((s) => s.merchantInventory);
  const selectedNodeId = useMerchantStore((s) => s.selectedNodeId);
  const removeInventoryItem = useMerchantStore((s) => s.removeInventoryItem);
  const toggleSelectedNodeId = useMerchantStore((s) => s.toggleSelectedNodeId);
  const refreshStore = useMerchantStore((s) => s.refreshStore);
  const scene = useSceneStore(s => s.scene)

  // Only refresh when scene changes
  useEffect(() => {
    refreshStore()
  }, [scene, refreshStore])

  function handleBuy(nodeId: string) {
    console.log("=== handleBuy START ===");
    console.log("nodeId to buy:", nodeId);

    // Find the item being purchased
    let itemToBuy: InventoryNode | null = null;
    const traverse = (items: InventoryNode[]): void => {
      for (const item of items) {
        if (item.id === nodeId) {
          console.log(`  Found item: ${item.id} (${item.name})`);
          itemToBuy = item;
          return;
        }
        if (item.kind === "folder" && item.children) {
          traverse(item.children);
        }
      }
    };

    traverse(merchantInventory);

    // Transfer item to player inventory if callback provided
    if (itemToBuy && onItemBought) {
      console.log(
        "Calling onItemBought callback with item:",
        (itemToBuy as any).name,
      );
      onItemBought(itemToBuy);
    } else {
      console.log("WARNING: Item not found or no callback provided!");
    }

    // Remove from merchant inventory
    console.log("Removing item from merchant inventory...");
    removeInventoryItem(nodeId);
    console.log("=== handleBuy END ===");
  }

  function handleNodeSelect(nodeId: string) {
    // Simple single-item selection
    toggleSelectedNodeId(nodeId);
  }

  return (
    <div className="flex shrink-0 p-2">
      <Tree
        data={merchantInventory}
        height={400}
        width={300}
        openByDefault={true}
      >
        {(props) => (
          <MerchantInventoryNode
            {...props}
            onSelect={handleNodeSelect}
            onBuy={handleBuy}
            isSelected={selectedNodeId === props.node.id}
          />
        )}
      </Tree>
    </div>
  );
}
