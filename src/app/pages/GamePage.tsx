import CodeEditor from "@/src/components/game-ui/CodeEditor"
import { LootInventoryTree } from "@/src/components/game-ui/LootInventoryTree"
import SideBar from "@/src/components/game-ui/SideBar"

export default function GamePage() {
  return (
    <div className="relative flex flex-col w-full h-full">

      <div className="flex flex-row-reverse h-10 p-1 bg-amber-950">{/* nav div */}
        <button></button>  
      </div> 

      <div className="relative flex flex-row h-full p-5"> {/* body div */}

        <div className="relative bg-amber-800 w-150">  {/* CodeEditor div */}
          <CodeEditor/>
        </div>

        <div className="relative flex h-full w-full border-2"> {/* scene */}
          <div className="">
            <SideBar/> 
          </div>
          <div className="absolute flex right-0 h-full border">
            <LootInventoryTree/>
          </div>
        </div>
      </div>
    </div>
  )
}
