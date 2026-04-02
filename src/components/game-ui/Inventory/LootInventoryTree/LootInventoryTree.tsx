import { Tree } from "react-arborist";
import { LootInventoryNode } from "./LootInventoryNode";
import { InventoryNode } from "@/src/domain/inventory";
import { useState, forwardRef, useImperativeHandle } from "react";

const data: InventoryNode[] = [
  {
    id: "Enemy",
    name: "Enemy",
    kind: "folder",
    children: [
      {
        id: "Drops",
        name: "Drops",
        kind: "folder",
        children: [
          { id: "sword.py", name: "sword.py", kind: "misc", itemId: "sword" },
          { id: "bow.py", name: "bow.py", kind: "misc", itemId: "bow" },
          { id: "bowe.py", name: "bowe.py", kind: "misc", itemId: "bowe" },
        ],
      }
    ]
  },
];

interface LootInventoryTreeProps {
  onItemTransferred?: (item: InventoryNode) => void;
}

export const LootInventoryTree = forwardRef<
  { 
    getItems: (nodeIds: string[]) => InventoryNode[],
    removeItems: (nodeIds: string[]) => void 
  },
  LootInventoryTreeProps
>(function LootInventoryTree({ onItemTransferred }, ref) {
  const [inventory, setInventory] = useState(data)
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  const [lastSelectedNodeId, setLastSelectedNodeId] = useState<string | null>(null);

  // Expose getItems and removeItems methods for parent components
  useImperativeHandle(ref, () => ({
    getItems: (nodeIds: string[]) => {
      const items: InventoryNode[] = [];
      const traverse = (itemList: InventoryNode[]) => {
        for (const item of itemList) {
          if (nodeIds.includes(item.id)) {
            items.push(item);
          }
          if (item.kind === "folder" && item.children) {
            traverse(item.children);
          }
        }
      };
      traverse(inventory);
      return items;
    },
    removeItems: (nodeIds: string[]) => {
      const deleteFromArray = (items: InventoryNode[]): InventoryNode[] => {
        return items
          .filter(item => !nodeIds.includes(item.id))
          .map(item => 
            item.kind === "folder" 
              ? { ...item, children: deleteFromArray(item.children) }
              : item
          );
      };
      setInventory(deleteFromArray(inventory));
      setSelectedNodeIds(new Set());
    }
  }));

  // TODO: Add Confirm Message, Loot will disappear after confirming. Must have "Don't show again" option
  
  function handleTrash(nodeIds: string[]) {
    // Remove items from inventory
    const deleteFromArray = (items: InventoryNode[]): InventoryNode[] => {
      return items
        .filter(item => !nodeIds.includes(item.id))
        .map(item => 
          item.kind === "folder" 
            ? { ...item, children: deleteFromArray(item.children) }
            : item
        );
    };
    setInventory(deleteFromArray(inventory));
  }

  function handleGetItem(nodeIds: string[]) {
    console.log("=== handleGetItem START ===");
    console.log("nodeIds to transfer:", nodeIds);
    console.log("Current inventory:", JSON.stringify(inventory, null, 2));
    
    // Find all items being transferred
    const itemsToTransfer: InventoryNode[] = [];
    
    const traverse = (items: InventoryNode[]) => {
      for (const item of items) {
        if (nodeIds.includes(item.id)) {
          console.log(`  Found item: ${item.id} (${item.name}) - kind: ${item.kind}`);
          itemsToTransfer.push(item);
        }
        if (item.kind === "folder" && item.children) {
          traverse(item.children);
        }
      }
    };
    
    traverse(inventory);
    console.log(`Found ${itemsToTransfer.length} items to transfer:`, itemsToTransfer.map(i => i.name));
    
    // Transfer all items to player inventory if callback provided
    if (itemsToTransfer.length > 0 && onItemTransferred) {
      console.log("Calling onItemTransferred callback for each item...");
      itemsToTransfer.forEach((item, index) => {
        console.log(`  [${index}] Transferring: ${item.name}`);
        onItemTransferred(item);
      });
    } else {
      console.log("WARNING: No items to transfer or no callback provided!");
    }
    
    // Remove from loot
    console.log("Removing transferred items from loot...");
    handleTrash(nodeIds);
    
    // Clear selection after transfer
    setSelectedNodeIds(new Set());
    console.log("=== handleGetItem END ===");
  }

  function collectAllNodeIds(nodes: InventoryNode[]): string[] {
    const ids: string[] = [];
    const traverse = (items: InventoryNode[]) => {
      for (const item of items) {
        ids.push(item.id);
        if (item.kind === "folder") {
          traverse(item.children);
        }
      }
    };
    traverse(nodes);
    return ids;
  }

  function handleNodeSelect(nodeId: string, isShiftClick: boolean, isCtrlClick: boolean) {
    if (!isShiftClick && !isCtrlClick) {
      // Normal click: select only this node
      setSelectedNodeIds(new Set([nodeId]));
      setLastSelectedNodeId(nodeId);
      return;
    }

    if (isCtrlClick) {
      // Ctrl-click: toggle this node
      const newSet = new Set(selectedNodeIds);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      setSelectedNodeIds(newSet);
      setLastSelectedNodeId(nodeId);
      return;
    }

    if (isShiftClick && lastSelectedNodeId) {
      // Shift-click: select range between last selected and current
      const allNodeIds = collectAllNodeIds(inventory);
      const lastIndex = allNodeIds.indexOf(lastSelectedNodeId);
      const currentIndex = allNodeIds.indexOf(nodeId);

      if (lastIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);
        const rangeIds = allNodeIds.slice(start, end + 1);
        setSelectedNodeIds(new Set(rangeIds));
      }
    }
  }
  
  return (
    <div className="flex shrink-0 p-2">
      <Tree
          data={inventory}
          height={400}
          width={300}
          openByDefault={true}
      >
        {(props) => (<LootInventoryNode 
          {...props}
          onTrash={(nodeIds) => handleTrash(nodeIds)}
          onGetItem={(nodeIds) => handleGetItem(nodeIds)}
          onSelect={handleNodeSelect}
          selectedNodeIds={selectedNodeIds}
        />
        )}
      </Tree>
    </div>
  )
});