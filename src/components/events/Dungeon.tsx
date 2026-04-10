import { useShallow } from "zustand/shallow";
import BossEncounter from "./BossEncounter";
import { 
  useSceneStore,
  useDungeonStore, 
  useBossStore
} from "@/src/game/store";
import Card from "../ui/Card";
import { useEffect } from "react";
import { getMPByDifficulty } from "@/src/game/data/dungeon";

export default function Dungeon(){
  const scene = useSceneStore(s => s.scene)
  const { inDungeon, toggleInDungeon, resetDungeon, mode } = useDungeonStore(
    useShallow((s) => ({
      inDungeon: s.inDungeon,
      toggleInDungeon: s.toggleInDungeon,
      resetDungeon: s.resetDungeon,
      mode: s.mode
    }))
  )
  const { currEasy, maxEasy, currMedium, maxMedium, currHard, maxHard } = useDungeonStore(
    useShallow((s) => ({
      currEasy: s.currEasy,
      maxEasy: s.maxEasy,
      currMedium: s.currMedium,
      maxMedium: s.maxMedium,
      currHard: s.currHard,
      maxHard: s.maxHard,
    }))
  )
  const { machineProblem, setMachineProblem } = useDungeonStore(
    useShallow((s) => ({
      machineProblem: s.machineProblem,
      setMachineProblem: s.setMachineProblem
    }))
  )
  const { spawnBoss } = useBossStore(
    useShallow((s) => ({
      spawnBoss: s.spawnBoss
    }))
  )
  const { name, hp, maxHp, energy, maxEnergy, bossImg } = useBossStore(
    useShallow((s) => ({
      id: s.id,
      name: s.name,
      hp: s.hp,
      maxHp: s.maxHp,
      energy: s.energy,
      maxEnergy: s.maxEnergy,
      bossImg: s.bossImg,
      skills: s.skills
    }))
  )

  const healthPercentage = (hp / maxHp) * 100;
  const energyPercentage = (energy / maxEnergy) * 100;


  useEffect(() => {
    if (scene == "dungeon"){
      const timer = setTimeout(() => { toggleInDungeon(true) }, 1500)
      return () => clearTimeout(timer);
    } else { resetDungeon() }
    console.log(scene)
  }, [scene])

  useEffect(() => {
    const easyMP = getMPByDifficulty("easy")
    const easyLength = easyMP.length
    const mediumMP = getMPByDifficulty("medium")
    const mediumLength = easyMP.length
    const hardDP = getMPByDifficulty("hard")
    const hardLength = easyMP.length

    switch(mode){
      case 'easy':
        return setMachineProblem(easyMP[currEasy].problem)
      case 'medium':
        return setMachineProblem(mediumMP[currMedium].problem)
      case 'hard':
        return setMachineProblem(hardDP[currHard].problem)
      default:
        return setMachineProblem("")
    }
  }, [mode])


  return (
    <>
    {inDungeon && (
        <div className="absolute z-5 w-full h-full opacity-100">
          <div className="flex flex-col items-center justify-center h-full">
          { mode == '' ? 
            <>
              <div className="mb-2">
                <span>Dungeon</span>
              </div>
              <div className="flex flex-row gap-8">
                <Card header="Easy" body="..." currProg={currEasy} maxProg={maxEasy} />
                <Card header="Medium" body="..." currProg={currMedium} maxProg={maxMedium} />
                <Card header="Hard" body="..." currProg={currHard} maxProg={maxHard} />
              </div>
            </>
            :
            <>
              <div className="flex w-full h-full items-center justify-center">
                <div className="flex w-8/10 h-8/10">
                  <div className="flex flex-col w-full gap-2 items-center justify-center">
                    <span className="text-3xl text-red-700">{name}</span>

                    <div className="relative w-80 h-5 overflow-hidden rounded-2xl bg-zinc-900">
                      <div className="bg-red-600 h-full transition-all duration-300" style={{ width: `${healthPercentage}%` }} />
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                        {hp}/{maxHp}
                      </span>
                    </div>
                   
                    <div className="relative w-80 h-5 overflow-hidden rounded-2xl bg-zinc-900">
                      <div className="bg-yellow-500 h-full transition-all duration-300" style={{ width: `${energyPercentage}%` }} />
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                        {energy}/{maxEnergy}
                      </span>
                    </div>
                   
                    <div className=" flex justify-center items-center">
                      <img src={bossImg} className="w-80 h-80" draggable={false}></img>
                    </div>
                  </div>
                  <div className="flex w-full p-5 bg-header items-center justify-center font-[code]">
                    <span className="h-full overflow-y-auto">
                      
                      {machineProblem}
                    </span>
                  </div>
                </div>

              </div>
            </>
          }
          </div>
        </div>
    )}
    </>
  )
}