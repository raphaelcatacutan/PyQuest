import { NodeRendererProps } from "react-arborist";
import { 
  InventoryNode,
} from "@/src/domain/inventory";
import openFolderIcon from "@/public/assets/icons/open_folder.svg?url"
import closedFolderIcon from "@/public/assets/icons/closed_folder.svg?url"
import consumableIcon from "@/public/assets/icons/consumable.svg"


export function PlayerInventoryNode({ node, style, dragHandle }: NodeRendererProps<InventoryNode>) {
  // const icon = getNodeType(node.data.kind)
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
            style={{ width: 16, height: 16, display: "inline", marginRight: 4 }}
          />
        );
      default: return "📄 ";
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
      onDoubleClick={() => {}}
      className={`
        px-2 cursor-pointer
        ${node.isSelected ? "bg-blue-500 text-white" : ""}
        ${node.isFocused ? "outline-1 outline-blue-300" : ""}
        hover:border
      `}
    >
      {getNodeType(node.data.kind)} {name}
    </div>
  );
}