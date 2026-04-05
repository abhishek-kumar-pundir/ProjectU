import useChatStore from "../../stores/useChatStore";

export default function MusicBackground() {
  const { syncMode } = useChatStore();
  const notes = ["♪", "♫", "♩", "♬", "♪", "♫", "♩", "♬", "♪", "♫", "♩", "♬", "♪", "♡", "♬"];
  const barCount = 28;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">

      {/* ── ALWAYS: ambient orbs ── */}
      <div className="absolute rounded-full"
        style={{
          width: "380px", height: "380px",
          background: "radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)",
          top: "-100px", left: "-80px",
          animation: "drift 22s ease-in-out infinite",
          filter: "blur(70px)",
        }} />
      <div className="absolute rounded-full"
        style={{
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)",
          bottom: "-80px", right: "-60px",
          animation: "drift 28s ease-in-out infinite reverse",
          filter: "blur(70px)",
        }} />

      {/* ── ALWAYS: waveform lines ── */}
      <div className="absolute inset-x-10 top-1/2 -translate-y-1/2 flex flex-col gap-5">
        {[
          { w: 60, ml: 5,  dur: 4.0, color: "139,92,246" },
          { w: 40, ml: 55, dur: 5.5, color: "236,72,153" },
          { w: 75, ml: 10, dur: 3.5, color: "139,92,246" },
          { w: 35, ml: 40, dur: 6.0, color: "167,139,250" },
          { w: 55, ml: 8,  dur: 4.8, color: "236,72,153" },
          { w: 45, ml: 50, dur: 3.8, color: "139,92,246" },
        ].map(({ w, ml, dur, color }, i) => (
          <div key={i} className="rounded-full"
            style={{
              height: "1px",
              width: `${w}%`,
              marginLeft: `${ml}%`,
              background: `linear-gradient(90deg, transparent, rgba(${color},0.3), transparent)`,
              animation: `pulse-glow ${dur}s ease-in-out ${i * 0.5}s infinite alternate`,
            }} />
        ))}
      </div>

      {/* ── ALWAYS: star dots ── */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: `${1.5 + (i % 2)}px`,
            height: `${1.5 + (i % 2)}px`,
            left: `${12 + i * 10}%`,
            top: `${20 + (i % 4) * 18}%`,
            background: i % 2 === 0 ? "rgba(167,139,250,0.4)" : "rgba(251,113,133,0.35)",
            boxShadow: i % 2 === 0 ? "0 0 5px rgba(167,139,250,0.5)" : "0 0 5px rgba(251,113,133,0.4)",
            animation: `pulse-glow ${2 + (i % 3) * 1.2}s ease-in-out ${i * 0.5}s infinite alternate`,
          }} />
      ))}

      {/* ── SYNC ONLY: equalizer bars ── */}
      <div className="absolute bottom-14 left-0 right-0 flex items-end justify-center gap-[3px] px-5"
        style={{
          height: "160px",
          opacity: syncMode ? 1 : 0,
          transition: "opacity 1.8s ease",
          pointerEvents: "none",
        }}>
        {Array.from({ length: barCount }).map((_, i) => {
          const isEdge = i < 3 || i > barCount - 4;
          const isMid = i > barCount / 2 - 3 && i < barCount / 2 + 3;
          const baseH = isEdge ? 20 : isMid ? 90 : 35 + (i % 5) * 16;
          const color = i % 3 === 0 ? "124,58,237" : i % 3 === 1 ? "168,85,247" : "236,72,153";
          return (
            <div key={i} className="flex-1"
              style={{
                maxWidth: "9px", minWidth: "3px",
                height: `${baseH}px`,
                background: `linear-gradient(
                  to top,
                  rgba(${color},0.65) 0%,
                  rgba(${color},0.35) 45%,
                  rgba(${color},0.08) 80%,
                  transparent 100%
                )`,
                borderRadius: "3px 3px 0 0",
                animation: syncMode
                  ? `pulse-glow ${0.5 + (i % 7) * 0.16}s ease-in-out ${i * 0.05}s infinite alternate`
                  : "none",
              }} />
          );
        })}
      </div>

      {/* ── SYNC ONLY: floating notes + 1 heart at position 14 ── */}
      {notes.map((note, i) => (
        <div key={i} className="absolute select-none"
          style={{
            fontSize: note === "♡"
              ? "18px"
              : `${12 + (i % 4) * 7}px`,
            left: `${5 + i * 6.2}%`,
            bottom: "-30px",
            opacity: 0,
            color: note === "♡"
              ? "rgba(251,113,133,0.55)"
              : i % 2 === 0
                ? "rgba(192,160,255,0.5)"
                : "rgba(244,114,182,0.45)",
            animation: syncMode
              ? `float-up ${13 + i * 1.8}s linear ${i * 2.2}s infinite`
              : "none",
            filter: note === "♡" ? "blur(0.3px)" : "none",
          }}>
          {note}
        </div>
      ))}

    </div>
  );
}