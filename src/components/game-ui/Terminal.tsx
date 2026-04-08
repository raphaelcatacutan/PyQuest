import { useEffect, useRef } from "react";
import { useTerminalStore } from "@/src/game/store/terminalStore";


export default function Terminal(){
  const logs = useTerminalStore(s => s.logs)

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex flex-col h-full border">
      <div className="flex justify-end items-center px-1 bg-[#23100a] border">
        Terminal
      </div>
      <div className="flex-1 w-full bg-black/50 text-white font-mono text-sm p-3 overflow-y-auto">
        <div className="space-y-1">
          {logs.map((message, index) => (
            <div key={index} className="break-words hover:underline">
              {message}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}