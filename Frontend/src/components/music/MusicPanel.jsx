import { useEffect, useRef, useState } from "react";
import useMusicStore from "../../stores/useMusicStore";
import useChatStore from "../../stores/useChatStore";
import UploadSong from "./UploadSong";
import { Play, Pause, SkipForward, SkipBack, Plus, X, Music2 } from "lucide-react";

export default function MusicPanel() {
  const {
    songs, currentSongIndex, isPlaying, currentTime,
    playSongAtIndex, resumeSong, pauseSong, seekTo,
    nextSong, prevSong, listenSocket, fetchSongs,
  } = useMusicStore();
  const { syncMode, stopSync } = useChatStore();

  const audioRef = useRef();
  const [progress, setProgress] = useState(0);
  const isSeeking = useRef(false);
  const [showUpload, setShowUpload] = useState(false);

  const currentSong = currentSongIndex !== null ? songs[currentSongIndex] : null;

  useEffect(() => { fetchSongs(); listenSocket(); }, []);

  useEffect(() => {
    if (!audioRef.current || currentSongIndex === null) return;
    const audio = audioRef.current;
    const newSrc = songs[currentSongIndex]?.fileUrl;
    if (audio.src !== newSrc) {
      audio.src = newSrc;
      audio.load();
      if (isPlaying) {
        const onCanPlay = () => {
          if (currentTime) audio.currentTime = currentTime;
          audio.play().catch(() => {});
          audio.removeEventListener("canplay", onCanPlay);
        };
        audio.addEventListener("canplay", onCanPlay);
      }
    }
  }, [currentSongIndex]);

  useEffect(() => {
    if (!audioRef.current || currentSongIndex === null) return;
    const audio = audioRef.current;
    if (!audio.src || audio.src === window.location.href) return;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current || isSeeking.current) return;
    const audio = audioRef.current;
    if (Math.abs(audio.currentTime - currentTime) > 1) audio.currentTime = currentTime;
  }, [currentTime]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress((audio.currentTime / audio.duration) * 100 || 0);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = (e.target.value / 100) * audio.duration;
    isSeeking.current = true;
    audio.currentTime = newTime;
    seekTo(newTime);
    setTimeout(() => { isSeeking.current = false; }, 300);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(160deg, rgba(20,10,35,0.95) 0%, rgba(12,8,24,0.98) 100%)",
        border: "1px solid rgba(139,92,246,0.15)",
        boxShadow: "0 0 40px rgba(139,92,246,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}>

      {/* header */}
      <div className="flex justify-between items-center px-5 pt-5 pb-3 shrink-0">
        <div>
  <h2 className="text-base font-semibold text-white/90 tracking-wide">Songs</h2>
  <p className="text-[11px] text-white/45 tracking-widest uppercase mt-0.5">
    {songs.length} tracks
  </p>
</div>
        <button onClick={() => setShowUpload(v => !v)}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: showUpload ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
          {showUpload ? <X size={13} className="text-purple-300" /> : <Plus size={13} className="text-white/60" />}
        </button>
      </div>

      {/* sync indicator */}
      {syncMode && (
        <div className="mx-5 mb-3 flex items-center justify-between px-3 py-2 rounded-xl shrink-0"
          style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs text-purple-300">listening together</span>
          </div>
          <button onClick={stopSync} className="text-[10px] text-rose-400/60 hover:text-rose-400 transition">end</button>
        </div>
      )}

      {/* upload form */}
      {showUpload && (
        <div className="px-5 pb-3 shrink-0">
          <UploadSong onDone={() => setShowUpload(false)} />
        </div>
      )}

      {/* song list */}
      <div className="flex-1 overflow-y-auto px-3 min-h-0 space-y-0.5 pb-2">
                    {songs.map((song, index) => (
                    <div key={song._id}
            onClick={() => playSongAtIndex(index)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 group"
            style={{
                background: currentSongIndex === index
                ? "rgba(139,92,246,0.2)"
                : "rgba(255,255,255,0.04)",  // ✅ always has a subtle bg now
                border: currentSongIndex === index
                ? "1px solid rgba(139,92,246,0.35)"
                : "1px solid rgba(255,255,255,0.06)",
                marginBottom: "4px",
            }}
            onMouseEnter={e => {
                if (currentSongIndex !== index) {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }
            }}
            onMouseLeave={e => {
                if (currentSongIndex !== index) {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                }
            }}>
            {/* playing indicator */}
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
  {currentSongIndex === index && isPlaying ? (
    // animated equalizer bars
    <div className="flex items-end gap-[2px] h-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="w-[3px] rounded-full bg-purple-400"
          style={{
            height: `${i === 2 ? 100 : i === 1 ? 60 : 80}%`,
            animation: `pulse-glow ${0.4 + i * 0.15}s ease-in-out infinite alternate`
          }} />
      ))}
    </div>
  ) : currentSongIndex === index ? (
    // paused — solid purple icon
    <Music2 size={14} className="text-purple-400" />
  ) : (
    // idle — dim icon
    <Music2 size={14} className="text-white/20 group-hover:text-white/40 transition-colors" />
  )}
</div>
            <div className="flex-1 min-w-0">
  <p className={`text-[13px] font-medium truncate transition-colors ${
    currentSongIndex === index ? "text-white" : "text-white/50 group-hover:text-white/60"
  }`}>
    {song.title}
  </p>
  {song.singer && (
    <p className="text-[11px] text-white/45 truncate mt-0.5">{song.singer}</p>
  )}
</div>
          </div>
        ))}
      </div>

      {/* player */}
{/* player */}
{currentSong && (
  <div className="shrink-0 px-4 pt-3 pb-4 relative overflow-hidden"
    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>

    <div className="absolute inset-0 pointer-events-none"
      style={{ background: "linear-gradient(to top, rgba(124,58,237,0.1) 0%, transparent 100%)" }} />

    <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={nextSong} />

    {/* song info row */}
    <div className="flex items-center gap-2.5 mb-2.5 relative z-10">
      <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.5), rgba(236,72,153,0.4))",
          border: "1px solid rgba(139,92,246,0.3)",
          boxShadow: isPlaying ? "0 0 14px rgba(124,58,237,0.4)" : "none",
          transition: "box-shadow 0.5s ease",
        }}>
        <Music2 size={15} className="text-purple-300" />
      </div>
      <div className="flex-1 min-w-0">
  <p className="text-[13px] font-semibold text-white/90 truncate leading-tight">
    {currentSong.title}
  </p>
  <p className="text-[11px] text-white/45 truncate mt-0.5">
    {currentSong.singer}
  </p>
</div>
      {isPlaying && (
        <div className="flex items-end gap-[2px] h-3.5 shrink-0">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-[3px] rounded-full bg-purple-400"
              style={{
                height: `${i === 2 ? 100 : i === 1 ? 55 : 75}%`,
                animation: `pulse-glow ${0.4 + i * 0.15}s ease-in-out infinite alternate`,
              }} />
          ))}
        </div>
      )}
    </div>

    {/* progress bar */}
    <div className="relative mb-3 z-10">
      <div className="h-1 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}>
        <div className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #7c3aed, #ec4899)",
            boxShadow: "0 0 6px rgba(124,58,237,0.5)",
            transition: "width 0.1s linear",
          }} />
      </div>
      <input type="range" value={progress} onChange={handleSeek}
        className="absolute inset-0 w-full opacity-0 cursor-pointer h-1" />
    </div>

    {/* controls */}
    <div className="flex items-center justify-center gap-4 px-1 relative z-10">
      <button onClick={prevSong}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <SkipBack size={13} className="text-white/60" />
      </button>

      <button
        onClick={() => isPlaying
          ? pauseSong(audioRef.current?.currentTime || 0)
          : resumeSong(audioRef.current?.currentTime || 0)}
        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
          boxShadow: isPlaying ? "0 4px 20px rgba(124,58,237,0.6)" : "0 4px 12px rgba(124,58,237,0.35)",
        }}>
        {isPlaying
          ? <Pause size={17} fill="white" className="text-white" />
          : <Play size={17} fill="white" className="text-white ml-0.5" />}
      </button>

      <button onClick={nextSong}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <SkipForward size={13} className="text-white/60" />
      </button>
    </div>
  </div>
)}
    </div>
  );
}