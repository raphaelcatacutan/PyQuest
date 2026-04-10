import Button from "./ui/Button"
import { 
  useDevToolStore,
  useEnemyStore, 
  useBossStore,
  useGameStore,
  usePlayerStore,
  useDialogueBoxStore,
  useSceneStore,
  useTerminalStore,
  useGuideStore,
  useInventoryStore
} from "../game/store"
import { SceneTypes } from "../game/types/scene.types"
import { useState } from "react"
import { Enemies } from "../game/data/enemies"
import { MachineProblems } from "../game/data/dungeon"
import { useShallow } from "zustand/shallow"

export default function DevTool(){
  const { devTool, toggleDevTool } = useDevToolStore(
    useShallow((s) => ({
      devTool: s.devTool,
      toggleDevTool: s.toggleDevTool
    }))
  )
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
  const { displayDialogueBox, toggleDisplayDialogueBox } = useDialogueBoxStore(
    useShallow((s) => ({
      displayDialogueBox: s.displayDialogueBox,
      toggleDisplayDialogueBox: s.toggleDisplayDialogueBox
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

  const gainXP = usePlayerStore(s => s.gainXP)

  const combatText = `Combat (${inCombat})`
  const dmgHUDText = `Dmg HUD (${isDamaged})`
  const dialogueBoxText = `Dialogue Box (${displayDialogueBox})`
  const sceneText = `Scene: ${scene}`
  const playerDataText = `UserId: ${user_id} | PlayerId: ${playerId}`

  return (
    <>
      {devTool && 
      <div className="absolute z-101 bottom-0 right-0 flex gap-2 w-fit p-1 border bg-zinc-900 flex-wrap">
        <span>DevTool:</span>
        <span className="text-yellow-300">{playerDataText}</span>
        <input type="text" className="border bg-zinc-800" value={input} onChange={(e) => setInput(e.target.value)}></input>
        <Button text="Print All" onClick={() => {
          console.log("=== PLAYER DATA ===");
          console.log("user_id:", user_id);
          console.log("playerId:", playerId);
          console.log("localStorage keys:", Object.keys(localStorage));
          console.log("Full inventoryStore:", useInventoryStore.getState());
          console.log("Full playerStore:", usePlayerStore.getState());
        }}/>
        <Button text="Add to Terminal" onClick={() => {appendToLogs(input)}}/>
        <Button text="Coin+" onClick={() => gainCoin(1)}/>
        <Button text="Hp-" onClick={() => selfHarm(20)}/>
        <span>{hp}</span>
        <Button text="Hp+" onClick={() => gainHP(10)}/>
        <Button text="XP+" onClick={() => gainXP(10)}/>
        <Button text="Display ID" onClick={() => {console.log(`Player: ${user_id}`)}}/>
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
        {/* <Button text={dmgHUDText} onClick={() => toggleIsDamaged(null)}/> */}
        <Button text={dialogueBoxText} onClick={toggleDisplayDialogueBox}/>
        <Button text={sceneText} onClick={() => {
          const scenes: SceneTypes[] = ['village', 'labyrinth', 'dungeon', 'trials'];
          const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
          setScene(randomScene)
        }}/>
        <Button text="Guide" onClick={() => guide.toggleGuide(null)}/>
      </div>
      }
    </>
  )
}