import { exitIcon, noteIcon, guideIcon, tutorialIcon } from "@/src/assets"
import Button from "./Button"
import { usePlayerStore, useBountyQuestStore, useGuideStore, useSoundStore, useTutorialStore } from "@/src/game/store"
import { useShallow } from "zustand/shallow"
import { useNavigate } from "react-router-dom"


export default function NavBar(){
  const toggleDisplayBountyQuest = useBountyQuestStore(s => s.toggleDisplayBountyQuest)
  const navigate = useNavigate()
  const { XP, xpRequirement, level } = usePlayerStore(
    useShallow((s) => ({
      XP: s.XP,
      xpRequirement: s.xpRequirement,
      level: s.level
    }))
  )
  const logOut = usePlayerStore((s) => s.logOut)
  const toggleGuide = useGuideStore(s => s.toggleGuide)
  const stopMusic = useSoundStore(s => s.stopMusic)
  const toggleIsTutorial = useTutorialStore(s => s.toggleIsTutorial)

  function handleExitGame(){
    logOut()
    stopMusic()
    navigate('/login')
  }

  return (
    <div className="flex flex-row h-10 p-1 bg-header shadow-[0_0_2px_rgba(255,255,255,1)] gap-4 items-center justify-center">{/* nav div */}
      <div> 
        <Button variant="exit-btn" icon={exitIcon} iconSize={30} title="Exit" onClick={handleExitGame}/>
        <span id='lvl-bar' className="text-1xl text-gray-200 font-semibold whitespace-nowrap">Level: {level}</span>
      </div>
      {/* <div id="lvl-bar" className="flex items-center gap-2 flex-1 max-w-xs">
        <div className="relative flex-1 bg-gray-700 border border-gray-500 rounded h-5 overflow-hidden">
        <div 
        className="bg-yellow-500 h-full transition-all duration-300" 
        style={{ width: `${(XP / xpRequirement) * 100}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-gray-900 text-xs font-bold">
        {XP}/{xpRequirement}
        </span>
        </div>
        </div> */}
      <div id='bounty-quest' className="flex">      
        <Button variant="icon-only-btn" icon={noteIcon} iconSize={30} title="Bounty Quest" onClick={toggleDisplayBountyQuest}></Button>
        <Button variant="icon-only-btn" icon={guideIcon} iconSize={30} title="Guide" onClick={() => toggleGuide(null)}/>
        <Button variant="icon-only-btn" icon={tutorialIcon} iconSize={30} title="Tutorial" onClick={() => toggleIsTutorial()}/>
      </div>
    </div> 
)
}