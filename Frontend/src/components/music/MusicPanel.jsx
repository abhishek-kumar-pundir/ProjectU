import { useEffect, useRef, useState } from "react";
import useMusicStore from "../../stores/useMusicStore";
import { Play, Pause, SkipForward, SkipBack, Plus, X } from "lucide-react";
import useChatStore from "../../stores/useChatStore";
import UploadSong from "./UploadSong";

export default function MusicPanel() {
  const {
    songs,
    currentSongIndex,
    isPlaying,
    currentTime,
    playSongAtIndex,
    resumeSong,
    pauseSong,
    seekTo,
    nextSong,
    prevSong,
    listenSocket,
    fetchSongs,
  } = useMusicStore();
  const { syncMode, stopSync } = useChatStore();

  const audioRef = useRef();
  const [progress, setProgress] = useState(0);
  const isSeeking = useRef(false);
  const [showUpload, setShowUpload] = useState(false); // ✅ toggle upload popup

  const currentSong = currentSongIndex !== null ? songs[currentSongIndex] : null;

  useEffect(() => {
    fetchSongs();
    listenSocket();
  }, []);

  // ✅ FIX: when song changes, load src first, THEN play inside oncanplay
  useEffect(() => {
    if (!audioRef.current || currentSongIndex === null) return;
    const audio = audioRef.current;
    const newSrc = songs[currentSongIndex]?.fileUrl;

    if (audio.src !== newSrc) {
      audio.src = newSrc;
      audio.load();

      // ✅ play only after audio is ready — this fixes the list play button
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

  // play/pause for toggle (when src is already loaded)
  useEffect(() => {
    if (!audioRef.current || currentSongIndex === null) return;
    const audio = audioRef.current;

    // only act if src is already set (song didn't just change)
    if (!audio.src || audio.src === window.location.href) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // seek from socket
  useEffect(() => {
    if (!audioRef.current || isSeeking.current) return;
    const audio = audioRef.current;
    if (Math.abs(audio.currentTime - currentTime) > 1) {
      audio.currentTime = currentTime;
    }
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
  <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-white/5"
    style={{ background: "rgba(15,15,20,0.9)", backdropFilter: "blur(20px)" }}>

    {/* header */}
    <div className="flex justify-between items-center px-4 pt-4 pb-2 shrink-0">
      <span className="text-sm font-semibold text-zinc-200 tracking-wide">Songs</span>
      <button onClick={() => setShowUpload(v => !v)}
        className="w-7 h-7 rounded-full bg-white/5 hover:bg-purple-500/30 border border-white/10 flex items-center justify-center transition-all">
        {showUpload ? <X size={13} /> : <Plus size={13} />}
      </button>
    </div>

    {showUpload && (
      <div className="px-3 pb-2 shrink-0">
        <UploadSong onDone={() => setShowUpload(false)} />
      </div>
    )}

    {/* song list */}
    <div className="flex-1 overflow-y-auto px-3 space-y-1 min-h-0 pb-2">
      {songs.map((song, index) => (
        <div key={song._id}
          className={`flex justify-between items-center px-3 py-2.5 rounded-xl cursor-pointer transition-all group ${
            currentSongIndex === index
              ? "bg-purple-600/20 border border-purple-500/30"
              : "hover:bg-white/5 border border-transparent"
          }`}>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              currentSongIndex === index && isPlaying ? "bg-purple-400 animate-pulse" : "bg-zinc-600"
            }`} />
            <p className="text-sm text-zinc-200 truncate">{song.title}</p>
          </div>
          <button onClick={() => playSongAtIndex(index)}
            className="text-[11px] bg-purple-600/80 hover:bg-purple-500 px-2.5 py-1 rounded-lg shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-all">
            Play
          </button>
        </div>
      ))}
    </div>

    {/* player */}
    {currentSong && (
      <div className="shrink-0 border-t border-white/5 px-4 py-3"
        style={{ background: "rgba(10,10,15,0.6)" }}>
        <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={nextSong} />

        <div className="flex items-center justify-between mb-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-100 truncate">{currentSong.title}</p>
            <p className="text-xs text-zinc-500">{currentSong.singer}</p>
          </div>
        </div>

        <input type="range" value={progress} onChange={handleSeek}
          className="w-full h-1 mb-3 accent-purple-500 cursor-pointer" />

        <div className="flex justify-center items-center gap-6">
          <button onClick={prevSong} className="text-zinc-400 hover:text-white transition">
            <SkipBack size={16} />
          </button>
          {isPlaying ? (
            <button onClick={() => pauseSong(audioRef.current?.currentTime || 0)}
              className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-900/40 transition-all">
              <Pause size={16} />
            </button>
          ) : (
            <button onClick={() => resumeSong(audioRef.current?.currentTime || 0)}
              className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-900/40 transition-all">
              <Play size={16} />
            </button>
          )}
          <button onClick={nextSong} className="text-zinc-400 hover:text-white transition">
            <SkipForward size={16} />
          </button>
        </div>
      </div>
    )}
  </div>
);
}