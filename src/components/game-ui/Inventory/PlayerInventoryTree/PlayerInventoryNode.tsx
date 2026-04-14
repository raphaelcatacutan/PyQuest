import { NodeRendererProps } from "react-arborist";
import { useState } from "react";
import { InventoryNode } from "@/src/game/types/inventory.types";
import Button from "../../../ui/Button";
import {
  addFileIcon,
  addFolderIcon,
  deleteIcon,
  renameIcon,
  sellIcon
} from "@/src/assets";
import { usePlayerStore, useSceneStore, useSoundStore } from "@/src/game/store";
import { getNodeIcon } from "../node.util";
import { createPortal } from "react-dom";
import { useShallow } from "zustand/shallow";

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

const SELLABLE_ITEM_KINDS = ["weapon", "armor", "consumable"] as const;

function isSellableItem(kind: string): kind is "weapon" | "armor" | "consumable" {
  return SELLABLE_ITEM_KINDS.includes(kind as any);
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
  const scene = useSceneStore(s => s.scene)
  const { coins, gainCoins } = usePlayerStore(
    useShallow((s) => ({
      coins: s.coins,
      gainCoins: s.gainCoins
    }))
  )
  const name = node.data.name;

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

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    onSelect(node.id, e.shiftKey, e.ctrlKey || e.metaKey);
    if (node.data.kind === "folder") node.toggle();
  }

  function handleDoubleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    console.log("PlayerInventoryNode double clicked:", {
      id: node.id,
      name: node.data.name,
      kind: node.data.kind,
    });
  }

  // Track mouse coordinates
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    // We use clientX/Y or pageX/Y depending on your CSS setup
    // Using a small offset (e.g., +15) keeps the overlay from flickering under the cursor
    setMousePos({ x: e.clientX + 15, y: e.clientY + 15 });
  };

  const handleSell = () => {
    useSoundStore.getState().playSfx('trade')
    gainCoins(123) // TODO: Replace with item value
    onDelete(node.id)
  }

  return (
    <div
      style={style}
      ref={dragHandle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onDoubleClick={handleDoubleClick}
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
        <img
          src={getNodeIcon(node)}
          alt="Folder"
          style={{ width: 16, height: 16, display: "inline" }}
        />
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
          <>
          <span className="truncate">{name}</span>
          {isHovered && 
            scene == 'village' && 
            isSellableItem(node.data.kind) && (
            <span className="text-amber-300 ml-2">$123</span> // TODO: Replace with cost value
          )}
          </>
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
          {scene == 'village' && 
            isSellableItem(node.data.kind) && (
            <Button
              variant="icon-only-btn"
              icon={sellIcon}
              iconSize={20}
              onClick={handleSell}
            />)
          }
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

      {/* 3. THE PORTAL OVERLAY */}
    {/* We render this OUTSIDE the flex flow entirely */}
    {isHovered && 
        scene == 'village' && 
        isSellableItem(node.data.kind) &&
      createPortal(
      <div 
        style={{
          position: 'fixed', // Use fixed so coordinates are viewport-relative
          left: mousePos.x,
          top: mousePos.y,
          pointerEvents: 'none', 
          zIndex: 51,      // High z-index to stay on top of everything
        }}
        className="bg-black/90 max-w-80 max-h-100 text-wrap overflow-y-clip text-white p-2 rounded shadow-2xl border border-yellow-500"
      >
         <p className="text-xs font-bold">{node.data.name}</p>
         <p className="text-xs font-bold">Lorem ipsum dolor sit amet consectetur, </p>
         {node.data.cursed && <p className="text-red-400 text-[10px]">Cursed Item!</p>}
      </div>,
      document.body // Teleport destination
    )}
    </div>
  );
}
