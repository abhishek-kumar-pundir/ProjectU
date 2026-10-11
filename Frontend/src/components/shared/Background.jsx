const PARTICLES = [
  { size: 2.4, left: 12, bg: "#c084fc", duration: 18, delay: 1 },
  { size: 3.1, left: 24, bg: "#fb7185", duration: 22, delay: 4 },
  { size: 1.8, left: 38, bg: "#f0abfc", duration: 16, delay: 7 },
  { size: 2.8, left: 52, bg: "#c084fc", duration: 24, delay: 2 },
  { size: 3.5, left: 66, bg: "#fb7185", duration: 19, delay: 6 },
  { size: 1.5, left: 78, bg: "#f0abfc", duration: 21, delay: 3 },
  { size: 2.2, left: 88, bg: "#c084fc", duration: 17, delay: 8 },
  { size: 3.0, left: 8, bg: "#fb7185", duration: 23, delay: 5 },
  { size: 1.9, left: 45, bg: "#f0abfc", duration: 20, delay: 9 },
  { size: 2.7, left: 60, bg: "#c084fc", duration: 15, delay: 2 },
  { size: 3.2, left: 72, bg: "#fb7185", duration: 25, delay: 6 },
  { size: 1.6, left: 94, bg: "#f0abfc", duration: 18, delay: 4 },
];

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* base */}
      <div className="absolute inset-0 bg-[#080810]" />

      {/* large ambient orbs */}
      <div className="absolute top-[-30%] left-[-15%] w-[700px] h-[700px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", animation: "drift 20s ease-in-out infinite" }} />
      <div className="absolute bottom-[-30%] right-[-15%] w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(251,113,133,0.08) 0%, transparent 70%)", animation: "drift 25s ease-in-out infinite reverse" }} />
      <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(circle, rgba(240,171,252,0.06) 0%, transparent 70%)", animation: "pulse-glow 8s ease-in-out infinite" }} />

      {/* grid overlay */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      {/* floating particles */}
      {PARTICLES.map((p, i) => (
        <div key={i}
          className="absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            bottom: "-10px",
            background: p.bg,
            opacity: 0,
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }} />
    </div>
  );
}