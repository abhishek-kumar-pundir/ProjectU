import { useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import Background from "./Background";

export default function PairingGate() {
  const { generateInviteCode, redeemInviteCode, logout } = useAuthStore();
  const [mode, setMode] = useState(null); // null | "generate" | "redeem"
  const [code, setCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await generateInviteCode();
      setCode(res.code);
      setMode("generate");
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't create a code");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    setError("");
    setLoading(true);
    try {
      await redeemInviteCode(inputCode.trim());
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't pair with that code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Background />

      <div className="w-full max-w-sm">
        <div className="text-center mb-10 animate-fade-up">
          <h1 className="font-display text-5xl font-semibold tracking-tight shimmer-text mb-2">
            almost there
          </h1>
          <p className="text-sm text-[var(--muted)] tracking-[0.2em] uppercase font-light">
            pair with your person
          </p>
        </div>

        <div className="glass rounded-3xl p-8 animate-fade-up delay-200 space-y-4">
          {!mode && (
            <>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
                  boxShadow: "0 8px 32px rgba(124,58,237,0.3)",
                }}
              >
                {loading ? "Creating..." : "Create an invite code"}
              </button>
              <button
                onClick={() => { setMode("redeem"); setError(""); }}
                className="w-full py-3.5 rounded-2xl text-sm font-medium border border-white/10 text-white/80 hover:text-white hover:bg-white/5 transition-all"
              >
                I have a code
              </button>
            </>
          )}

          {mode === "generate" && code && (
            <div className="text-center space-y-3 animate-fade-up">
              <p className="text-xs text-[var(--muted)] uppercase tracking-widest">
                share this with your person
              </p>
              <p className="text-3xl font-mono tracking-[0.3em] text-white">{code}</p>
              <p className="text-xs text-zinc-500">expires in 15 minutes</p>
              <button
                onClick={() => { setMode(null); setCode(""); }}
                className="text-xs text-purple-400 hover:text-purple-300 transition"
              >
                ← back
              </button>
            </div>
          )}

          {mode === "redeem" && (
            <div className="space-y-3 animate-fade-up">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
                placeholder="Enter their code"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-center tracking-[0.3em] outline-none focus:border-purple-400/50 focus:bg-white/8 placeholder-zinc-600 transition-all"
              />
              <button
                onClick={handleRedeem}
                disabled={loading || !inputCode.trim()}
                className="w-full py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
                  boxShadow: "0 8px 32px rgba(124,58,237,0.3)",
                }}
              >
                {loading ? "Pairing..." : "Pair up"}
              </button>
              <button
                onClick={() => { setMode(null); setError(""); }}
                className="w-full text-center text-xs text-purple-400 hover:text-purple-300 transition"
              >
                ← back
              </button>
            </div>
          )}

          {error && (
            <p className="text-xs text-rose-400 text-center animate-fade-up">{error}</p>
          )}
        </div>

        <button
          onClick={logout}
          className="w-full text-center text-xs text-zinc-600 hover:text-zinc-400 mt-8 tracking-widest uppercase transition"
        >
          sign out
        </button>
      </div>
    </div>
  );
}
