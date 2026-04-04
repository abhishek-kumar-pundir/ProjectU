import { useEffect, useState } from "react";
import useMoodStore from "../../stores/useMoodStore";
import useAuthStore from "../../stores/useAuthStore";

const PRESET_COLORS = [
  "#7c3aed", // purple
  "#db2777", // pink
  "#2563eb", // blue
  "#059669", // green
  "#d97706", // amber
  "#dc2626", // red
  "#0891b2", // cyan
  "#475569", // slate
];

const PRESET_EMOJIS = ["💜", "🍂", "✨", "🌙", "💙", "🌸", "🔥", "🌊", "☁️", "🌿"];

export default function MoodBoard() {
  const { myMood, theirMood, fetchMoods, setMood, listenSocket } = useMoodStore();
  const { user } = useAuthStore();

  const [word, setWord] = useState("");
  const [emoji, setEmoji] = useState("💜");
  const [color, setColor] = useState("#7c3aed");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user?._id) return;
    fetchMoods(user._id);
    listenSocket(user._id);
  }, [user?._id]);

  // pre-fill form with existing mood
  useEffect(() => {
    if (myMood) {
      setWord(myMood.word || "");
      setEmoji(myMood.emoji || "💜");
      setColor(myMood.color || "#7c3aed");
    }
  }, [myMood]);

  const handleSave = () => {
    if (!word.trim()) return;
    setMood(word.trim(), emoji, color, user._id);
    setEditing(false);
  };

  return (
  <div className="rounded-2xl border border-white/5 px-4 py-3"
    style={{ background: "rgba(15,15,20,0.9)", backdropFilter: "blur(20px)" }}>

    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-semibold text-zinc-200">Vibe Check</span>
      <span className="text-base">✨</span>
    </div>

    <div className="flex gap-2 mb-3">
      {[{ label: "You", mood: myMood }, { label: theirMood?.userId?.username || "them", mood: theirMood }].map(({ label, mood }) => (
        <div key={label} className="flex-1 rounded-xl p-2.5 flex flex-col items-center gap-1 border transition-all"
          style={{
            borderColor: mood?.color ? `${mood.color}55` : "rgba(255,255,255,0.06)",
            background: mood?.color ? `${mood.color}15` : "rgba(255,255,255,0.02)",
          }}>
          <span className="text-[10px] text-zinc-500">{label}</span>
          <span className="text-xl">{mood?.emoji || "·"}</span>
          <span className="text-[11px] font-medium text-zinc-300">{mood?.word || "—"}</span>
        </div>
      ))}
    </div>

    {!editing ? (
      <button onClick={() => setEditing(true)}
        className="w-full text-xs text-zinc-400 hover:text-zinc-200 bg-white/5 hover:bg-white/10 py-2 rounded-xl transition-all border border-white/5">
        {myMood ? "Change vibe" : "Set your vibe"}
      </button>
    ) : (
      <div className="space-y-2">
        <input value={word} onChange={e => setWord(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSave()}
          placeholder="one word..."
          maxLength={20}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-purple-500/50 placeholder-zinc-600" />

        <div className="flex flex-wrap gap-1">
          {PRESET_EMOJIS.map(e => (
            <button key={e} onClick={() => setEmoji(e)}
              className={`text-base p-1 rounded-lg transition ${emoji === e ? "bg-white/15" : "hover:bg-white/8"}`}>
              {e}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          {PRESET_COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)}
              className={`w-5 h-5 rounded-full border-2 transition-transform ${color === c ? "border-white scale-110" : "border-transparent"}`}
              style={{ background: c }} />
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={handleSave}
            className="flex-1 bg-purple-600/80 hover:bg-purple-600 py-1.5 rounded-xl text-xs transition">
            Save
          </button>
          <button onClick={() => setEditing(false)}
            className="flex-1 bg-white/5 hover:bg-white/10 py-1.5 rounded-xl text-xs transition">
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>
);
}