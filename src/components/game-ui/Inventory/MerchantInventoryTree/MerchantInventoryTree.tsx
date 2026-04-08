import { useState } from "react";
import { Tree } from "react-arborist";
import { InventoryNode } from "@/src/game/types/inventory.types";
import { MerchantInventoryNode } from "./MerchantInventoryNode";

// TODO: Item must be accompanied with Buy and Sell value
const data: InventoryNode[] = [
  {
    id: "Enemy",
    name: "Enemy",
    kind: "folder",
    children: [
      { id: "bowe.py", name: "bowe.py", kind: "misc", itemId: "bowe" },
    ]
  },
];

interface MerchantInventoryTreeProps {
  onItemBought?: (item: InventoryNode) => void;
}

export function MerchantInventoryTree({ onItemBought }: MerchantInventoryTreeProps){
  const [merchantInventory, setMerchantInventory] = useState(data)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

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
      console.log("Calling onItemBought callback with item:", (itemToBuy as any).name);
      onItemBought(itemToBuy);
    } else {
      console.log("WARNING: Item not found or no callback provided!");
    }
    
    // Remove from merchant inventory
    console.log("Removing item from merchant inventory...");
    const deleteFromArray = (items: InventoryNode[]): InventoryNode[] => {
      return items
        .filter(item => item.id !== nodeId)
        .map(item => 
          item.kind === "folder" 
            ? { ...item, children: deleteFromArray(item.children) }
            : item
        );
    };
    setMerchantInventory(deleteFromArray(merchantInventory));
    setSelectedNodeId(null);
    console.log("=== handleBuy END ===");
  }
  
  function handleNodeSelect(nodeId: string) {
    // Simple single-item selection
    setSelectedNodeId(selectedNodeId === nodeId ? null : nodeId);
  }

  return (
    <div className="flex shrink-0 p-2">
      <Tree
          data={merchantInventory}
          height={400}
          width={300}
          openByDefault={true}
      >
        {(props) => (<MerchantInventoryNode 
          {...props}
          onSelect={handleNodeSelect}
          onBuy={handleBuy}
          isSelected={selectedNodeId === props.node.id}
        />
        )}
      </Tree>
    </div>
  )
}