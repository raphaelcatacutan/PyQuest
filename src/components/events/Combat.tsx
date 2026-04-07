import EnemyEncounter from "./EnemyEncounter"
import { useGameStore } from "@/src/game/store"
import { useShallow } from "zustand/shallow"

export default function Combat(){
  const { isThereEnemy, toggleIsThereEnemy } = useGameStore(
    useShallow((s) => ({
      isThereEnemy: s.isThereEnemy,
      toggleIsThereEnemy: s.toggleIsThereEnemy
    }))
  )

  return (
    <>
      {isThereEnemy && 
      <div className="relative flex h-full w-full z-1"> 
        <EnemyEncounter/>
      </div>
      }
    </>
  )
}