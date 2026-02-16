import LoginPage from "./pages/LoginPage"
import GamePage from './pages/GamePage'
// import { useState } from "react"
// import { useStore } from "./store/useStore"

/**
 * 
 *  Main Page Router
 */

export default function App() {
  // const user = useStore(state => state.user)
  const status = true

  return (
    <div className="bg-[url('/assets/wallpaper.jpg')] bg-cover bg-center h-screen w-screen overflow-hidden">
        {!status ? <LoginPage /> : <GamePage />}
    </div>
  )
}