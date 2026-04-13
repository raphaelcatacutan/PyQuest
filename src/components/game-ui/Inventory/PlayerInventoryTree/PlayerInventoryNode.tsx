import { NodeRendererProps } from "react-arborist";
import { useState } from "react";
import { InventoryNode } from "@/src/game/types/inventory.types";
import Button from "../../../ui/Button";
import {
  addFileIcon,
  addFolderIcon,
  closedFolderIcon,
  consumableIcon,
  deleteIcon,
  fileIcon,
  openFolderIcon,
  renameIcon,
} from "@/src/assets";
import { resolveInventoryItemImage } from "../itemImageResolver";

interface PlayerInventoryNodeProps extends NodeRendererProps<InventoryNode> {
  onDelete: (nodeId: string) => void;
  onAddFolder: (parentId?: string) => void;
  onAddFile: (parentId?: string) => void;
  onRename: (nodeId: string, newName: string) => void;
  onSelect: (
    nodeId: string,
    isShiftClick: boolean,
    isCtrlClick: boolean,
  ) => void;
  selectedNodeIds: Set<string>;
}

export function PlayerInventoryNode({
  node,
  style,
  dragHandle,
  onDelete,
  onAddFolder,
  onAddFile,
  onRename,
  onSelect,
  selectedNodeIds,
}: PlayerInventoryNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.data.name);
  const name = node.data.name;

  function getNodeType(type: InventoryNode["kind"]) {
    const itemImage = resolveInventoryItemImage(node.data);
    if (itemImage) {
      return (
        <img
          src={itemImage.src}
          alt={itemImage.alt}
          title={
            itemImage.usedPlaceholder ? "placeholder-image" : itemImage.alt
          }
          style={{ width: 24, height: 24, display: "inline", marginRight: 6 }}
        />
      );
    }

    switch (type) {
      case "consumable":
        return (
          <img
            src={consumableIcon}
            alt="Consumable"
            style={{ width: 16, height: 16, display: "inline", marginRight: 4 }}
          />
        );
      case "folder":
        return (
          <img
            src={node.isOpen ? openFolderIcon : closedFolderIcon}
            alt="Folder"
            style={{ width: 16, height: 16, display: "inline" }}
          />
        );
      default:
        return (
          <img
            src={fileIcon}
            alt="File"
            style={{ width: 16, height: 16, display: "inline", marginRight: 4 }}
          />
        );
    }
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
    e.stopPropagation();
    if (e.key === "Enter") {
      handleConfirmRename();
    } else if (e.key === "Escape") {
      handleCancelRename();
    }
  }

  function handleAddFolder() {
    if (node.data.kind === "folder") {
      onAddFolder(node.id);
    }
  }

  function handleAddFile() {
    if (node.data.kind === "folder") {
      onAddFile(node.id);
    }
  }

  return (
    <div
      style={style}
      ref={dragHandle}
      onClick={(e) => {
        onSelect(node.id, e.shiftKey, e.ctrlKey || e.metaKey);
        if (node.data.kind === "folder") node.toggle();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        border-l-2
        border-transparent
        px-2 cursor-pointer
        ${selectedNodeIds.has(node.id) ? "bg-yellow-500 text-white" : ""}
        ${node.isDragging ? "opacity-50 bg-gray-600" : ""}
        hover:border-l-2
        hover:border-l-amber-300
        flex flex-row
      `}
    >
      <div className="flex flex-1 w-fit gap-1 pl-1 min-w-0">
        {getNodeType(node.data.kind)}
        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleConfirmRename}
            onKeyDown={handleKeyDown}
            autoFocus
            className="bg-gray-700 text-white rounded border border-blue-500 truncate"
          />
        ) : (
          <span className="truncate">{name}</span>
        )}
      </div>
      {isHovered && (
        <div
          className="flex-2 flex flex-row-reverse w-fit"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="icon-only-btn"
            icon={deleteIcon}
            iconSize={20}
            onClick={() => onDelete(node.id)}
          />
          <Button
            variant="icon-only-btn"
            icon={renameIcon}
            iconSize={20}
            onClick={() => {
              setIsRenaming(true);
              setNewName(name);
            }}
          />
          {node.data.kind === "folder" && (
            <>
              <Button
                variant="icon-only-btn"
                icon={addFolderIcon}
                iconSize={23}
                onClick={handleAddFolder}
              />
              <Button
                variant="icon-only-btn"
                icon={addFileIcon}
                iconSize={23}
                onClick={handleAddFile}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
