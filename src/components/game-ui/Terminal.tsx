import { useEffect, useRef } from "react";

interface TerminalProps {
  messages?: string[];
}

export default function Terminal({ messages = [] }: TerminalProps){
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // TODO: A handler that handles maximum cap of terminal messages
  //       If capacity reached, pop off last element.

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full border">
      <div className="flex justify-end items-center px-1 bg-[#261c13] border">
        Terminal
      </div>
      <div className="flex-1 w-full bg-black/50 text-white font-mono text-sm p-3 overflow-y-auto">
        <div className="space-y-1">
          {messages.map((message, index) => (
            <div key={index} className="break-words">
              {message}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}