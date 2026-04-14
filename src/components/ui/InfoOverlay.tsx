import { useState } from "react";
import { useInfoOverlayStore } from "@/src/game/store";
import { useShallow } from "zustand/shallow";

export default function InfoOverlay() {
  const { displayInfoOverlay, setDisplayInfoOverlay } = useInfoOverlayStore(
    useShallow((s) => ({
      displayInfoOverlay: s.displayInfoOverlay,
      setDisplayInfoOverlay: s.setDisplayInfoOverlay
    }))
  )
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    // We add a small offset (e.g., 15px) so the tooltip 
    // doesn't sit directly under the cursor and flicker
    setCoords({ x: e.clientX + 15, y: e.clientY + 15 });
  };

  return (
    <div className="relative h-screen w-full bg-slate-900 flex items-center justify-center">
      
      {/* The Target Component */}
      <div
        onMouseEnter={() => setDisplayInfoOverlay(true)}
        onMouseLeave={() => setDisplayInfoOverlay(false)}
        onMouseMove={handleMouseMove}
        className="p-10 bg-amber-200 rounded-lg cursor-help text-slate-900 font-bold"
        >
        Hover me to see NPC Stats
      </div>

      {/* The Floating Overlay */}
        {displayInfoOverlay && (
          <div
            className="fixed pointer-events-none z-[6] p-3 bg-black/80 border border-green-500 rounded shadow-xl"
            style={{
              left: coords.x,
              top: coords.y,
            }}
          >
            {/* TODO: Update */}
            <p className="text-green-500 text-xs font-mono">ID: Blacksmith_01</p>
            <p className="text-white text-sm">"I can fix your blade... for a price."</p>
          </div>
        )}
    </div>
  );
}