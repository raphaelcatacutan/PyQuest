import { useShallow } from "zustand/shallow";
import { useEnemyStore } from "@/src/game/store";

export default function EnemyEncounter() {
  const { name, hp, maxHp, energy, maxEnergy, enemyImg } = useEnemyStore(
    useShallow((s) => ({
      name: s.name,
      hp: s.hp,
      maxHp: s.maxHp,
      energy: s.energy,
      maxEnergy: s.maxEnergy,
      enemyImg: s.enemyImg,
    })),
  );

  const safeMaxHp = Math.max(1, maxHp);
  const safeMaxEnergy = Math.max(1, maxEnergy);
  const healthPercentage = (hp / safeMaxHp) * 100;
  const energyPercentage = (energy / safeMaxEnergy) * 100;

  return (
    <div className="relative flex h-full w-full z-1">
      <div className="absolute flex flex-col w-full h-full items-center">
        <span className="text-4xl mt-2">{name}</span>
        <div className="relative w-48 bg-gray-800 border-2 border-gray-600 rounded h-8 overflow-hidden">
          <div
            className="bg-red-600 h-full transition-all duration-300"
            style={{ width: `${healthPercentage}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
            {hp}/{maxHp}
          </span>
        </div>
        <div className="relative w-48 bg-gray-800 border-2 border-gray-600 rounded h-4 overflow-hidden mt-2">
          <div
            className="bg-yellow-500 h-full transition-all duration-300"
            style={{ width: `${energyPercentage}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
            {energy}/{maxEnergy}
          </span>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
        <img src={enemyImg} className="w-80 h-80" draggable={false} />
      </div>
    </div>
  );
}
