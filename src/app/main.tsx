import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/global.css'
import App from './App.tsx'
import WatcherTestPage from './tests/backend-test.tsx'
import LoginPage from './pages/LoginPage.tsx'
import GamePage from './pages/GamePage.tsx'
import SignupPage from './pages/SignupPage.tsx'
import UnifiedArchitect from './tests/UnifiedArchitect.tsx'
import { ToastContainer } from "react-toastify"
import { Guide } from '../components/ui/Guide.tsx'

/**
 *  
 *  Bootloader
 */

createRoot(document.getElementById('root')!).render(
  <>
    <Guide/>
    <ToastContainer stacked/>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path='/game' element={<GamePage/>}/>  
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/signup' element={<SignupPage/>}/>
          <Route path="/test" element={<WatcherTestPage />} />
          <Route path="/architect" element={<UnifiedArchitect/>}/>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </>
)