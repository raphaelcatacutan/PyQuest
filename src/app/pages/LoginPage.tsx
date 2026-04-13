import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "@/src/game/store";
import { useState } from "react";
import showToast from '@/src/components/ui/Toast'
import { useShallow } from "zustand/shallow";
import { useInventoryStore, loadInventoryProfile } from "@/src/game/store/inventoryStore";
import DevTool from "@/src/components/DevTool";
import { registerUser, userExists } from "@/src/game/services/authService";
import { useSoundStore } from "@/src/game/store/soundStore";

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingUsername, setPendingUsername] = useState("");
  const { user_id, setUserId} = usePlayerStore(
    useShallow((s) => ({
      user_id: s.user_id,
      setUserId: s.setUserId
    }))
  )
  const { player_id, setPlayerId } = useInventoryStore(
    useShallow((s) => ({
      player_id: s.player_id,
      setPlayerId: s.setPlayerId
    }))
  )
  const initSounds = useSoundStore(s => s.initSounds)

  const proceedToGame = async (usernameToProcess: string) => {
    setUserId(usernameToProcess);
    await loadInventoryProfile(usernameToProcess);
    setPlayerId(usernameToProcess);
    // Load other data
    initSounds()
    navigate('/game');
    showToast({ variant: "success", message: "Welcome, adventurer!" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!username.trim()) {
      showToast({ variant: "error", message: "Please enter a username" });
      return;
    }

    // Check if user exists
    if (userExists(username)) {
      // User exists, proceed to game
      await proceedToGame(username);
    } else {
      // User does not exist, show confirmation dialog
      setPendingUsername(username);
      setShowConfirmDialog(true);
    }
  }

  const handleCreateAccount = async () => {
    if (registerUser(pendingUsername)) {
      setShowConfirmDialog(false);
      setUsername("");
      await proceedToGame(pendingUsername);
    } else {
      showToast({ variant: "error", message: "Failed to create account" });
      setShowConfirmDialog(false);
    }
  }

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setPendingUsername("");
  }


  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <DevTool/>

      <div className="absolute inset-0"></div>

      {/* Center container */}
      <div className="relative z-10 flex h-full w-full items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border-3 border-gray-500 p-8 shadow-2xl backdrop-blur">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl tracking-wide border-l-indigo-50">
              PyQuest
            </h1>
            <p className="mt-2 text-sm text-gray-300">
              Enter the realm. Sharpen your typing. Learn Python.
            </p>
          </div>

          {/* “RPG divider” */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Adventurer Login
            </span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-gray-300">
                Username
              </label>
              <input
                autoFocus={true}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. AriaStorm"
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-gray-100 placeholder:text-gray-500 outline-none focus:border-yellow-200/60 focus:ring-2 focus:ring-yellow-200/20"
              />
            </div>
            
            <button
              type="submit"
              className="w-full rounded-xl bg-zinc-700 px-4 py-3 font-semibold text-gray-400  cursor-pointer hover:text-gray-200 transition hover:border-input-focus active:translate-y-px disabled:cursor-not-allowed"
            >
              Begin Adventure
            </button>
          </form>

          {/* Footer flavor text */}
          <p className="mt-6 text-center text-xs text-gray-500">
            Tip: In PyQuest, typing accuracy is your strongest weapon.
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-2xl border-3 border-gray-500 bg-gray-900 p-8 shadow-2xl">
            <h2 className="mb-4 text-center text-xl font-semibold text-gray-100">
              Create New Account?
            </h2>
            <p className="mb-6 text-center text-[20px] text-gray-300">
              The username <span className="font-semibold text-yellow-300">{pendingUsername}</span> does not exist. Would you like to create a new account with this username?
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-xl border-2 border-gray-500 px-4 py-2 font-semibold text-gray-300 cursor-pointer hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAccount}
                className="flex-1 rounded-xl bg-yellow-600 px-4 py-2 font-semibold text-gray-100 cursor-pointer hover:bg-yellow-500 transition"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
