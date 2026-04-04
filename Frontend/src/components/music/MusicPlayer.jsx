import { useEffect, useRef, useState } from "react";
import useMusicStore from "../../stores/useMusicStore";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

export default function MusicPlayer() {
  const {
    songs,
    currentSongIndex,
    isPlaying,
    togglePlay,
    nextSong,
    prevSong,
  } = useMusicStore();

  const audioRef = useRef();
  const [progress, setProgress] = useState(0);

  const currentSong = songs[currentSongIndex];

  // play / pause effect
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // progress update
  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;

    setProgress((current / duration) * 100 || 0);
  };

  // auto next
  const handleEnded = () => {
    nextSong();
  };

  // seek
  const handleSeek = (e) => {
    const value = e.target.value;
    const duration = audioRef.current.duration;

    audioRef.current.currentTime = (value / 100) * duration;
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900 p-3">
      <audio
        ref={audioRef}
        src={currentSong.fileUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center justify-between">
        {/* song info */}
        <div>
          <p className="text-sm">{currentSong.title}</p>
          <p className="text-xs text-gray-400">
            {currentSong.singer}
          </p>
        </div>

        {/* controls */}
        <div className="flex items-center gap-4">
          <button onClick={prevSong}>
            <SkipBack size={20} />
          </button>

          <button onClick={togglePlay}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button onClick={nextSong}>
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      {/* progress bar */}
      <input
        type="range"
        value={progress}
        onChange={handleSeek}
        className="w-full mt-2"
      />
    </div>
  );
}