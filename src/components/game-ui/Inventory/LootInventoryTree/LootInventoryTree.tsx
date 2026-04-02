import { Tree } from "react-arborist";
import { LootInventoryNode } from "./LootInventoryNode";
import { InventoryNode } from "@/src/domain/inventory";
import { useState } from "react";

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

export function LootInventoryTree({ onItemTransferred }: LootInventoryTreeProps){
  const [inventory, setInventory] = useState(data)
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  const [lastSelectedNodeId, setLastSelectedNodeId] = useState<string | null>(null);

  // TODO: Add Confirm Message, Loot will disappear after confirming. Must have "Don't show again" option
  
  function handleTrash(nodeId: string) {
    // Remove item from inventory
    const deleteFromArray = (items: InventoryNode[]): InventoryNode[] => {
      return items
        .filter(item => item.id !== nodeId)
        .map(item => 
          item.kind === "folder" 
            ? { ...item, children: deleteFromArray(item.children) }
            : item
        );
    };
    setInventory(deleteFromArray(inventory));
  }

  function handleGetItem(nodeId: string) {
    // Find the item being transferred
    const findItem = (items: InventoryNode[]): InventoryNode | null => {
      for (const item of items) {
        if (item.id === nodeId) {
          return item;
        }
        if (item.kind === "folder" && item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    const itemToTransfer = findItem(inventory);
    
    // Transfer item to player inventory if callback provided
    if (itemToTransfer && onItemTransferred) {
      onItemTransferred(itemToTransfer);
    }
    
    // Remove from loot
    handleTrash(nodeId);
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
          onTrash={() => handleTrash(props.node.id)}
          onGetItem={() => handleGetItem(props.node.id)}
          onSelect={handleNodeSelect}
          selectedNodeIds={selectedNodeIds}
        />
        )}
      </Tree>
    </div>
  )
}