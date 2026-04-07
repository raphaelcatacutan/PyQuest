import { usePlayerStore } from "@/src/game/store"
import { painHud } from "@/src/assets"

export default function Damaged(){
  const isDamaged = usePlayerStore(s => s.isDamaged)

  return (
    <>
      {isDamaged && (
        <div className="absolute w-full h-full z-100 opacity-50 transition pointer-events-none" style={{ backgroundImage: `url(${painHud})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: "repeat" }}/>
      )}
    </>
  )
}