import { useGameStore, useSceneStore } from "@/src/game/store"
import { hintIcon } from "@/src/assets";


export function Info(){
  const scene = useSceneStore(s => s.scene)
  const inCombat = useGameStore(s => s.inCombat)
  let text = "";
  let code = "";
  let text1 = "";
  let code1 = "";

  if (scene == 'village'){
    text = "To go to different maps, execute: "
    code = "goTo(<scene>)"
  } else {
    text = "To go to different maps, execute: "
    code = "goTo(<scene>)\n"
    text1 = "To hunt, execute: ";
    code1 = "explore(<boolean>)\n";
  }

  if (inCombat) return null

  return (
    <div className="absolute z-4 top-5 left-14 bg-black/50 max-w-75">
      <div className="whitespace-pre-wrap font-[FiraSans]">
        <img src={hintIcon} width={25} height={25}/>
        <span>{text}</span><span className="text-yellow-300">{code}</span>
        {scene !== 'village' && (
          <>
            <span>{text1}</span><span className="text-yellow-300">{code1}</span>
          </>
        )}
      </div>
    </div>
  )
}