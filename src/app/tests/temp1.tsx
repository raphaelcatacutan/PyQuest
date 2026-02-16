import CodeEditor from "../../components/game-ui/CodeEditor"
import SideBar from "../../components/game-ui/SideBar"

export default function GamePage() {
  return (
    <div className="relative flex gap-3 p-5 h-screen overflow-auto">
      {/* Left Panel */}
      <div className="flex flex-row w-1/2 overflow-hidden">     
        {/* Code Editor */}
        <div className="relative w-screen">
          <CodeEditor/> 
        </div>
        
        {/*  */}
        <div className="relative w-auto p-2 bg-neutral-800 text-white text-center">     
          <SideBar/>
        </div>
      </div>
      
      {/* Right Panel */}
      <div className="w-1/2 overflow-hidden bg-neutral-800 text-white text-center justify-center">
        Scene
      </div>
    </div>
  )
}
