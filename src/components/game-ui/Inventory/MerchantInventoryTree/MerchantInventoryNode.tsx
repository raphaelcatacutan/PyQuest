import { InventoryNode } from "@/src/game/types/inventory.types";
import { NodeRendererProps } from "react-arborist";
import { useState } from "react";
import Button from "../../../ui/Button";
import { buyIcon } from "@/src/assets";
import { useSoundStore, usePlayerStore } from "@/src/game/store";
import { getNodeIcon } from "../node.util";
import { useShallow } from "zustand/shallow";
import showToast from "@/src/components/ui/Toast";


interface MerchantInventoryNodeProps extends NodeRendererProps<InventoryNode> {
  onSelect: (nodeId: string) => void;
  onBuy: (nodeId: string) => void;
  isSelected: boolean;
}

export function MerchantInventoryNode({
  node,
  style,
  onSelect,
  onBuy,
  isSelected,
}: MerchantInventoryNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { coins, deductCoins } = usePlayerStore(
    useShallow((s) => ({
      coins: s.coins,
      deductCoins: s.deductCoins
    }))
  )
  const name = node.data.name;

  const handlePurchase = () => {
    if (coins >= 123) {
      useSoundStore.getState().playSfx('trade')
      deductCoins(123); // TODO: Replace with item price
      onBuy(node.id);
    } else {
      showToast({ variant: "warning", message: "Not Enough Coins" });
    }
  }

  return (
    <div
      style={style}
      draggable
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
        <img
          src={getNodeIcon(node)}
          alt="Folder"
          style={{ width: 16, height: 16, display: "inline" }}
        />
        <span className="truncate">
          {name}
          {node.data.kind !== "folder" && <span className="text-amber-300 ml-2">{"$123"}</span>}
        </span>
      </div>
      {isHovered && node.data.kind !== "folder" && ( node.data.kind !== "util" && 
        <div className="flex-2 flex flex-row-reverse w-fit gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="icon-only-btn"
            icon={buyIcon}
            iconSize={20}
            onClick={handlePurchase}
            title="Buy Item"
          />
        </div>
      )}
    </div>
  );
}
