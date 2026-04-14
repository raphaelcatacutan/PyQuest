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
import ArmorsCatalog from "@/src/game/json/armors.json";
import WeaponsCatalog from "@/src/game/json/weapons.json";
import ConsumablesCatalog from "@/src/game/json/consumables.json";

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

function isUtilItem(kind: string): boolean {
  return kind === "util";
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
  const { gainCoins } = usePlayerStore(
    useShallow((s) => ({
      gainCoins: s.gainCoins
    }))
  )
  const name = node.data.name;

  function handleConfirmRename() {
    if (!isUtilItem(node.data.kind) && newName.trim() && newName !== name) {
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

  function handleDeleteClick() {
    if (!isUtilItem(node.data.kind)) {
      onDelete(node.id);
    }
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
    gainCoins(itemSellPrice);
    onDelete(node.id)
  }

  // Get the item's sell price from the appropriate catalog
  const getItemSellPrice = () => {
    const itemId = (node.data as any).itemId as string;
    const kind = node.data.kind;

    if (kind === "armor") {
      return (ArmorsCatalog as any)[itemId]?.sellCost || 0;
    } else if (kind === "weapon") {
      return (WeaponsCatalog as any)[itemId]?.sellCost || 0;
    } else if (kind === "consumable") {
      return (ConsumablesCatalog as any)[itemId]?.sellCost || 0;
    }
    return 0;
  };

  const itemSellPrice = getItemSellPrice();

  // Get detailed item data from catalogs
  const getItemData = () => {
    const itemId = (node.data as any).itemId as string;
    const kind = node.data.kind;

    if (kind === "armor") {
      return (ArmorsCatalog as any)[itemId];
    } else if (kind === "weapon") {
      return (WeaponsCatalog as any)[itemId];
    } else if (kind === "consumable") {
      return (ConsumablesCatalog as any)[itemId];
    }
    return null;
  };

  const itemData = getItemData();

  // Render tooltip content based on item type
  const renderTooltipContent = () => {
    if (!itemData) {
      return (
        <>
          <p className="text-xs font-bold">{node.data.name}</p>
          <p className="text-xs text-gray-300">Item not found in catalog</p>
        </>
      );
    }

    if (node.data.kind === "armor") {
      const armor = itemData;
      return (
        <>
          <p className="text-xs font-bold text-yellow-300">{armor.name}</p>
          {armor.rarity && <p className="text-xs text-gray-400">{armor.rarity}</p>}
          {armor.description && <p className="text-xs text-gray-300 mt-1">{armor.description}</p>}
          
          {armor.baseDef > 0 && <p className="text-xs text-blue-300 mt-2">Defense: +{armor.baseDef}</p>}
          {armor.durability && <p className="text-xs text-gray-400">Durability: {armor.durability}</p>}
          
          {armor.modifiers && armor.modifiers.length > 0 && (
            <div className="text-xs mt-2 space-y-1">
              <p className="text-gray-400 font-semibold">Modifiers:</p>
              {armor.modifiers.map((mod: any, idx: number) => (
                <p key={idx} className={mod.nature === 'bonus' ? 'text-green-400' : 'text-red-400'}>
                  {mod.stat}: {mod.nature === 'bonus' ? '+' : '-'}{mod.value}
                </p>
              ))}
            </div>
          )}
        </>
      );
    }

    if (node.data.kind === "weapon") {
      const weapon = itemData;
      return (
        <>
          <p className="text-xs font-bold text-yellow-300">{weapon.name}</p>
          {weapon.rarity && <p className="text-xs text-gray-400">{weapon.rarity}</p>}
          {weapon.description && <p className="text-xs text-gray-300 mt-1">{weapon.description}</p>}
          
          <div className="text-xs mt-2 space-y-1">
            <p className="text-blue-300">Base Dmg: {weapon.baseDmg}</p>
            {weapon.baseCritChance > 0 && <p className="text-blue-300">Crit Chance: {(weapon.baseCritChance * 100).toFixed(0)}%</p>}
            {weapon.baseCritDmg > 0 && <p className="text-blue-300">Crit Dmg: {(weapon.baseCritDmg * 100).toFixed(0)}%</p>}
            {weapon.energyCostPerSwing && <p className="text-gray-400">Energy/Swing: {weapon.energyCostPerSwing}</p>}
          </div>

          {weapon.modifiers && weapon.modifiers.length > 0 && (
            <div className="text-xs mt-2 space-y-1">
              <p className="text-gray-400 font-semibold">Modifiers:</p>
              {weapon.modifiers.map((mod: any, idx: number) => (
                <p key={idx} className={mod.nature === 'bonus' ? 'text-green-400' : 'text-red-400'}>
                  {mod.stat}: {mod.nature === 'bonus' ? '+' : '-'}{mod.value}
                </p>
              ))}
            </div>
          )}

          {weapon.skills && weapon.skills.length > 0 && (
            <div className="text-xs mt-2 space-y-1">
              <p className="text-gray-400 font-semibold">Skills:</p>
              {weapon.skills.map((skill: any, idx: number) => (
                <p key={idx} className="text-purple-300">{skill.name} ({skill.energyCost} energy)</p>
              ))}
            </div>
          )}

          {weapon.inflictions && weapon.inflictions.length > 0 && (
            <div className="text-xs mt-2 space-y-1">
              <p className="text-gray-400 font-semibold">Status Chance:</p>
              {weapon.inflictions.map((inf: any, idx: number) => (
                <p key={idx} className="text-orange-300">{inf.type}: {(inf.chance * 100).toFixed(0)}%</p>
              ))}
            </div>
          )}
        </>
      );
    }

    if (node.data.kind === "consumable") {
      const consumable = itemData;
      return (
        <>
          <p className="text-xs font-bold text-yellow-300">{consumable.name}</p>
          {consumable.description && <p className="text-xs text-gray-300 mt-1">{consumable.description}</p>}
          
          {consumable.cooldown && <p className="text-xs text-gray-400 mt-2">Cooldown: {consumable.cooldown}ms</p>}

          {consumable.effects && consumable.effects.length > 0 && (
            <div className="text-xs mt-2 space-y-1">
              <p className="text-gray-400 font-semibold">Effects:</p>
              {consumable.effects.map((effect: any, idx: number) => {
                if (effect.type === 'restore') {
                  return <p key={idx} className="text-green-400">{effect.stat}: +{effect.amount}</p>;
                } else if (effect.type === 'buff') {
                  return <p key={idx} className="text-blue-400">{effect.stat} Buff x{effect.multiplier} ({effect.duration}ms)</p>;
                } else if (effect.type === 'debuff') {
                  return <p key={idx} className="text-red-400">{effect.stat}: -{effect.amount} ({effect.duration}ms)</p>;
                }
                return null;
              })}
            </div>
          )}
        </>
      );
    }

    return null;
  };

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
            <span className="text-amber-300 ml-2">${itemSellPrice}</span>
          )}
          </>
        )}
      </div>
      {isHovered && (
        <div
          className="flex-2 flex flex-row-reverse w-fit"
          onClick={(e) => e.stopPropagation()}
        >
          {!isUtilItem(node.data.kind) && (
            <>
              <Button
                variant="icon-only-btn"
                icon={deleteIcon}
                iconSize={20}
                onClick={handleDeleteClick}
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
            </>
          )}
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
        className="bg-black/90 max-w-xs text-wrap overflow-y-auto max-h-96 text-white p-3 rounded shadow-2xl border border-yellow-500"
      >
         {renderTooltipContent()}
         {node.data.cursed && <p className="text-red-400 text-[10px] mt-2">⚠️ Cursed Item!</p>}
      </div>,
      document.body // Teleport destination
    )}
    </div>
  );
}
