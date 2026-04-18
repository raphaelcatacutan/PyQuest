import { useShallow } from "zustand/shallow"
import { useBossStore } from "@/src/game/store"
import { getRandomMP } from "@/src/game/data/dungeon";
import { useEffect, useRef, useState } from "react";


export default function BossEncounter(){
  const { name, hp, maxHp, energy, maxEnergy, bossImg, activeProblem } = useBossStore(
    useShallow((s) => ({
      id: s.id,
      name: s.name,
      hp: s.hp,
      maxHp: s.maxHp,
      energy: s.energy,
      maxEnergy: s.maxEnergy,
      bossImg: s.bossImg,
      skills: s.skills,
      activeProblem: s.activeProblem
    }))
  )

  const safeMaxHp = Math.max(1, maxHp);
  const safeMaxEnergy = Math.max(1, maxEnergy);
  const healthPercentage = (hp / safeMaxHp) * 100;
  const energyPercentage = (energy / safeMaxEnergy) * 100;
  const activeProblemText = activeProblem?.problem ?? "No machine problem available for this scene.";
  const expected_output = activeProblem?.expected_output?? "...";
  const displayedEnergy = Math.floor(energy);
  const displayedMaxEnergy = Math.floor(maxEnergy);

  const [isHurt, setIsHurt] = useState(false);
  const prevHpRef = useRef(hp);

  useEffect(() => {
    if (hp < prevHpRef.current) {
      setIsHurt(true);
      setTimeout(() => setIsHurt(false), 300);
    }
    prevHpRef.current = hp;
  }, [hp]);

  return (
    <div className="absolute z-5 w-full h-full opacity-100">
      <div className="flex flex-col items-center justify-center h-full">
        <>
          <div className="flex w-full h-full items-center justify-center">
            <div className="flex flex-col justify-center items-center w-8/10 h-8/10">
              <div className="flex flex-col w-full gap-2 items-center justify-center">
                <span className="text-3xl text-red-700">{name}</span>

                <div className="relative w-80 h-5 overflow-hidden rounded-2xl bg-zinc-900">
                  <div className="bg-red-600 h-full transition-all duration-300" style={{ width: `${healthPercentage}%` }} />
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                    {hp}/{maxHp}
                  </span>
                </div>
                
                <div className="relative w-80 h-5 overflow-hidden rounded-2xl bg-zinc-900">
                  <div className="bg-yellow-500 h-full transition-all duration-300" style={{ width: `${energyPercentage}%` }} />
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                    {displayedEnergy}/{displayedMaxEnergy}
                  </span>
                </div>
                
                <div className=" flex justify-center items-center">
                  <img 
                    src={bossImg} 
                    className={`w-80 h-80 ${isHurt ? "animate-monster-hurt" : ""}`}
                    draggable={false}
                  />
                </div>
              </div>
              <div className="flex max-w-200 flex-col p-5 rounded-2xl border border-zinc-600 bg-header  justify-center font-[code] overflow-y-auto">
                <span className="h-full mb-2">
                  <span className="text-blue-500">Machine Problem:</span> {activeProblemText}
                </span>
                <span className="h-full">
                  <span className="text-blue-500">Expected Output: </span>
                  {expected_output}
                </span>
                <span className="mt-5 text-xs">
                  <span className="text-amber-400">Hint:</span> Solve this machine problem to insta-kill the enemy.
                </span>
              </div>
            </div>

          </div>
        </>
      </div>
    </div>
  )
}
