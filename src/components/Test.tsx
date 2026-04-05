import Button from "./ui/Button"

import { useEnemyStore } from "../game/store"

export default function Test(){
  const enemyImg = useEnemyStore(s => s.enemyImg)
  const takeDamage = useEnemyStore(s => s.takeDamage)

  const handleTest = () => {
    takeDamage(20)
  }
  
  return (
    <div className="absolute w-fit border">
      <Button text="Test" onClick={handleTest}/>
    </div>
  )
}