import { useState, useRef, useEffect } from "react";
import useAuthStore from "../../stores/useAuthStore";
import useChatStore from "../../stores/useChatStore";
import { SmartImage, useFastLoadMetrics } from "react-fastload";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { syncMode, stopSync } = useChatStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const metrics = useFastLoadMetrics();

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 h-12 z-50 flex items-center justify-between px-8"
      style={{
        background: "rgba(8,8,16,0.9)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)"
      }}>

      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <SmartImage
          src="/favicon.png"
          alt="ProjectU Logo"
          priority="CRITICAL"
          strategy="eager"
          width={24}
          height={24}
          className="w-6 h-6 rounded-lg object-contain shadow-sm shadow-purple-500/50"
          style={{ width: 24, height: 24 }}
        />
        <span className="font-display text-2xl font-semibold shimmer-text tracking-wide">
          ProjectU
        </span>
      </div>

      {/* sync pill */}
      {syncMode && (
        <div className="flex items-center gap-2.5 px-5 py-2 rounded-full"
          style={{
            background: "rgba(124,58,237,0.2)",
            border: "1px solid rgba(192,132,252,0.4)"
          }}>
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-sm text-purple-200 font-medium tracking-wide">listening together</span>
          <button onClick={stopSync}
            className="text-xs text-rose-400/70 hover:text-rose-400 transition ml-1 font-medium">
            stop
          </button>
        </div>
      )}

      {/* User + dropdown */}
      {user && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(v => !v)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-full transition-all duration-200"
            style={{
              background: dropdownOpen ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${dropdownOpen ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.08)"}`,
            }}>
            <span className="text-sm text-zinc-300 hidden sm:block">{user.username}</span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                boxShadow: "0 4px 16px rgba(124,58,237,0.5)"
              }}>
              {user.username?.[0]?.toUpperCase()}
            </div>
            {/* chevron */}
            <svg className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden"
              style={{
                background: "rgba(14,8,28,0.98)",
                border: "1px solid rgba(139,92,246,0.2)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
              }}>

              {/* user info header */}
              <div className="px-4 py-3.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.username}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* FastLoad scheduler status card */}
              <div className="mx-2 my-2 px-3 py-2 rounded-xl"
                style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <div className="flex items-center justify-between text-[11px] text-purple-300 font-medium mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    FastLoad Engine
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-purple-400/80">Active</span>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>Scheduled: {metrics.initialRequests + metrics.deferredRequests}</span>
                  <span>Deferred: {metrics.deferredRequests}</span>
                </div>
                {metrics.fcp && (
                  <div className="text-[9px] text-zinc-500 mt-1 border-t border-white/5 pt-1">
                    FCP: {Math.round(metrics.fcp)}ms {metrics.lcp ? `• LCP: ${Math.round(metrics.lcp)}ms` : ""}
                  </div>
                )}
              </div>

              {/* menu items */}
              <div className="p-2">
                <button
                  onClick={() => { logout(); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:text-rose-300 transition-all duration-150 group"
                  style={{ background: "transparent" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(251,113,133,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}