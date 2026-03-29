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
    const newFolder: InventoryNode = {
      id: `folder-${Date.now()}`,
      kind: "folder",
      name: "New Folder",
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
    const newFile: InventoryNode = {
      id: `item-${Date.now()}`,
      kind: "misc",
      itemId: "abc",
      name: "New Item"
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
          Toolbar
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
          console.log("Selected:", nodes.map(n => n.data));
        }}
      >
        {(props) => (
          <PlayerInventoryNode 
            {...props}
            onDelete={handleDeleteNode}
            onAddFolder={handleNodeAddFolder}
            onAddFile={handleNodeAddFile}
            onRename={handleRenameNode}
          />
        )}
      </Tree> 
    </div>
  );
}
