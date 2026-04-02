import { Tree } from "react-arborist";
import { LootInventoryNode } from "./LootInventoryNode";
import { useState } from "react";

const data = [
  {
    id: "Enemy",
    name: "Enemy",
    children: [
      {
        id: "Drops",
        name: "Drops",
        children: [
          { id: "sword.py", name: "sword.py" },
          { id: "bow.py", name: "bow.py" },
          { id: "bowe.py", name: "bowe.py" },
        ],
      }
    ]
  },
];

export function LootInventoryTree(){
  const [inventory, setInventory] = useState(data)
  // TODO: Add Confirm Message, Loot will disappear after confirming. Must ahave "Don't show again" option
  
  
  return (
    <div className="flex shrink-0 p-2">
      <Tree
          data={inventory}
          height={400}
          width={300}
          
      >
        {/* <LootInventoryNode/> */}
      </Tree>
    </div>
  )
}