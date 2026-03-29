import CodeEditor from "@/src/components/game-ui/CodeEditor"
import { LootInventoryTree } from "@/src/components/game-ui/LootInventoryTree"
import SideBar from "@/src/components/game-ui/SideBar"
import Button from "@/src/components/ui/Button"
import exitIcon from "@/public/assets/icons/exit.svg?url"

export default function GamePage() {
  return (
    <div className="relative flex flex-col w-full h-full">

      <div className="flex flex-row-reverse h-10 p-1 bg-header shadow-[0_0_2px_rgba(255,255,0,0.6)]">{/* nav div */}
        <Button variant="icon-only-btn" icon={exitIcon} iconSize={30} title="Exit"></Button>
        <button></button>  
      </div> 

      <div className="relative flex flex-row h-full p-5"> {/* body div */}

        <div className="relative w-150">  {/* CodeEditor div */}
          <CodeEditor/>
        </div>

        <div className="relative flex h-full w-full border"> {/* scene */}
          <SideBar/> 
          <div className="absolute flex right-0 h-full">
            <LootInventoryTree/>
          </div>
        </div>
      </div>
    </div>
  )
}
