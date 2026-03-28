import { Tree } from "react-arborist";
import { PlayerInventoryNode } from './PlayerInventoryNode'
import { InventoryNode } from "@/src/domain/inventory";

// RESTRICTIONS: Duplicate Files is not allowed
//               Duplicate Folder names & File names is not allowed

export const InitialInventory: InventoryNode[] = [
  { 
    id: "root",
    kind: "folder", 
    name: "User", 
    children: [
      { id: "wp_folder", kind: "folder", name: "Weapons", children: [] },   
      { id: "arm_folder", kind: "folder", name: "Armors", children: [] },   
      { id: "cons_folder", kind: "folder", name: "Consumables", children: [] }
    ]
  },
  { id: "misc_folder", kind: "folder", name: "Miscellaneous", children: [] },
  { id: "food", kind: "consumable", itemId: "123", name: "Burger"}
];

export function PlayerInventoryTree(){
  return (
    <div className="relative h-full border">
      <div className="border">Toolbar</div>
      <Tree
        initialData={InitialInventory}
        height={400}
        width={300}
        onSelect={(nodes) => {
          console.log("Selected:", nodes.map(n => n.data));
        }}
      >
        {PlayerInventoryNode}
      </Tree> 
    </div>
  );
}
