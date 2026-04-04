import LoginPage from "./pages/LoginPage"
import 'react-toastify/dist/ReactToastify.css'

/**
 * 
 *  Main Page Router
 */

export default function App() {
  return (
    <div className="bg-[url('/assets/wallpaper.jpg')] bg-cover bg-center h-screen w-screen overflow-hidden">
        <LoginPage/>
    </div>
  )
}