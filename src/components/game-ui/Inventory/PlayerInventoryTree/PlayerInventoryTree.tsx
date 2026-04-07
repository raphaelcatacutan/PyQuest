import { Tree, TreeApi } from "react-arborist";
import { PlayerInventoryNode } from './PlayerInventoryNode'
import { InventoryNode } from "@/src/game/types/inventory.types";
import { useRef, useState, useEffect } from "react";
import Button from "../../../ui/Button";
import {
  collapseIcon,
  addFolderIcon,
  addFileIcon,
  refreshIcon,
} from '@/src/assets'
import showToast from "@/src/components/ui/Toast"

// RESTRICTIONS: Duplicate Files is not allowed
//               Duplicate Folder names & File names is not allowed

interface PlayerInventoryTreeProps {
  inventory: InventoryNode[];
  onDeleteItem: (nodeId: string) => void;
  onRenameItem: (nodeId: string, newName: string) => void;
  onMoveItem: (dragIds: string[], parentId: string | null, index: number) => void;
  onAddItem?: (parentId: string | undefined, item: InventoryNode) => void;
  onItemTransferred?: (item: InventoryNode) => void;
}

export function PlayerInventoryTree({ inventory, onDeleteItem, onRenameItem, onMoveItem, onAddItem, onItemTransferred }: PlayerInventoryTreeProps){
  const containerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const treeRef = useRef<TreeApi<InventoryNode>>(null);
  const [treeHeight, setTreeHeight] = useState(500);
  const [selectedNode, setSelectedNode] = useState<InventoryNode | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  const [lastSelectedNodeId, setLastSelectedNodeId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    const calculateHeight = () => {
      if (containerRef.current && toolbarRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const toolbarHeight = toolbarRef.current.clientHeight;
        const calculatedHeight = containerHeight - toolbarHeight - 16; // 16px for padding/margin
        setTreeHeight(Math.max(calculatedHeight, 100)); // minimum 100px
      }
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

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

  function hasDuplicateName(parentId: string | undefined, newName: string, excludeId?: string): boolean {
    const checkInArray = (items: InventoryNode[]): boolean => {
      return items.some(item => 
        item.id !== excludeId && 
        item.name.toLowerCase() === newName.toLowerCase()
      );
    };

    if (!parentId) {
      // Check at root level
      return checkInArray(inventory);
    }

    // Find the parent folder and check its children
    const findParentChildren = (items: InventoryNode[]): InventoryNode[] | null => {
      for (const item of items) {
        if (item.id === parentId && item.kind === "folder") {
          return item.children;
        }
        if (item.kind === "folder") {
          const result = findParentChildren(item.children);
          if (result) return result;
        }
      }
      return null;
    };

    const parentChildren = findParentChildren(inventory);
    return parentChildren ? checkInArray(parentChildren) : false;
  }

  function findNodePathToId(nodeId: string, nodes: InventoryNode[] = inventory): { parentId: string | undefined; node: InventoryNode } | null {
    const traverse = (items: InventoryNode[], parentId: string | undefined): { parentId: string | undefined; node: InventoryNode } | null => {
      for (const item of items) {
        if (item.id === nodeId) {
          return { parentId, node: item };
        }
        if (item.kind === "folder") {
          const result = traverse(item.children, item.id);
          if (result) return result;
        }
      }
      return null;
    };
    return traverse(nodes, undefined);
  }

  function getNextNumberForPrefix(parentId: string | undefined, prefix: string): number {
    const findSiblingsWithPrefix = (items: InventoryNode[]): InventoryNode[] => {
      return items.filter(item => item.name.startsWith(prefix));
    };

    let siblings: InventoryNode[] = [];

    if (!parentId) {
      // Check at root level
      siblings = findSiblingsWithPrefix(inventory);
    } else {
      // Find the parent folder and get its children
      const findParentChildren = (items: InventoryNode[]): InventoryNode[] | null => {
        for (const item of items) {
          if (item.id === parentId && item.kind === "folder") {
            return item.children;
          }
          if (item.kind === "folder") {
            const result = findParentChildren(item.children);
            if (result) return result;
          }
        }
        return null;
      };

      const parentChildren = findParentChildren(inventory);
      if (parentChildren) {
        siblings = findSiblingsWithPrefix(parentChildren);
      }
    }

    // Extract numbers from names like "New Folder 1", "New Folder 2", etc.
    const numbers = siblings
      .map(item => {
        const match = item.name.match(new RegExp(`^${prefix} (\\d+)$`));
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0);

    return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  }

  function handleCollapse(){
    treeRef.current?.closeAll();
  }

  function handleRefresh(){
    // Zustand automatically handles re-renders when inventory changes via store methods
    // No manual refresh needed
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    // Only set to false if leaving the container entirely
    if (e.currentTarget === e.target) {
      setIsDragOver(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const data = e.dataTransfer.getData('text/plain');
      console.log("Raw drag data:", data, "Type:", typeof data);
      const dragData = JSON.parse(data);
      console.log("Dropped items:", dragData.nodeIds);
      
      // Only handle drops from loot inventory
      if (dragData.source !== 'loot') {
        return;
      }

      // Note: We cannot access the actual item data here since we're in PlayerInventory
      // The actual transfer will be handled by the parent component
      // For now, we'll just notify that a drop occurred
      // In GamePage, we'll need to handle the actual transfer
      console.log("Items dropped in player inventory:", dragData.nodeIds);
      
      // Dispatch a custom event that GamePage can listen to
      const event = new CustomEvent('loot-dropped-to-player', { detail: dragData.nodeIds });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error parsing drag data:", error);
    }
  }

  function handleMoveNode(args: { dragIds: string[]; parentId: string | null; index: number }) {
    const { dragIds, parentId, index } = args;
    onMoveItem(dragIds, parentId, index);
  }

  function handleDeleteNode(nodeId: string) {
    onDeleteItem(nodeId);
  }

  function handleRenameNode(nodeId: string, newName: string) {
    onRenameItem(nodeId, newName);
  }

  function handleNodeAddFolder(parentId?: string) {
    if (!onAddItem) return;
    const nextNum = getNextNumberForPrefix(parentId, "New Folder");
    const newFolderName = `New Folder ${nextNum}`;

    const newFolder: InventoryNode = {
      id: `folder-${Date.now()}`,
      kind: "folder",
      name: newFolderName,
      children: []
    };

    onAddItem(parentId, newFolder);
  }

  function handleNodeAddFile(parentId?: string) {
    if (!onAddItem) return;
    const nextNum = getNextNumberForPrefix(parentId, "New Item");
    const newFileName = `New Item ${nextNum}`;

    const newFile: InventoryNode = {
      id: `item-${Date.now()}`,
      kind: "misc",
      itemId: "abc",
      name: newFileName
    };

    onAddItem(parentId, newFile);
  }

  return (
    <div 
      className="relative h-full" 
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        backgroundColor: isDragOver ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
        transition: 'background-color 0.2s'
      }}
    >
      <div className="relative flex border-b-2 mb-2" ref={toolbarRef}>
        <div className="flex-1 h-fit pl-1 pr-1 pt-1">        
          Inventory
        </div>
        <div className="flex-2 flex flex-row-reverse pl-1 pr-1 pt-1">
          <Button variant="icon-only-btn" icon={collapseIcon} iconSize={23} onClick={handleCollapse}></Button>
          <Button variant="icon-only-btn" icon={refreshIcon} iconSize={23} onClick={handleRefresh}></Button>
          <Button variant="icon-only-btn" icon={addFolderIcon} iconSize={23} onClick={() => {
            const parentId = selectedNode && selectedNode.kind === "folder" ? selectedNode.id : undefined;
            handleNodeAddFolder(parentId);
          }}></Button>
          <Button variant="icon-only-btn" icon={addFileIcon} iconSize={23} onClick={() => {
            const parentId = selectedNode && selectedNode.kind === "folder" ? selectedNode.id : undefined;
            handleNodeAddFile(parentId);
          }}></Button>
        </div>
      </div>
      <Tree
        ref={treeRef}
        data={inventory}
        height={treeHeight}
        width={300}
        onSelect={(nodes) => {
          const selected = nodes.length > 0 ? nodes[0].data : null;
          setSelectedNode(selected);
        }}
        onMove={handleMoveNode}
        openByDefault={true}
      >
        {(props) => (
          <PlayerInventoryNode 
            {...props}
            onDelete={handleDeleteNode}
            onAddFolder={handleNodeAddFolder}
            onAddFile={handleNodeAddFile}
            onRename={handleRenameNode}
            onSelect={handleNodeSelect}
            selectedNodeIds={selectedNodeIds}
          />
        )}
      </Tree> 
    </div>
  );
}
