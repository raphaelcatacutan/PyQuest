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
  },
];

export function LootInventoryTree(){
  // TODO: Add Confirm Message, Loot will disappear after confirming. Must ahave "Don't show again" option
  return (
   <Tree
      data={data}
      height={400}
      width={300}
    />
  )
}