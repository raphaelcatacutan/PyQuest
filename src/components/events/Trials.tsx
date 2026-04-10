import { 
  useSceneStore,
  useTrialsStore 
} from "@/src/game/store";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import Card from "../ui/Card";
import { getDPByDifficulty } from "@/src/game/data/trials";
import { DebugProblems } from "@/src/game/data/trials";

export default function Trials(){
  const scene = useSceneStore(s => s.scene)
  const { inTrials, toggleInTrials, resetTrials } = useTrialsStore(
    useShallow((s) => ({
      inTrials: s.inTrials,
      toggleInTrials: s.toggleInTrials,
      resetTrials: s.resetTrials
    }))
  )
  const { currEasy, maxEasy, currMedium, maxMedium, currHard, maxHard } = useTrialsStore(
    useShallow((s) => ({
      currEasy: s.currEasy,
      maxEasy: s.maxEasy,
      currMedium: s.currMedium,
      maxMedium: s.maxMedium,
      currHard: s.currHard,
      maxHard: s.maxHard,
    }))
  )
  const { mode, setMode } = useTrialsStore(
    useShallow((s) => ({
      mode: s.mode,
      setMode: s.setMode
    }))
  )
  const { debugProblem, setDebugProblem } = useTrialsStore(
    useShallow((s) => ({
      debugProblem: s.debugProblem,
      setDebugProblem: s.setDebugProblem
    }))
  )
  
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds

  useEffect(() => {
    if (scene == "trials"){
      const timer = setTimeout(() => { toggleInTrials(true) }, 1500)
      return () => clearTimeout(timer);
    } else { resetTrials() }
  }, [scene])

  useEffect(() => {
    const easyDP = getDPByDifficulty("easy")
    const easyLength = easyDP.length
    const mediumDP = getDPByDifficulty("medium")
    const mediumLength = easyDP.length
    const hardDP = getDPByDifficulty("hard")
    const hardLength = easyDP.length

    switch(mode){
      case 'easy':
        return setDebugProblem(easyDP[currEasy].incorrectCode)
      case 'medium':
        return setDebugProblem(mediumDP[currMedium].incorrectCode)
      case 'hard':
        return setDebugProblem(hardDP[currHard].incorrectCode)
      default:
        return setDebugProblem("")
    }
  }, [mode])

  // useEffect(() => {
  //   if (!inTrials || mode === '' || timeLeft <= 0) return

  //   const interval = setInterval(() => {
  //     setTimeLeft(prev => prev <= 1 ? 0 : prev - 1)
  //   }, 1000)

  //   return () => clearInterval(interval)
  // }, [inTrials, mode, timeLeft])

  
  const easyDP = getDPByDifficulty("easy")

  return (
    <>
      {inTrials && (
        <div className="absolute z-5 w-full h-full opacity-100">
          <div className="flex flex-col items-center justify-center h-full">
          {mode == '' ? 
            <>
              <div className="mb-2">
                <span>Tip: challenge("difficulty")</span>
              </div>
              <div className="flex flex-row gap-8">
                <Card header="Easy" body="..." currProg={currEasy} maxProg={maxEasy} />
                <Card header="Medium" body="..." currProg={currMedium} maxProg={maxMedium} />
                <Card header="Hard" body="..." currProg={currHard} maxProg={maxHard} />
              </div>
            </>
          :
            <>
              <span>
                Difficulty: {mode}
              </span>
              <div className="flex flex-col w-3/4 h-3/4 rounded-2xl bg-header border border-e-amber-50 opacity-95 p-5">
                {/* Problem */}
                <span className="h-full overflow-y-auto mb-2 font-[code]">
                  {debugProblem}
                  {easyDP[0].incorrectCode}
                </span>
                
                {/* Timer */}
                {/* <div className="border border-red-500 rounded p-2 text-center">
                  <div className="text-sm text-gray-400">Time Left</div>
                  <div className={`text-3xl font-bold ${timeLeft <= 30 ? 'text-red-500' : timeLeft <= 60 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                  </div>
                </div> */}
              </div>
            </>
          }
            
          </div>
        </div>
      )}
    </>
  ) 
}