import { usePlayerStore } from "@/src/game/store"
import { painHud } from "@/src/assets"
import { useEffect, useRef } from "react"
import { useShallow } from "zustand/shallow"
import { useBountyQuestStore, useBossStore, useEnemyStore, useGameStore, useSceneStore, useTutorialStore } from "@/src/game/store"

const RESPAWN_BASE_HP = 1;
const RESPAWN_BASE_ENERGY = 1;

export default function Damaged(){
  const { hp, isDamaged, toggleIsDamaged, takeDamage, isHealing, toggleIsHealing} = usePlayerStore(
    useShallow((s) => ({
      hp: s.hp,
      isDamaged: s.isDamaged,
      toggleIsDamaged: s.toggleIsDamaged,
      takeDamage: s.takeDamage,
      gainHP: s.gainHP,
      isHealing: s.isHealing,
      toggleIsHealing: s.toggleIsHealing
    }))
  )
  const questLevel = useBountyQuestStore((s) => s.questLevel)
  const clearEnemy = useEnemyStore((s) => s.clearEnemy)
  const clearBoss = useBossStore((s) => s.clearBoss)

  const prevHp = useRef(hp)
  let hpOpacity = 1;  
  if (hp >= 80) hpOpacity = 0.2;
  else if (hp >= 60) hpOpacity = 0.4;
  else if (hp >= 40) hpOpacity = 0.6;
  else if (hp >= 20) hpOpacity = 0.8;
  else hpOpacity = 1;

  const nativeHealingGradient = 'radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(34, 197, 94, 0.25) 80%, rgba(34, 197, 94, 0.5) 100%)';

  useEffect(() => {
    // --- DAMAGED LOGIC ---
    if (hp <= prevHp.current) {
      toggleIsDamaged(true);

      const timer = setTimeout(() => {
        if (hp <= 0) { toggleIsDamaged(true) }
        else { toggleIsDamaged(false); }
      }, 500);

      prevHp.current = hp;
      return () => clearTimeout(timer);
    }
    toggleIsDamaged(false)

    // --- HEALING LOGIC ---
    if (hp > prevHp.current) {
      toggleIsHealing(true);
      const timer = setTimeout(() => {
        toggleIsHealing(false);
      }, 500);

      prevHp.current = hp;
      return () => clearTimeout(timer);
    }

    prevHp.current = hp;
  }, [hp, takeDamage])

  function handleRestartLevel(input: boolean) {

    if (input){
      const targetPhaseIndex = Math.max(0, questLevel - 1)
      useTutorialStore.getState().skipToPhase(targetPhaseIndex)
      useTutorialStore.getState().toggleIsTutorial(true)
    }

    useSceneStore.getState().setScene("village")
    useGameStore.setState({
      inVillage: true,
      inCombat: false,
    })

    clearEnemy()
    clearBoss()

    usePlayerStore.setState({
      hp: RESPAWN_BASE_HP,
      energy: RESPAWN_BASE_ENERGY,
      hpRegenCarry: 0,
      energyRegenCarry: 0,
      isDamaged: false,
      isHealing: false,
    })
  }

  return (
    <>
      <div 
        className={`absolute inset-0 z-100 flex items-center justify-center transition-opacity duration-500 ease-out ${
          isDamaged ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          pointerEvents: hp <= 0 ? 'auto' : 'none',
          backgroundImage: `url(${painHud})`, 
          backgroundSize: 'cover',
          opacity: isDamaged ? hpOpacity : 0,
        }}
      >
        {hp <= 0 && (
          <div className="w-full">
            <div className="flex flex-col items-center justify-center bg-black/50 py-4" >
              <span className="text-6xl my-2" >You're Dead</span>
              {/* <span className="mb-2">Restart Tutorial?</span>
              <div>
                <button
                  className="rounded-lg border border-slate-500 px-4 text-base hover:bg-slate-700 cursor-pointer"
                  onClick={handleRestartLevel}
                >
                  Yes
                </button>
              </div> */}
            </div>
            <div className="relative flex justify-center align-middle items-center gap-2 mt-2">
              <span className="">Restart Tutorial?</span>
              <button
                className="rounded-lg bg-slate-700 px-4 text-base hover:bg-slate-500 cursor-pointer"
                onClick={() => handleRestartLevel(true)}
              >
                Yes
              </button>
              <button
                className="rounded-lg bg-slate-700 px-4 text-base hover:bg-slate-500 cursor-pointer"
                onClick={() => handleRestartLevel(false)}
              >
                No
              </button>
            </div>
              
          </div>
        )}
      </div>

      {/* <div 
        className={`absolute inset-0 z-[90] pointer-events-none transition-opacity duration-700 ease-in-out ${
          isHealing ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
            // box-shadow: [horizontal] [vertical] [blur] [spread] [color] inset
            boxShadow: isHealing 
              ? 'inset 0 0 100px 20px rgba(34, 197, 94, 0.6)' 
              : 'inset 0 0 0px 0px rgba(34, 197, 94, 0)',
          }}
      /> */}

      <div 
        className={`absolute inset-0 z-[90] pointer-events-none transition-opacity duration-700 ease-in-out ${
          isHealing ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          background: nativeHealingGradient,
          opacity: isHealing ? 1 : 0,
        }}
      />
    </>
  )
}
