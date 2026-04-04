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
      {[...Array(12)].map((_, i) => (
        <div key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${Math.random() * 100}%`,
            bottom: "-10px",
            background: i % 3 === 0 ? "#c084fc" : i % 3 === 1 ? "#fb7185" : "#f0abfc",
            opacity: 0,
            animation: `float-up ${Math.random() * 15 + 10}s linear ${Math.random() * 10}s infinite`,
          }}
        />
      ))}

      {/* subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }} />
    </div>
  );
}