import { useEffect } from "react"
import { useShallow } from "zustand/shallow"
import { 
  useSceneStore,
  useGameStore,
  useEnemyStore,
  useBossStore
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
  const spawnBoss = useBossStore((state) => state.spawnBoss)
  const clearBoss = useBossStore((state) => state.clearBoss)
  const { id, name, enemyImg } = useEnemyStore(
    useShallow((s) => ({
      id: s.id,
      name: s.name,
      enemyImg: s.enemyImg,
    }))
  )
  const { hp } = useEnemyStore(
    useShallow((state) => ({
      hp: state.hp
    }))
  )
  const maxHp = useEnemyStore((state) => state.maxHp)
  const bossState = useBossStore(
    useShallow((state) => ({
      id: state.id,
      name: state.name,
      bossImg: state.bossImg,
      hp: state.hp,
      maxHp: state.maxHp
    }))
  )
  useEffect(() => {
    if (!isThereEnemy) return;
    if (id || bossState.id) return; // Don't spawn if already spawned

    const epsilon = 0.5
    if (Math.random() <= epsilon){ 
      // Boss
      console.log('Boss')
      const boss = BossesByScene[scene]
      if (!boss) return;

      const keys = Object.keys(boss);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      spawnBoss(boss[randomKey])
      clearEnemy()
    } else { 
      // Enemy
      console.log('Enemy')
      const enemies = EnemiesByScene[scene];
      if (!enemies) return;
      
      const keys = Object.keys(enemies);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      spawnEnemy(enemies[randomKey])
      clearBoss()
    }
  }, [isThereEnemy, scene, spawnEnemy, id, bossState.id, spawnBoss, clearEnemy, clearBoss])

  useEffect(() => {
    if (bossState.id && bossState.hp <= 0) {
      console.log(`Boss Defeated: ${bossState.name}`)
      toggleIsThereEnemy()
      clearBoss()
    } else if (!bossState.id && hp <= 0) {
      console.log(`Enemy Defeated: ${name}`)
      toggleIsThereEnemy()
      clearEnemy()
    }
  }, [hp, name, toggleIsThereEnemy, clearEnemy, bossState, clearBoss])

  const displayName = bossState.id ? bossState.name : name
  const displayImg = bossState.id ? bossState.bossImg : enemyImg
  const displayHp = bossState.id ? bossState.hp : hp
  const displayMaxHp = bossState.id ? bossState.maxHp : maxHp

  return (
    <div className="relative flex h-full w-full z-1"> 
      <div className="absolute flex flex-col w-full h-full items-center">
        <span className="text-4xl mt-2">
          {displayName}
        </span>
        <div className="relative w-48 bg-gray-800 border-2 border-gray-600 rounded h-8 overflow-hidden">
          <div 
            className="bg-red-600 h-full transition-all duration-300" 
            style={{ width: `${(displayHp / displayMaxHp) * 100}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
            {displayHp}/{displayMaxHp}
          </span>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
        <img src={displayImg} className="w-80 h-80" draggable={false}></img>
      </div>
    </div>
  )
}
