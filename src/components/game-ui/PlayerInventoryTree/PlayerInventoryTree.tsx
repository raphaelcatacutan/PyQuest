import { Tree } from "react-arborist";
import { PlayerInventoryNode } from './PlayerInventoryNode'
import { InventoryNode } from "@/src/domain/inventory";
import { useRef, useState, useEffect } from "react";
import Button from "../../ui/Button";
import collapseIcon from "@/public/assets/icons/collapse.svg?url"
import addFolderIcon from "@/public/assets/icons/add_folder.svg?url"
import addFileIcon from "@/public/assets/icons/add_file.svg?url"
import refreshIcon from "@/public/assets/icons/refresh.svg?url"

// RESTRICTIONS: Duplicate Files is not allowed
//               Duplicate Folder names & File names is not allowed

export const InitialInventory: InventoryNode[] = [
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
];

export function PlayerInventoryTree(){
  const containerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [treeHeight, setTreeHeight] = useState(500);
  const [inventory, setInventory] = useState(InitialInventory);
  const [selectedNode, setSelectedNode] = useState<InventoryNode | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  const [lastSelectedNodeId, setLastSelectedNodeId] = useState<string | null>(null);

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
    // Recreate inventory to reset tree expansion state
    setInventory(JSON.parse(JSON.stringify(inventory)));
  }

  function handleRefresh(){
    setInventory([...inventory]);
  }

  function handleDeleteNode(nodeId: string) {
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

  function handleRenameNode(nodeId: string, newName: string) {
    // Find parent to check for duplicates
    const pathInfo = findNodePathToId(nodeId);
    if (!pathInfo) return;

    // Check for duplicate names in the same parent
    if (hasDuplicateName(pathInfo.parentId, newName, nodeId)) {
      alert(`A file or folder with the name "${newName}" already exists at this level.`);
      return;
    }

    const renameInArray = (items: InventoryNode[]): InventoryNode[] => {
      return items.map(item => 
        item.id === nodeId
          ? { ...item, name: newName }
          : item.kind === "folder"
          ? { ...item, children: renameInArray(item.children) }
          : item
      );
    };
    setInventory(renameInArray(inventory));
  }

  function handleNodeAddFolder(parentId?: string) {
    const nextNum = getNextNumberForPrefix(parentId, "New Folder");
    const newFolderName = `New Folder ${nextNum}`;

    const newFolder: InventoryNode = {
      id: `folder-${Date.now()}`,
      kind: "folder",
      name: newFolderName,
      children: []
    };

    if (!parentId) {
      // Add to root
      setInventory([...inventory, newFolder]);
      return;
    }

    const addToFolder = (items: InventoryNode[]): InventoryNode[] => {
      return items.map(item => 
        item.id === parentId && item.kind === "folder"
          ? { ...item, children: [...item.children, newFolder] }
          : item.kind === "folder"
          ? { ...item, children: addToFolder(item.children) }
          : item
      );
    };
    setInventory(addToFolder(inventory));
  }

  function handleNodeAddFile(parentId?: string) {
    const nextNum = getNextNumberForPrefix(parentId, "New Item");
    const newFileName = `New Item ${nextNum}`;

    const newFile: InventoryNode = {
      id: `item-${Date.now()}`,
      kind: "misc",
      itemId: "abc",
      name: newFileName
    };

    if (!parentId) {
      // Add to root
      setInventory([...inventory, newFile]);
      return;
    }

    const addToFolder = (items: InventoryNode[]): InventoryNode[] => {
      return items.map(item => 
        item.id === parentId && item.kind === "folder"
          ? { ...item, children: [...item.children, newFile] }
          : item.kind === "folder"
          ? { ...item, children: addToFolder(item.children) }
          : item
      );
    };
    setInventory(addToFolder(inventory));
  }

  return (
    <div className="relative h-full" ref={containerRef}>
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
        key={JSON.stringify(inventory)}
        initialData={inventory}
        height={treeHeight}
        width={300}
        onSelect={(nodes) => {
          const selected = nodes.length > 0 ? nodes[0].data : null;
          setSelectedNode(selected);
        }}
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
