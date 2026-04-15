import { useShallow } from "zustand/shallow";
import { useEnemyStore } from "@/src/game/store";

export default function EnemyEncounter() {
  const { name, hp, maxHp, energy, maxEnergy, enemyImg, activeProblem } = useEnemyStore(
    useShallow((s) => ({
      name: s.enemy?.name ?? "...",
      hp: s.enemy?.hp ?? 0,
      maxHp: s.enemy?.maxHp ?? 1,
      energy: s.enemy?.energy ?? 0,
      maxEnergy: s.enemy?.maxEnergy ?? 1,
      enemyImg: s.enemy?.enemyImg ?? "",
      activeProblem: s.activeProblem
    })),
  );

  const safeMaxHp = Math.max(1, maxHp);
  const safeMaxEnergy = Math.max(1, maxEnergy);
  const healthPercentage = (hp / safeMaxHp) * 100;
  const energyPercentage = (energy / safeMaxEnergy) * 100;
  const activeProblemText = activeProblem?.problem ?? "No machine problem available for this scene.";

  return (
    <div className="absolute z-5 w-full h-full opacity-100">
      <div className="flex flex-col items-center justify-center h-full">
        <>
          <div className="flex w-full h-full items-center justify-center">
            <div className="flex w-8/10 h-8/10">
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
                    {energy}/{maxEnergy}
                  </span>
                </div>
                
                <div className=" flex justify-center items-center">
                  <img src={enemyImg} className="w-80 h-80" draggable={false}></img>
                </div>
              </div>
              <div className="flex w-full p-5 bg-header items-center justify-center font-[code]">
                <span className="h-full overflow-y-auto">
                  {activeProblemText}
                </span>
              </div>
            </div>

          </div>
        </>
      </div>
    </div>
  );
}
