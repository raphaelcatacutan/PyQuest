import { ReactNode } from "react"

interface EnemyEncounterProps {
  enemyName: string
  health: number
  maxHealth: number
  enemyImg: string
}

export default function EnemyEncounter({ enemyName, health, maxHealth, enemyImg }: EnemyEncounterProps){
  const healthPercentage = (health / maxHealth) * 100;

  return (
    <div className="absolute flex h-full w-full"> {/* Enemy encounter */}
      {/* <div>
        gh
        <div className="absolute flex top-4 left-1/2 -translate-x-1/2 w-48 bg-gray-800 border-2 border-gray-600 rounded h-8 overflow-hidden">
          <div className="bg-red-600 h-full w-4/4 transition-all duration-300"></div>
          <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">75/100</span>
        </div>
      </div> */}
      
      <div className="absolute flex flex-col w-full h-full items-center">
        <span className="text-4xl mt-2">
          {enemyName}
        </span>
        <div className="relative w-48 bg-gray-800 border-2 border-gray-600 rounded h-8 overflow-hidden">
          <div 
            className="bg-red-600 h-full transition-all duration-300" 
            style={{ width: `${healthPercentage}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
            {health}/{maxHealth}
          </span>
        </div>
      </div>
      {/* <div className="absolute w-full h-full bg-amber-50">
        <div className="flex top-4 left-1/2 -translate-x-1/2 w-48 bg-gray-800 border-2 border-gray-600 rounded h-8 overflow-hidden">
          <div 
            className="bg-red-600 h-full transition-all duration-300" 
            style={{ width: `${healthPercentage}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
            {health}/{maxHealth}
          </span>
        </div>
      </div> */}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
        <img src={enemyImg} className="w-80 h-80"></img>
      </div>
    </div>
  )
}