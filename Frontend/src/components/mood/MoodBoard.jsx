import { useEffect, useState } from "react";
import useMoodStore from "../../stores/useMoodStore";
import useAuthStore from "../../stores/useAuthStore";

const PRESET_COLORS = ["#7c3aed","#a855f7","#ec4899","#f43f5e","#3b82f6","#06b6d4","#10b981","#f59e0b"];
const PRESET_EMOJIS = ["💜","🌙","✨","🍂","💙","🌸","🔥","🌊","☁️","🌿","🫧","🕯️"];

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

  useEffect(() => {
    if (myMood) { setWord(myMood.word || ""); setEmoji(myMood.emoji || "💜"); setColor(myMood.color || "#7c3aed"); }
  }, [myMood]);

  const handleSave = () => {
    if (!word.trim()) return;
    setMood(word.trim(), emoji, color, user._id);
    setEditing(false);
  };

  const VibePill = ({ label, mood }) => (
    <div className="flex-1 rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all duration-500"
      style={{
        background: mood?.color ? `${mood.color}18` : "rgba(255,255,255,0.03)",
        border: `1px solid ${mood?.color ? `${mood.color}40` : "rgba(255,255,255,0.07)"}`,
      }}>
      <span className="text-[9px] tracking-widest uppercase text-white/30">{label}</span>
      <span className="text-2xl leading-none">{mood?.emoji || "·"}</span>
      <span className="text-[11px] text-white/70 font-medium">{mood?.word || "—"}</span>
    </div>
  );

  return (
    <div className="rounded-2xl p-4"
      style={{
        background: "linear-gradient(160deg, rgba(20,10,35,0.95) 0%, rgba(12,8,24,0.98) 100%)",
        border: "1px solid rgba(139,92,246,0.15)",
        boxShadow: "0 0 40px rgba(139,92,246,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-base font-semibold text-white/90">Vibe Check</h2>
        <span className="text-sm">✨</span>
      </div>

      <div className="flex gap-2 mb-3">
        <VibePill label="You" mood={myMood} />
        <VibePill label={theirMood?.userId?.username || "them"} mood={theirMood} />
      </div>

      {!editing ? (
        <button onClick={() => setEditing(true)}
          className="w-full py-2 rounded-xl text-xs text-white/40 hover:text-white/70 transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {myMood ? "change vibe" : "set your vibe"}
        </button>
      ) : (
        <div className="space-y-2.5 animate-fade-up">
          <input value={word} onChange={e => setWord(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSave()}
            placeholder="one word..."
            maxLength={20}
            className="w-full text-sm px-3 py-2 rounded-xl outline-none transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }} />

          <div className="flex flex-wrap gap-1">
            {PRESET_EMOJIS.map(e => (
              <button key={e} onClick={() => setEmoji(e)}
                className="text-lg w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{ background: emoji === e ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.04)" }}>
                {e}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {PRESET_COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                className="w-5 h-5 rounded-full transition-all duration-200"
                style={{
                  background: c,
                  outline: color === c ? `2px solid white` : "none",
                  outlineOffset: "2px",
                  transform: color === c ? "scale(1.2)" : "scale(1)",
                }} />
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave}
              className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
              Save
            </button>
            <button onClick={() => setEditing(false)}
              className="flex-1 py-2 rounded-xl text-xs text-white/50 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}