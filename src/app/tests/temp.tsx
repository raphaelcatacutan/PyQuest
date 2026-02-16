// import Dialogue from "@/src/components/DialogueBox"
import { useState, useRef, useEffect } from "react"
import CodeEditor from "../../components/game-ui/CodeEditor"
import SideBar from "../../components/game-ui/SideBar"

export default function GamePage() {
  const [leftWidth, setLeftWidth] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return

      const container = containerRef.current
      const newWidth = (e.clientX / container.clientWidth) * 100
      if (newWidth > 20 && newWidth < 80) {
        setLeftWidth(newWidth)
      }
    }

    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mousemove", handleMouseMove)
    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative flex gap-0 h-screen overflow-auto">
      {/* Left Panel */}
      <div style={{ width: `${leftWidth}%` }} className="relative flex flex-col gap-3 p-5 overflow-auto bg-neutral-900">
        <div className="flex-1 overflow-hidden">
          <CodeEditor/>
        </div>
        <div className="relative w-auto p-2 bg-neutral-800 text-white text-center">
          <SideBar/>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={() => { isDragging.current = true }}
        className="w-1 bg-gray-600 hover:bg-gray-500 cursor-col-resize"
      />

      {/* Right Panel */}
      <div style={{ width: `${100 - leftWidth}%` }} className="relative overflow-hidden bg-neutral-800 text-white text-center justify-center">
        Scene
      </div>
    </div>
  )
}