import { useEffect } from "react"
import { useShallow } from "zustand/shallow"
import { 
  useSceneStore,
  useGameStore,
  useEnemyStore,
} from "@/src/game/store"
import { Enemies, getEnemiesByLocation } from "@/src/game/data/enemies"

// TODO: Bug: terminal outputs double console, meaning useEffect is being performed twice.
//            This affects which enemy/boss is being rendered
// TODO: Add energy UI

export default function EnemyEncounter(){
  const scene = useSceneStore((s) => s.scene)
  const { isThereEnemy, toggleIsThereEnemy } = useGameStore(
    useShallow((s) => ({
      isThereEnemy: s.isThereEnemy,
      toggleIsThereEnemy: s.toggleIsThereEnemy
    }))
  )
  // const toggleIsThereEnemy = useGameStore((state) => state.toggleIsThereEnemy)
  const spawnEnemy = useEnemyStore((state) => state.spawnEnemy)
  const clearEnemy = useEnemyStore((state) => state.clearEnemy)
  const { id, name, enemyImg, skills } = useEnemyStore(
    useShallow((s) => ({
      id: s.id,
      name: s.name,
      enemyImg: s.enemyImg,
      skills: s.skills
    }))
  )
  const { hp, takeDamage} = useEnemyStore(
    useShallow((state) => ({
      hp: state.hp,
      takeDamage: state.takeDamage
    }))
  )
  const maxHp = useEnemyStore((state) => state.maxHp)
  const { energy, takeEnergyCost } = useEnemyStore(
    useShallow((state) => ({
      energy: state.energy,
      takeEnergyCost: state.takeEnergyCost
    }))
  )
  const maxEnergy = useEnemyStore((state) => state.maxEnergy)

  const healthPercentage = (hp / maxHp) * 100;
  const energyPercentage = (energy / maxEnergy) * 100;

  useEffect(() => {
    if (!isThereEnemy) return;
    if (id) return; // Don't spawn if already spawned

    const epsilon = 0.5
    if (Math.random() <= epsilon){ 
      // Boss
      console.log('Boss')
      const bosses = Enemies[scene]
      if (!bosses) return;

      const keys = Object.keys(bosses);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      // TODO: spawnBoss(boss[randomKey])
    } else { 
      // Enemy
      console.log('Enemy')
      // const testScene = 'swamp'
      const enemies = getEnemiesByLocation(scene);
      if (!enemies) return;
      
      const keys = Object.keys(enemies);
      const randomEnemyKey = keys[Math.floor(Math.random() * keys.length)];
      spawnEnemy(enemies[randomEnemyKey])
    }
  }, [isThereEnemy, scene, spawnEnemy, id])

  useEffect(() => {
    if (hp <= 0) {
      console.log(`Enemy Defeated: ${name}`)
      toggleIsThereEnemy()
      clearEnemy()
    }
  }, [hp, name, toggleIsThereEnemy, clearEnemy])

  return (
    <div className="relative flex h-full w-full z-1"> 
      <div className="absolute flex flex-col w-full h-full items-center">
        <span className="text-4xl mt-2">
          {name}
        </span>
        <div className="relative w-48 bg-gray-800 border-2 border-gray-600 rounded h-8 overflow-hidden">
          <div 
            className="bg-red-600 h-full transition-all duration-300" 
            style={{ width: `${healthPercentage}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
            {hp}/{maxHp}
          </span>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
        <img src={enemyImg} className="w-80 h-80" draggable={false}></img>
      </div>
    </div>
  )
}