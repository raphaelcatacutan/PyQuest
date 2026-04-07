import { InventoryNode } from "@/src/game/types/inventory.types";
import { NodeRendererProps } from "react-arborist";
import { useState } from "react";
import Button from "../../../ui/Button";
import {
  buyIcon,
  fileIcon,
  consumableIcon,
  openFolderIcon,
  closedFolderIcon,

} from '@/src/assets'

interface MerchantInventoryNodeProps extends NodeRendererProps<InventoryNode>{
  onSelect: (nodeId: string) => void;
  onBuy: (nodeId: string) => void;
  isSelected: boolean;
}

export function MerchantInventoryNode({ node, style, onSelect, onBuy, isSelected }: MerchantInventoryNodeProps){
  const [isHovered, setIsHovered] = useState(false);
  const name = node.data.name;
  
  // function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
  //   // Store the item data in the drag event
  //   const dragData = {
  //     nodeIds: selectedNodeIds.size > 1 && selectedNodeIds.has(node.id) 
  //       ? Array.from(selectedNodeIds) 
  //       : [node.id],
  //     source: 'loot'
  //   };
  //   const jsonString = JSON.stringify(dragData);
  //   e.dataTransfer.effectAllowed = 'move';
  //   e.dataTransfer.setData('text/plain', jsonString);
  //   console.log("Dragging items:", dragData.nodeIds, "JSON:", jsonString);
  // }
  
  function getNodeIcon(type: InventoryNode["kind"]) {
    switch (type) {
      case "weapon": return "⚔️ ";
      case "armor": return "🛡️ ";
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
      default: return (
        <img 
          src={fileIcon}
          alt="Item"
          style={{ width: 16, height: 16, display: "inline", marginRight: 4 }}
        />
      );
    }
  }
  
  return (
    <div 
      style={style}
      // ref={dragHandle}
      draggable
      // onDragStart={handleDragStart}
      onClick={() => {
        onSelect(node.id);
        if (node.data.kind === "folder") node.toggle();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        border-l-2
        border-transparent
        px-2 cursor-pointer
        ${isSelected ? "bg-yellow-500 text-white" : ""}
        ${node.isDragging ? "opacity-50 bg-gray-600" : ""}
        hover:border-l-2
        hover:border-l-amber-300
        flex flex-row
      `}
    >
      <div className="flex flex-1 w-fit gap-1 pl-1 min-w-0">
        {getNodeIcon(node.data.kind)}
        <span className="truncate">
          {name}
          {node.data.kind !== "folder" && (
            <span className="text-amber-300">{"  $123"}</span>
          )}
        </span>
      </div>
      {isHovered && node.data.kind !== "folder" && (
        <div className="flex-2 flex flex-row-reverse w-fit gap-1" onClick={(e) => e.stopPropagation()}>
          <Button 
            variant="icon-only-btn" 
            icon={buyIcon} 
            iconSize={20} 
            onClick={() => onBuy(node.id)} 
            title="Buy Item"/>
        </div>
      )}
    </div>
  )
}