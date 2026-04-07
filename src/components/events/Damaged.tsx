import { usePlayerStore } from "@/src/game/store"
import { painHud } from "@/src/assets"
import { useEffect, useRef } from "react"
import { useShallow } from "zustand/shallow"

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

  return (
    <>
      <div 
        className={`absolute inset-0 z-100 pointer-events-none transition-opacity duration-500 ease-out ${
          isDamaged ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          backgroundImage: `url(${painHud})`, 
          backgroundSize: 'cover',
          opacity: isDamaged ? hpOpacity : 0,
        }}
      />

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