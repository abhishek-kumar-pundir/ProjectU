import { useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import Background from "../components/shared/Background";

export default function LoginPage() {
  const { login, register } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Background />

      <div className="w-full max-w-sm">

        {/* logo mark */}
        <div className="text-center mb-10 animate-fade-up">
          <div className="flex justify-center mb-4">
            <div className="p-1.5 rounded-3xl bg-white/[0.04] border border-white/10 shadow-xl shadow-purple-500/10 backdrop-blur-md">
              <img
                src="/favicon.png"
                alt="ProjectU Logo"
                width={56}
                height={56}
                className="w-14 h-14 rounded-2xl object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <h1 className="font-display text-6xl font-semibold tracking-tight shimmer-text mb-2">
            ProjectU
          </h1>
          <p className="text-sm text-[var(--muted)] tracking-[0.2em] uppercase font-light">
            your private space
          </p>
        </div>

        {/* card */}
        <div className="glass rounded-3xl p-8 animate-fade-up delay-200">

          {/* tab switcher */}
          <div className="flex bg-white/5 rounded-2xl p-1 mb-8">
            {["Sign in", "Sign up"].map((label, i) => (
              <button key={label}
                onClick={() => { setIsLogin(i === 0); setError(""); }}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isLogin === (i === 0)
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-[var(--muted)] hover:text-white"
                }`}>
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <div className="animate-fade-up">
                <label className="text-xs text-[var(--muted)] tracking-widest uppercase mb-2 block">
                  Username
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="how she knows you"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-purple-400/50 focus:bg-white/8 placeholder-zinc-600 transition-all"
                />
              </div>
            )}

            <div className="animate-fade-up delay-100">
              <label className="text-xs text-[var(--muted)] tracking-widest uppercase mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-purple-400/50 focus:bg-white/8 placeholder-zinc-600 transition-all"
              />
            </div>

            <div className="animate-fade-up delay-200">
              <label className="text-xs text-[var(--muted)] tracking-widest uppercase mb-2 block">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-purple-400/50 focus:bg-white/8 placeholder-zinc-600 transition-all"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-400 text-center animate-fade-up">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="animate-fade-up delay-300 w-full py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 disabled:opacity-40 mt-2"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
                backgroundSize: "200% 200%",
                boxShadow: "0 8px 32px rgba(124,58,237,0.3)",
              }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLogin ? "Signing in..." : "Creating..."}
                </span>
              ) : (
                isLogin ? "Enter your space →" : "Create your space →"
              )}
            </button>
          </div>

          <p className="text-center text-xs text-[var(--muted)] mt-6">
            {isLogin ? "New here? " : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-purple-400 hover:text-purple-300 transition">
              {isLogin ? "Create a space" : "Sign in"}
            </button>
          </p>
        </div>

        {/* bottom tagline */}
        <p className="text-center text-xs text-zinc-700 mt-8 animate-fade-up delay-500 tracking-widest uppercase">
          just for two
        </p>
      </div>
    </div>
  );
}