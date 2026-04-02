import { InventoryNode } from "@/src/domain/inventory";
import { NodeRendererProps } from "react-arborist";

interface LootInventoryNodeProps extends NodeRendererProps<InventoryNode>{
  onDelete: (nodeId: string) => void;
  onSelect: (nodeId: string, isShiftClick: boolean, isCtrlClick: boolean) => void;
  onGetItem: (nodeId: string) => void;
  selectedNodeIds: Set<string>;
}

export function LootInventoryNode({ node, style, onDelete, onSelect, onGetItem, selectedNodeIds }: LootInventoryNodeProps){
  const name = node.data.name;
  
  return (
    <div>

    </div>
  )
}