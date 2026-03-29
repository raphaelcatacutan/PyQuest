import { NodeRendererProps } from "react-arborist";
import { useState } from "react";
import { 
  InventoryNode,
} from "@/src/domain/inventory";
import Button from "../../ui/Button";
import openFolderIcon from "@/public/assets/icons/open_folder.svg?url"
import closedFolderIcon from "@/public/assets/icons/closed_folder.svg?url"
import consumableIcon from "@/public/assets/icons/consumable.svg?url"
import fileIcon from "@/public/assets/icons/file.svg?url"
import deleteIcon from "@/public/assets/icons/delete.svg?url"
import renameIcon from "@/public/assets/icons/rename.svg?url"
import addFolderIcon from "@/public/assets/icons/add_folder.svg?url"
import addFileIcon from "@/public/assets/icons/add_file.svg?url"

interface PlayerInventoryNodeProps extends NodeRendererProps<InventoryNode> {
  onDelete: (nodeId: string) => void;
  onAddFolder: (parentId?: string) => void;
  onAddFile: (parentId?: string) => void;
  onRename: (nodeId: string, newName: string) => void;
}

export function PlayerInventoryNode({ node, style, dragHandle, onDelete, onAddFolder, onAddFile, onRename }: PlayerInventoryNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.data.name);
  const name = node.data.name;

  function getNodeType(type: InventoryNode["kind"]) {
  // TODO: Replace emojis with RPG-like SVG asset
    switch (type) {
      case "weapon": return "⚔️ ";
      case "armor":  return "🛡️ ";
      case "consumable": 
        return (
          <img 
            src={consumableIcon}
            alt="Consumable"
            style={{ width: 16, height: 16, display: "inline", marginRight: 4 }}
          />
        )
      case "folder": 
        return (
          <img 
          src={node.isOpen ? openFolderIcon : closedFolderIcon} 
          alt="folder" 
          style={{ width: 16, height: 16, display: "inline"}}
          />
        );
      default: 
        return (
          <img 
            src={fileIcon}
            alt="File"
            style={{ width: 16, height: 16, display: "inline", marginRight: 4 }}
          />
        )
    }
  }

  function handleDeleteNode(){
    // TODO: Add Confirmation Dialogue Box
    onDelete(node.id);
  }

  function handleRenameNode(){
    setIsRenaming(true);
    setNewName(name);
  }

  function handleConfirmRename() {
    if (newName.trim() && newName !== name) {
      onRename(node.id, newName.trim());
    }
    setIsRenaming(false);
  }

  function handleCancelRename() {
    setIsRenaming(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleConfirmRename();
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  }

  function handleAddFolder(){
    if (node.data.kind === "folder") {
      onAddFolder(node.id);
    }
  }

  function handleAddFile(){
    if (node.data.kind === "folder") {
      onAddFile(node.id);
    }
  }

  return (
    <div 
      style={style} 
      ref={dragHandle}
      onClick={() => {
        node.select()
        if (node.data.kind === "folder") node.toggle();  
      }} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        border-l-2
        border-transparent
        px-2 cursor-pointer
        ${node.isSelected ? "bg-blue-500 text-white" : ""}
        ${node.isFocused ? "outline-1 outline-blue-300" : ""}
        hover:border-l-2
        hover:border-l-amber-300
        flex flex-row
      `}
    >
      <div className="flex flex-1 w-fit gap-1 pl-1">
        {getNodeType(node.data.kind)} 
        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleConfirmRename}
            onKeyDown={handleKeyDown}
            autoFocus
            className="bg-gray-700 text-white rounded border border-blue-500"
          />
        ) : (
          name
        )}
      </div>
      {isHovered && (
        <div className="flex-2 flex flex-row-reverse w-fit" onClick={(e) => e.stopPropagation()}>
          <Button variant="icon-only-btn" icon={deleteIcon} iconSize={20} onClick={handleDeleteNode}/>
          <Button variant="icon-only-btn" icon={renameIcon} iconSize={20} onClick={handleRenameNode}/>
          <Button variant="icon-only-btn" icon={addFolderIcon} iconSize={23} onClick={handleAddFolder}/>
          <Button variant="icon-only-btn" icon={addFileIcon} iconSize={23} onClick={handleAddFile}/>
        </div>
      )}
    </div>
  );
}