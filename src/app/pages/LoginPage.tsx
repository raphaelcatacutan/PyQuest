import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const canLogin = username.trim().length > 0 && password.length > 0;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: hook this into your auth/status logic
    console.log({ username, password });
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Optional vignette overlay (works great on top of your wallpaper parent) */}
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. AriaStorm"
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-gray-100 placeholder:text-gray-500 outline-none focus:border-yellow-200/60 focus:ring-2 focus:ring-yellow-200/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-gray-300">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-gray-100 placeholder:text-gray-500 outline-none focus:border-input-focus/60 focus:ring-2 focus:ring-yellow-200/20"
              />
            </div>

            <button
              type="submit"
              disabled={!canLogin}
              className="w-full rounded-xl bg-yellow-300 px-4 py-3 font-semibold text-gray-400 hover:text-gray-200 transition hover:border-input-focus active:translate-y-px disabled:cursor-not-allowed"
            >
              Begin Adventure
            </button>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <button
                type="button"
                className="underline decoration-white/20 underline-offset-4 hover:text-gray-200"
                onClick={() => alert("Create character coming soon!")}
              >
                Create character
              </button>
              <button
                type="button"
                className="underline decoration-white/20 underline-offset-4 hover:text-gray-200"
                onClick={() => alert("Forgot password coming soon!")}
              >
                Forgot password?
              </button>
            </div>
          </form>

          {/* Footer flavor text */}
          <p className="mt-6 text-center text-xs text-gray-500">
            Tip: In PyQuest, typing accuracy is your strongest weapon.
          </p>
        </div>
      </div>
    </div>
  );
}
