import { useEffect } from "react"
import { useShallow } from "zustand/shallow"
import { 
  useSceneStore,
  useGameStore,
  useEnemyStore,
} from "@/src/game/store"
import { BossesByScene, EnemiesByScene } from "@/src/game/data/enemies"

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
  const { enemy_id, enemy_name, enemyImg, enemy_skills } = useEnemyStore(
    useShallow((s) => ({
      enemy_id: s.enemy_id,
      enemy_name: s.enemy_name,
      enemyImg: s.enemyImg,
      enemy_skills: s.enemy_skills
    }))
  )
  const { enemy_hp, takeDamage} = useEnemyStore(
    useShallow((state) => ({
      enemy_hp: state.enemy_hp,
      takeDamage: state.takeDamage
    }))
  )
  const enemy_maxHp = useEnemyStore((state) => state.enemy_maxHp)
  const { enemy_energy, takeEnergyCost } = useEnemyStore(
    useShallow((state) => ({
      enemy_energy: state.enemy_energy,
      takeEnergyCost: state.takeEnergyCost
    }))
  )
  const enemy_maxEnergy = useEnemyStore((state) => state.enemy_maxEnergy)

  const healthPercentage = (enemy_hp / enemy_maxHp) * 100;
  const energyPercentage = (enemy_energy / enemy_maxEnergy) * 100;

  useEffect(() => {
    if (!isThereEnemy) return;
    if (enemy_id) return; // Don't spawn if already spawned

    const epsilon = 0.5
    if (Math.random() <= epsilon){ 
      // Boss
      console.log('Boss')
      const boss = BossesByScene[scene]
      if (!boss) return;

      const keys = Object.keys(boss);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      // TODO: spawnBoss(boss[randomKey])
    } else { 
      // Enemy
      console.log('Enemy')
      const enemies = EnemiesByScene[scene];
      if (!enemies) return;
      
      const keys = Object.keys(enemies);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      spawnEnemy(enemies[randomKey])
    }
  }, [isThereEnemy, scene, spawnEnemy, enemy_id])

  useEffect(() => {
    if (enemy_hp <= 0) {
      console.log(`Enemy Defeated: ${enemy_name}`)
      toggleIsThereEnemy()
      clearEnemy()
    }
  }, [enemy_hp, enemy_name, toggleIsThereEnemy, clearEnemy])

  return (
    <> 
      {/* Enemy encounter */}
      <div className="absolute flex flex-col w-full h-full items-center">
        <span className="text-4xl mt-2">
          {enemy_name}
        </span>
        <div className="relative w-48 bg-gray-800 border-2 border-gray-600 rounded h-8 overflow-hidden">
          <div 
            className="bg-red-600 h-full transition-all duration-300" 
            style={{ width: `${healthPercentage}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
            {enemy_hp}/{enemy_maxHp}
          </span>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
        <img src={enemyImg} className="w-80 h-80" draggable={false}></img>
      </div>
    </>
  )
}