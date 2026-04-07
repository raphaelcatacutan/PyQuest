import Button from "./ui/Button"
import { 
  useEnemyStore, 
  useGameStore,
  usePlayerStore,
  useDialogueBoxStore,
  useSceneStore,
  useTerminalStore,
} from "../game/store"
import { SceneTypes } from "../game/types/scene.types"
import { useState } from "react"

export default function Test(){
  const [input, setInput] = useState("")
  const toggleIsThereEnemy = useGameStore(s => s.toggleIsThereEnemy)
  const clearEnemy = useEnemyStore(s => s.clearEnemy)
  const takeDamage = useEnemyStore(s => s.takeDamage)
  const toggleIsDamaged = usePlayerStore(s => s.toggleIsDamaged)
  const toggleDisplayDialogueBox = useDialogueBoxStore(s => s.toggleDisplayDialogueBox)
  const setScene = useSceneStore(s => s.setScene)
  const user_id = usePlayerStore(s => s.user_id)

  const appendToLogs = useTerminalStore(s => s.appendToLog)


  const handleTest = () => {
    takeDamage(20)
  }
  
  return (
    <div className="absolute z-101 bottom-0 right-0 flex gap-2 w-fit p-1 border bg-zinc-900">
      <span>DevTool:</span>
      <input type="text" className="border bg-zinc-800" value={input} onChange={(e) => setInput(e.target.value)}></input>
      <Button text="Display ID" onClick={() => {console.log(`Player: ${user_id}`)}}/>
      <Button text="Toggle Enemy" onClick={() => {
        toggleIsThereEnemy()
        clearEnemy()
      }}
      />
      <Button text="Hit Enemy" onClick={handleTest}/>
      <Button text="Dmg HUD" onClick={toggleIsDamaged}/>
      <Button text="Dialogue Box" onClick={toggleDisplayDialogueBox}/>
      <Button text="Add Terminal" onClick={() => {appendToLogs(input)}}/>
      <Button text="Random Scene" onClick={() => {
        const scenes: SceneTypes[] = ['village', 'labyrinth', 'dungeon'];
        const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
        setScene(randomScene)
      }}/>
    </div>
  )
}