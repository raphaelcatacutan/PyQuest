import { useEffect, useRef, useState } from "react"
import EnemyEncounter from "./EnemyEncounter"
import { useGameStore, useEnemyStore, useBossStore, usePlayerStore } from "@/src/game/store"
import { useShallow } from "zustand/shallow"
import { createEncounterController, EncounterController } from "@/src/backend/mechanics/combat"

export default function Combat(){
  const DEBUG_AI = true
  const { isThereEnemy } = useGameStore(
    useShallow((s) => ({
      isThereEnemy: s.isThereEnemy,
    }))
  )
  const enemyId = useEnemyStore((s) => s.id)
  const bossId = useBossStore((s) => s.id)

  const controllerRef = useRef<EncounterController | null>(null)
  const activeKeyRef = useRef<string>("")
  const timerRef = useRef<number | null>(null)
  const lastTickRef = useRef<number>(0)
  const [debugState, setDebugState] = useState<{
    isBoss: boolean;
    enemyId: string;
    action: string;
    reward: number;
    dmgToPlayer: number;
    dmgToEnemy: number;
    healEnemy: number;
    energyDelta: number;
    playerHp: number;
    enemyHp: number;
    enemyEnergy: number;
    tickMs: number;
    done: boolean;
  } | null>(null)

  useEffect(() => {
    if (!isThereEnemy) {
      stopLoop()
      return
    }

    const isBoss = bossId !== ""
    const activeId = isBoss ? bossId : enemyId
    if (!activeId) {
      stopLoop()
      return
    }

    const key = `${isBoss ? "boss" : "enemy"}:${activeId}`
    if (activeKeyRef.current !== key) {
      const enemy = isBoss ? useBossStore.getState() : useEnemyStore.getState()
      controllerRef.current = createEncounterController({
        kind: isBoss ? "boss" : "mob",
        enemy: {
          hp: enemy.hp,
          maxHp: enemy.maxHp,
          energy: enemy.energy,
          maxEnergy: enemy.maxEnergy,
          def: enemy.def,
          dmg: enemy.dmg,
          critChance: enemy.critChance,
          critDmg: enemy.critDmg,
          atkSpeed: enemy.atkSpeed,
          skills: enemy.skills
        }
      })
      activeKeyRef.current = key
    }

    if (timerRef.current == null) {
      lastTickRef.current = performance.now()
      timerRef.current = window.setInterval(() => {
        const controller = controllerRef.current
        if (!controller) return

        const now = performance.now()
        const deltaMs = now - lastTickRef.current
        lastTickRef.current = now

        const player = usePlayerStore.getState()
        const enemy = isBoss ? useBossStore.getState() : useEnemyStore.getState()
        if (!enemy.id) return

        const result = controller.tick({
          player: {
            hp: player.hp,
            maxHP: player.maxHP,
            def: player.def,
            baseDmg: player.baseDmg,
            baseCritChance: player.baseCritChance,
            baseCritDmg: player.baseCritDmg,
            atkSpeed: player.atkSpeed,
            level: player.level
          },
          enemy: {
            hp: enemy.hp,
            maxHp: enemy.maxHp,
            energy: enemy.energy,
            maxEnergy: enemy.maxEnergy,
            def: enemy.def,
            dmg: enemy.dmg,
            critChance: enemy.critChance,
            critDmg: enemy.critDmg,
            atkSpeed: enemy.atkSpeed,
            skills: enemy.skills
          },
          deltaMs
        })

        if (result.damageToPlayer > 0) {
          usePlayerStore.getState().takeDamage(result.damageToPlayer)
        }

        if (result.damageToEnemy > 0) {
          const takeDamage = isBoss
            ? useBossStore.getState().takeDamage
            : useEnemyStore.getState().takeDamage
          takeDamage(result.damageToEnemy)
        }

        if (result.healEnemy > 0) {
          const gainHp = isBoss
            ? useBossStore.getState().gainHp
            : useEnemyStore.getState().gainHp
          gainHp(result.healEnemy)
        }

        if (result.energyDelta !== 0) {
          if (result.energyDelta < 0) {
            const spend = isBoss
              ? useBossStore.getState().takeEnergyCost
              : useEnemyStore.getState().takeEnergyCost
            spend(Math.abs(result.energyDelta))
          } else {
            const gainEnergy = isBoss
              ? useBossStore.getState().gainEnergy
              : useEnemyStore.getState().gainEnergy
            gainEnergy(result.energyDelta)
          }
        }

        if (DEBUG_AI) {
          const playerAfter = usePlayerStore.getState()
          const enemyAfter = isBoss ? useBossStore.getState() : useEnemyStore.getState()
          setDebugState({
            isBoss,
            enemyId: enemy.id,
            action: result.enemyAction?.label ?? "none",
            reward: Number(result.reward.toFixed(3)),
            dmgToPlayer: result.damageToPlayer,
            dmgToEnemy: result.damageToEnemy,
            healEnemy: result.healEnemy,
            energyDelta: result.energyDelta,
            playerHp: playerAfter.hp,
            enemyHp: enemyAfter.hp,
            enemyEnergy: enemyAfter.energy,
            tickMs: Math.round(deltaMs),
            done: result.done
          })
        }

        if (result.done) {
          controller.endEncounter()
          controllerRef.current = null
          activeKeyRef.current = ""
          stopLoop()
        }
      }, 200)
    }

    return () => stopLoop()
  }, [isThereEnemy, enemyId, bossId])

  function stopLoop() {
    if (controllerRef.current) {
      controllerRef.current.endEncounter()
      controllerRef.current = null
      activeKeyRef.current = ""
    }
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  return (
    <>
      {isThereEnemy && 
      <div className="relative flex h-full w-full z-1"> 
        <EnemyEncounter/>
        {DEBUG_AI && debugState && (
          <div className="absolute left-3 bottom-3 z-10 text-xs bg-black/70 text-white rounded px-3 py-2 w-64">
            <div className="font-semibold">AI Debug</div>
            <div>Type: {debugState.isBoss ? "Boss" : "Mob"}</div>
            <div>Enemy: {debugState.enemyId || "-"}</div>
            <div>Action: {debugState.action}</div>
            <div>Reward: {debugState.reward}</div>
            <div>Tick: {debugState.tickMs}ms</div>
            <div>Player HP: {debugState.playerHp}</div>
            <div>Enemy HP: {debugState.enemyHp}</div>
            <div>Enemy EN: {debugState.enemyEnergy}</div>
            <div>DMG to Player: {debugState.dmgToPlayer}</div>
            <div>DMG to Enemy: {debugState.dmgToEnemy}</div>
            <div>Heal Enemy: {debugState.healEnemy}</div>
            <div>Energy Δ: {debugState.energyDelta}</div>
            <div>Done: {debugState.done ? "yes" : "no"}</div>
          </div>
        )}
      </div>
      }
    </>
  )
}
