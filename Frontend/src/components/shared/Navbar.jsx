import useAuthStore from "../../stores/useAuthStore";
import useChatStore from "../../stores/useChatStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { syncMode, stopSync } = useChatStore();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6"
      style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ProjectU
        </span>
        <span className="text-zinc-600 text-xs">♡</span>
      </div>

      {/* sync pill — center */}
      {syncMode && (
        <div className="flex items-center gap-2 bg-purple-900/40 border border-purple-700/50 px-4 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
          <span className="text-xs text-purple-300 font-medium">Listening together</span>
          <button onClick={stopSync} className="text-xs text-red-400/70 hover:text-red-400 transition ml-1">
            stop
          </button>
        </div>
      )}

      {/* User */}
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">{user.username}</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-900/30">
            {user.username?.[0]?.toUpperCase()}
          </div>
          <button onClick={logout} className="text-xs text-zinc-500 hover:text-zinc-300 transition">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}