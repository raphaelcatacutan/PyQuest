import { Tree } from "react-arborist";
import Button from "../ui/Button";
import closeIcon from "@/public/assets/icons/close.svg?url"

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

interface RightSideBarProps {
  onClose?: () => void
}

export function LootInventoryTree({ onClose }: RightSideBarProps){
  // TODO: Add Confirm Message, Loot will disappear after confirming. Must ahave "Don't show again" option
  return (
    <div className="relative h-full border">
      <div className="flex flex-row-reverse border">
        <Button variant="icon-only-btn" icon={closeIcon} iconSize={25} onClick={onClose}/>
      </div>
      <Tree
        data={data}
        height={400}
        width={300}
      />
    </div>
  );
}
