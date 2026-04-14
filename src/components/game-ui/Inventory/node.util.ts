import { InventoryNode } from "@/src/game/types/inventory.types";
import { NodeApi } from "react-arborist";
import {
  armorIcon,
  weaponIcon,
  configIcon,
  fileIcon,
  consumableIcon,
  openFolderIcon,
  closedFolderIcon,
  functionIcon
} from "@/src/assets";

export function getNodeIcon(node: NodeApi<InventoryNode>){
  switch(node.data.kind){
    case "armor": return armorIcon;
    case "weapon": return weaponIcon;
    case "consumable": return consumableIcon;
    case "util": return configIcon;
    case "function": return functionIcon;
    case "folder": return node.isOpen ? openFolderIcon : closedFolderIcon;
    default: return fileIcon;
  }  
}