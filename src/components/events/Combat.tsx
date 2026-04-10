import EnemyEncounter from "./EnemyEncounter"
import BossEncounter from "./BossEncounter"
import { 
  useGameStore,
  useSceneStore, 
  useEnemyStore,
  useBossStore
} from "@/src/game/store"
import { useShallow } from "zustand/shallow"
import { useEffect } from "react"
import { getBossesByLocation } from "@/src/game/data/bosses"
import { getEnemiesByLocation } from "@/src/game/data/enemies"

export default function Combat(){
  const scene = useSceneStore(s => s.scene)
  const { inCombat, toggleInCombat } = useGameStore(
    useShallow((s) => ({
      inCombat: s.inCombat,
      toggleInCombat: s.toggleInCombat
    }))
  )
  const { isEnemy, toggleIsEnemy} = useGameStore(
    useShallow((s) => ({
      isEnemy: s.isEnemy,
      toggleIsEnemy: s.toggleIsEnemy
    }))
  )
  const enemyId = useEnemyStore(s => s.id)
  const bossId = useBossStore(s => s.id)

  const bossHP = useBossStore(s => s.hp)
  const enemyHP = useEnemyStore(s => s.hp) 

  const spawnEnemy = useEnemyStore(s => s.spawnEnemy)
  const spawnBoss = useBossStore(s => s.spawnBoss)

  const clearEnemy = useEnemyStore(s => s.clearEnemy)
  const clearBoss = useBossStore(s => s.clearBoss)

  useEffect(() => {
    if (!inCombat) return;
    // if (id) return; // Don't spawn if already spawned

    const epsilon = 0.5
    if (Math.random() <= epsilon){ // Boss
      const bosses = getBossesByLocation(scene);
      if (!bosses) return;

      const keys = Object.keys(bosses);
      const randomBossKey = keys[Math.floor(Math.random() * keys.length)];
      spawnBoss(bosses[randomBossKey])
      toggleIsEnemy(false)
    } else { // Enemy 
      console.log('Enemy')
      // const testScene = 'swamp'
      const enemies = getEnemiesByLocation(scene);
      if (!enemies) return;
      
      const keys = Object.keys(enemies);
      const randomEnemyKey = keys[Math.floor(Math.random() * keys.length)];
      spawnEnemy(enemies[randomEnemyKey])
      toggleIsEnemy(true)
    }
  }, [inCombat, scene])

  useEffect(() => {
    if (isEnemy){
      if (enemyHP <= 0){
        console.log(`Enemy Defeated: ${name}`)
        toggleInCombat(false)
        clearEnemy()
      }
    } else {
      if (bossHP <= 0){
        console.log(`Enemy Defeated: ${name}`)
        toggleInCombat(false)
        clearBoss()
      }
    }
  }, [enemyHP, bossHP])

  return (
    <>
      {inCombat &&
      <div className="relative flex h-full w-full z-1"> 
        {isEnemy ? <EnemyEncounter/> : <BossEncounter/>}
      </div>
      }
    </>
  )
}