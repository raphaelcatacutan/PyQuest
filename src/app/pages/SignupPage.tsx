import { useState } from "react";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const canSignup =
    username.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: hook this into your auth/status logic
    console.log({ username, email, password });
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
              Create your character. Begin your journey.
            </p>
          </div>

          {/* "RPG divider" */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Character Creation
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
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="your@email.com"
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
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-gray-100 placeholder:text-gray-500 outline-none focus:border-yellow-200/60 focus:ring-2 focus:ring-yellow-200/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-gray-300">
                Confirm Password
              </label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-gray-100 placeholder:text-gray-500 outline-none focus:border-yellow-200/60 focus:ring-2 focus:ring-yellow-200/20"
              />
            </div>

            <button
              type="submit"
              disabled={!canSignup}
              className="w-full rounded-xl bg-yellow-300 px-4 py-3 font-semibold text-gray-400 hover:text-gray-200 transition hover:border-input-focus active:translate-y-px disabled:cursor-not-allowed"
            >
              Create Character
            </button>

            <div className="text-center text-xs text-gray-400">
              <button
                type="button"
                className="underline decoration-white/20 underline-offset-4 hover:text-gray-200"
                onClick={() => alert("Back to login coming soon!")}
              >
                Already have a character? Login here
              </button>
            </div>
          </form>

          {/* Footer flavor text */}
          <p className="mt-6 text-center text-xs text-gray-500">
            Tip: Choose your username wisely—it defines your legacy.
          </p>
        </div>
      </div>
    </div>
  );
}
