import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/global.css'
import App from './App.tsx'
import WatcherTestPage from './tests/backend-test.tsx'
import LoginPage from './pages/LoginPage.tsx'
import GamePage from './pages/GamePage.tsx'

/**
 *  
 *  Bootloader
 */

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path='/game' element={<GamePage/>}/>  
        <Route path='/login' element={<LoginPage/>}/>
        <Route path="/test" element={<WatcherTestPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)