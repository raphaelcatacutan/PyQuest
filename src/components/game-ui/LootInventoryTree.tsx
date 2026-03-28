import { useState } from "react";
import { Tree } from "react-arborist";

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
  }
];

export function LootInventoryTree(){
  const [inv, toggleInv] = useState(true)

  // TODO: Add Confirm Message, Loot will disappear after confirming. Must ahave "Don't show again" option
  return (
    <>
      {inv && 
        <div className="relative h-full border">
          <div className="flex flex-row-reverse border-1">
            <button className="" onClick={() => toggleInv(prev => !prev)}></button>
          </div>
          <Tree
            data={data}
            height={400}
            width={300}
          />
        </div>
      }
    </>
  );
}
