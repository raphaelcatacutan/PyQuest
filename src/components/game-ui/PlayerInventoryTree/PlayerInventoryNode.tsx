import { NodeRendererProps } from "react-arborist";
import { 
  InventoryNode,
  getNodeType
} from "@/src/domain/inventory";

export function PlayerInventoryNode({ node, style, dragHandle }: NodeRendererProps<InventoryNode>) {
  const icon = getNodeType(node.data.kind)
  const name = node.data.name;

  return (
    <div 
      style={style} 
      ref={dragHandle}
      onClick={() => node.toggle()} 
    >
      {icon} {name}
    </div>
  );
}