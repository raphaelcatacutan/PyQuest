import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/global.css'
import App from './App.tsx'
import WatcherTestPage from './tests/backend-test.tsx'
import LoginPage from './pages/LoginPage.tsx'
import GamePage from './pages/GamePage.tsx'
import SignupPage from './pages/SignupPage.tsx'
import BossCreator from './tests/BossArchitect.tsx'
import EnemyCreator from './tests/EnemyArchitect.tsx'
import ConsumableCreator from './tests/ConsumableArchitect.tsx'
import ArmorCreator from './tests/ArmorArchitect.tsx'
import WeaponCreator from './tests/WeaponArchitect.tsx'
import { ToastContainer } from "react-toastify"

/**
 *  
 *  Bootloader
 */

createRoot(document.getElementById('root')!).render(
  <>
    <ToastContainer stacked/>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path='/game' element={<GamePage/>}/>  
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/signup' element={<SignupPage/>}/>
          <Route path="/test" element={<WatcherTestPage />} />
          <Route path="/boss" element={<BossCreator/>}/>
          <Route path="/enemy" element={<EnemyCreator/>}/>
          <Route path="/consumable" element={<ConsumableCreator/>}/>
          <Route path="/armor" element={<ArmorCreator/>}/>
          <Route path="/weapon" element={<WeaponCreator/>}/>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </>
)