import { useState } from "react"
import CodeEditor from "@/src/components/game-ui/CodeEditor"
import { LootInventoryTree } from "@/src/components/game-ui/LootInventoryTree"
import LeftSideBar from "@/src/components/game-ui/LeftSideBar"
import Button from "@/src/components/ui/Button"
import exitIcon from "@/public/assets/icons/exit.svg?url"
import rightPanelIcon from "@/public/assets/icons/right_panel.svg?url"
import mapBg from "@/public/assets/maps/dungeon.png?url"
import showToast from "@/src/components/ui/Toast"
// import mapBg from "@/public/assets/maps/labyrinth.png?url"

export default function GamePage() {
  const [rightPanel, toggleRightPanel] = useState(false)

  function handleExitGame(){
    showToast({ variant: 'info', message: 'Welcome, adventurer!' });
  }

  return (
    <div className="relative flex flex-col w-full h-full">

      <div className="flex flex-row-reverse h-10 p-1 bg-header shadow-[0_0_2px_rgba(255,255,255,1)]">{/* nav div */}
        <Button variant="icon-only-btn" icon={exitIcon} iconSize={30} title="Exit" onClick={handleExitGame}></Button>
      </div> 

      <div className="relative flex flex-row h-full p-5"> {/* body div */}

        <div className="relative w-150">  {/* CodeEditor div */}
          <CodeEditor/>
        </div>

        <div className="relative flex h-full w-full" style={{ backgroundImage: `url(${mapBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: "repeat" }}> {/* scene */}
          <LeftSideBar/>
          {!rightPanel ? 
          <div className="absolute right-1 top-1">
            <Button variant="icon-only-btn" icon={rightPanelIcon} iconSize={25} onClick={() => toggleRightPanel(rightPanel => !rightPanel)}/> 
          </div>
          : 
          <div className="absolute flex right-0 h-full">
            <LootInventoryTree onClose={() => toggleRightPanel(false)}/>
          </div>
          }
        </div>
      </div>
    </div>
  )
}
