import Button from "./ui/Button"
import { 
  useDevToolStore,
  useEnemyStore, 
  useGameStore,
  usePlayerStore,
  useDialogueBoxStore,
  useSceneStore,
  useTerminalStore,
} from "../game/store"
import { SceneTypes } from "../game/types/scene.types"
import { useState } from "react"
import { Enemies } from "../game/data/enemies"
import { useShallow } from "zustand/shallow"

export default function DevTool(){
  const { devTool, toggleDevTool } = useDevToolStore(
    useShallow((s) => ({
      devTool: s.devTool,
      toggleDevTool: s.toggleDevTool
    }))
  )
  const [input, setInput] = useState("")
  const toggleIsThereEnemy = useGameStore(s => s.toggleIsThereEnemy)
  const clearEnemy = useEnemyStore(s => s.clearEnemy)
  const takeDamage = useEnemyStore(s => s.takeDamage)
  const toggleIsDamaged = usePlayerStore(s => s.toggleIsDamaged)
  const toggleDisplayDialogueBox = useDialogueBoxStore(s => s.toggleDisplayDialogueBox)
  const setScene = useSceneStore(s => s.setScene)
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

  const handleTest = (scene: SceneTypes) => {
    // const enem = Object.entries(Enemies).filter(([_, enemy]) => 
    //   Object.keys(enemy.location).includes(scene)
    // );
    console.log(Enemies)
  }
  
  return (
    <>
      {devTool && 
      <div className="absolute z-101 bottom-0 right-0 flex gap-2 w-fit p-1 border bg-zinc-900">
        <span>DevTool:</span>
        <input type="text" className="border bg-zinc-800" value={input} onChange={(e) => setInput(e.target.value)}></input>
        <Button text="Print" onClick={() => handleTest('swamp')}/>
        <Button text="Add to Terminal" onClick={() => {appendToLogs(input)}}/>
        <Button text="Coin+" onClick={() => gainCoin(1)}/>
        <Button text="Hp-" onClick={() => selfHarm(20)}/>
        <span>{hp}</span>
        <Button text="Hp+" onClick={() => gainHP(10)}/>
        <Button text="Display ID" onClick={() => {console.log(`Player: ${user_id}`)}}/>
        <Button text="Toggle Enemy" onClick={() => {
          toggleIsThereEnemy()
          clearEnemy()
        }}
        />
        <Button text="Hit Enemy" onClick={() => takeDamage(20)}/>
        <Button text="Dmg HUD" onClick={() => toggleIsDamaged(null)}/>
        <Button text="Dialogue Box" onClick={toggleDisplayDialogueBox}/>
        <Button text="Random Scene" onClick={() => {
          const scenes: SceneTypes[] = ['village', 'labyrinth', 'dungeon'];
          const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
          setScene(randomScene)
        }}/>
      </div>
      }
    </>
  )
}