import Button from "./ui/Button"
import { 
  useEnemyStore, 
  useGameStore,
  usePlayerStore,
  useDialogueBoxStore,
  useSceneStore
} from "../game/store"
import { SceneTypes } from "../game/types/scene.types"

export default function Test(){
  const toggleIsThereEnemy = useGameStore(s => s.toggleIsThereEnemy)
  const clearEnemy = useEnemyStore(s => s.clearEnemy)
  const takeDamage = useEnemyStore(s => s.takeDamage)
  const toggleIsDamaged = usePlayerStore(s => s.toggleIsDamaged)
  const toggleDisplayDialogueBox = useDialogueBoxStore(s => s.toggleDisplayDialogueBox)
  const setScene = useSceneStore(s => s.setScene)

  const handleTest = () => {
    takeDamage(20)
  }
  
  return (
    <div className="absolute z-101 bottom-0 right-0 flex gap-2 w-fit p-1 border bg-zinc-900">
      <span>DevTool:</span>
      <Button text="Toggle Enemy" onClick={() => {
        toggleIsThereEnemy()
        clearEnemy()
      }}
      />
      <Button text="Hit Enemy" onClick={handleTest}/>
      <Button text="Display Damage" onClick={toggleIsDamaged}/>
      <Button text="Dialogue Box" onClick={toggleDisplayDialogueBox}/>
      <Button text="Random Scene" onClick={() => {
        const scenes: SceneTypes[] = ['village', 'labyrinth', 'dungeon'];
        const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
        setScene(randomScene)
      }}/>
    </div>
  )
}