import Button from "./ui/Button"
import { 
  useDevToolStore,
  useEnemyStore, 
  useBossStore,
  useGameStore,
  usePlayerStore,
  useBountyQuestStore,
  useSceneStore,
  useTerminalStore,
  useGuideStore,
  useInventoryStore,
  useTrialsStore,
  useTutorialStore,
  useNPCStore,
  useKillTrackerStore
} from "../game/store"
import { SceneTypes } from "../game/types/scene.types"
import { useState } from "react"
import { Enemies } from "../game/data/enemies"
import { MachineProblems } from "../game/data/dungeon"
import { useShallow } from "zustand/shallow"
import showToast from "./ui/Toast"
import { getDPByDifficulty } from "../game/data/trials"
import { Tutorials } from "../game/data/tutorial"
import { useSoundStore } from "../game/store/soundStore"

export default function DevTool(){
  const { devTool, toggleDevTool } = useDevToolStore(
    useShallow((s) => ({
      devTool: s.devTool,
      toggleDevTool: s.toggleDevTool
    }))
  )
  if (!devTool) return null

  const [input, setInput] = useState("")
  const { playerId } = useInventoryStore(
  useShallow((s) => ({
    playerId: s.player_id
  }))
  );
  const { inCombat, toggleInCombat } = useGameStore(
    useShallow((s) => ({
      inCombat: s.inCombat,
      toggleInCombat: s.toggleInCombat
    }))
  )
  const { isEnemy, toggleIsEnemy } = useGameStore(
    useShallow((s) => ({
      isEnemy: s.isEnemy,
      toggleIsEnemy: s.toggleIsEnemy
    }))
  )
  const clearEnemy = useEnemyStore(s => s.clearEnemy)
  const enemyTakeDamage = useEnemyStore(s => s.takeDamage)
  const bossTakeDamage = useBossStore(s => s.takeDamage)
  const { isDamaged, toggleIsDamaged } = usePlayerStore(
    useShallow((s) => ({
      isDamaged: s.isDamaged,
      toggleIsDamaged: s.toggleIsDamaged
    }))
  )
  const { displayBountyQuest, toggleDisplayBountyQuest, toggleQuest } = useBountyQuestStore(
    useShallow((s) => ({
      displayBountyQuest: s.displayBountyQuest,
      toggleDisplayBountyQuest: s.toggleDisplayBountyQuest,
      toggleQuest: s.toggleQuest
    }))
  )
  const { scene, setScene } = useSceneStore()
  const user_id = usePlayerStore(s => s.user_id)
  const appendToLogs = useTerminalStore(s => s.appendToLog)
  const gainCoin = usePlayerStore(s => s.gainCoins)
  const { hp, selfHarm, gainHP } = usePlayerStore(
    useShallow((s) => ({
      hp: s.hp,
      selfHarm: s.takeDamage,
      gainHP: s.gainHP
    }))
  )
  const guide = useGuideStore()
  const trials = useTrialsStore()
  const npc = useNPCStore()
  const tutorial = useTutorialStore()

  const gainXP = usePlayerStore(s => s.gainXP)

  const easyDP = getDPByDifficulty("easy")
  const easyLength = easyDP.length
  const mediumDP = getDPByDifficulty("medium")
  const hardDP = getDPByDifficulty("hard")

  const combatText = `Combat (${inCombat})`
  const dmgHUDText = `Dmg HUD (${isDamaged})`
  // const toastText = `Toast (${})`
  const BountyQuestText = `Bounty Quest (${displayBountyQuest})`
  const sceneText = `Scene: ${scene}`
  const playerDataText = `UserId: ${user_id} | PlayerId: ${playerId}`

  const tuts = useTutorialStore()
  const sfx = useSoundStore()
  const bounty = useBountyQuestStore()
  const kill = useKillTrackerStore()


  return (
    <>
      <div className="absolute z-101 bottom-0 right-0 flex gap-2 w-fit p-1 border bg-zinc-900 flex-wrap">
        <span>DevTool:</span>
        {/* <span className="text-yellow-300">{playerDataText}</span> */}
        <input type="text" className="border bg-zinc-800" value={input} onChange={(e) => setInput(e.target.value)}></input>
        <Button text="Print All" onClick={() => {
          console.log("=== PLAYER DATA ===");
          console.log("user_id:", user_id);
          console.log("playerId:", playerId);
          console.log("localStorage keys:", Object.keys(localStorage));
          console.log("Full inventoryStore:", useInventoryStore.getState());
          console.log("Full playerStore:", usePlayerStore.getState());
        }}/>
        <Button text="Print" onClick={() => console.log(tuts.instruction)}/>
        {/* <Button text="Next" onClick={() => tuts.nextStep()}/> */}
        <Button text="Add to Terminal" onClick={() => {appendToLogs(input)}}/>
        <Button text="Coin+" onClick={() => gainCoin(100)}/>
        <Button text="Hp-" onClick={() => selfHarm(20)}/>
        <span>{hp}</span>
        <Button text="Hp+" onClick={() => gainHP(10)}/>
        <Button text="XP+" onClick={() => gainXP(10)}/>
        <Button text="Toast" onClick={() => {showToast({variant: "info", message: "Test"})}}/>
        <Button text={combatText} onClick={() => { toggleInCombat(null) }}/>
        <Button text="Enemy/Boss" onClick={() => { 
          toggleIsEnemy(null)
          console.log(`Toggled Enemy/Boss: ${isEnemy}`) 
        }}
        />
        <Button text="Hit" onClick={() => {
          if (isEnemy){ enemyTakeDamage(20) }
          else { bossTakeDamage(20) }
        }}/>
        <Button text={BountyQuestText} onClick={() => toggleDisplayBountyQuest()}/>
        <Button text='Refresh Quests' onClick={() => {
          bounty.refreshQuest()
          console.log("Toggled Refresh Quests")
        }}/>
        <Button text='+Quest Lvl' onClick={() => bounty.incrementQuestLevel()}/>
        <Button text='Record Slime Kill' onClick={() => kill.recordKill('slime')}/>
        {/* <Button text='+Slime Kill' onClick={() => bounty.incrementQuestLevel()}/> */}
        <Button text="Check" onClick={() => { bounty.toggleQuest("1") }}/>
        <Button text={sceneText} onClick={() => {
          const scenes: SceneTypes[] = ['village', 'forest', 'temple', 'cemetery', 'swamp', 'jungle', 'desert'];
          const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
          setScene(randomScene)
        }}/>
        <Button text="Guide" onClick={() => guide.toggleGuide(null)}/>
        <Button text="NPC" onClick={() =>  {npc.toggleDisplayNPC()}}/>
        <Button text="Tutorial" onClick={() => tutorial.toggleIsTutorial()}/>
        <Button text="SFX" onClick={() => {
          useSoundStore.getState().playSfx('click')
          console.log("Played Hit SFX")
          }}/>
      </div>
      
    </>
  )
}