import CodeEditor from "../../components/game-ui/CodeEditor"
import SideBar from "../../components/game-ui/SideBar"
import { Group, Panel, Separator } from "react-resizable-panels"

export default function GamePage() {
  return (
    <Group orientation="horizontal" className="h-screen p-5 overflow-auto">
      <Panel defaultSize={40} minSize={300} className="flex flex-row">
        <CodeEditor/>
      </Panel>
      <Separator className="w-0.5 bg-gray-600 hover:bg-gray-500 cursor-col-resize" />
      <Panel defaultSize={60} minSize={500} className="flex flex-row">
        <SideBar/>
        <div className="w-full h-full bg-neutral-800 text-white text-center justify-center">
          Scene
        </div>
      </Panel>
    </Group>
  )
}
