import { useEffect, useState } from "react";

const messages = [
  "setting the site...",
  "lighting the candles...",
  "syncing the world...",
  "almost there...",
  "just for two...",
];

export default function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % messages.length);
        setFade(true);
      }, 400);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "#080810" }}>

      {/* ambient orbs */}
      <div className="absolute rounded-full pointer-events-none"
        style={{
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          top: "-150px", left: "-100px",
          animation: "drift 18s ease-in-out infinite",
          filter: "blur(80px)",
        }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(236,72,153,0.13) 0%, transparent 70%)",
          bottom: "-120px", right: "-80px",
          animation: "drift 24s ease-in-out infinite reverse",
          filter: "blur(80px)",
        }} />

      {/* grid */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }} />

      {/* floating notes */}
      {["♪", "♫", "♩", "♬", "♪", "♫"].map((note, i) => (
        <div key={i} className="absolute select-none pointer-events-none"
          style={{
            fontSize: `${12 + (i % 3) * 6}px`,
            left: `${10 + i * 14}%`,
            bottom: "-20px",
            opacity: 0,
            color: i % 2 === 0 ? "rgba(192,160,255,0.5)" : "rgba(244,114,182,0.4)",
            animation: `float-up ${12 + i * 2}s linear ${i * 2.5}s infinite`,
          }}>
          {note}
        </div>
      ))}

      {/* logo */}
      <div className="animate-fade-up mb-12">
        <h1 className="font-display text-7xl font-semibold shimmer-text tracking-tight">
          ProjectU
        </h1>
        <p className="text-center text-xs tracking-[0.35em] uppercase mt-2"
          style={{ color: "rgba(255,255,255,0.2)" }}>
          just for two
        </p>
      </div>

      {/* vinyl spinner */}
      <div className="relative mb-12 animate-fade-up delay-200">
        <div style={{
          width: "72px", height: "72px",
          animation: "spin 3s linear infinite",
        }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} className="absolute inset-0 rounded-full"
              style={{
                border: `1px solid rgba(${i % 2 === 0 ? "139,92,246" : "236,72,153"},${0.5 - i * 0.08})`,
                margin: `${i * 6}px`,
              }} />
          ))}
          {/* center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                boxShadow: "0 0 12px rgba(124,58,237,0.8)",
              }} />
          </div>
        </div>

        {/* outer pulse ring */}
        <div className="absolute inset-0 rounded-full -m-3"
          style={{
            border: "1px solid rgba(139,92,246,0.15)",
            animation: "pulse-glow 2s ease-in-out infinite",
          }} />
      </div>

      {/* rotating message */}
      <div className="h-6 flex items-center justify-center animate-fade-up delay-300">
        <p style={{
          color: "rgba(255,255,255,0.35)",
          fontSize: "13px",
          letterSpacing: "0.15em",
          opacity: fade ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}>
          {messages[msgIndex]}
        </p>
      </div>

      {/* loading bar */}
      <div className="mt-8 animate-fade-up delay-400"
        style={{ width: "160px", height: "1px", background: "rgba(255,255,255,0.06)", borderRadius: "99px" }}>
        <div style={{
          height: "100%",
          borderRadius: "99px",
          background: "linear-gradient(90deg, #7c3aed, #ec4899)",
          boxShadow: "0 0 8px rgba(124,58,237,0.6)",
          animation: "loading-bar 2.5s ease-in-out infinite",
        }} />
      </div>

    </div>
  );
}