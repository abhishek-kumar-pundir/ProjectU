import { useState } from "react";
import API from "../../lib/axios";
import { Upload } from "lucide-react";

export default function UploadSong({ onDone }) {
  const [title, setTitle] = useState("");
  const [singer, setSinger] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!title || !singer || !file) { setError("Fill all fields."); return; }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("singer", singer);
    formData.append("file", file);
    try {
      setLoading(true); setError("");
      await API.post("/songs/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      onDone?.();
    } catch {
      setError("Upload failed.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 p-3 rounded-xl"
      style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}>
      {[
        { placeholder: "Song title", value: title, onChange: e => setTitle(e.target.value) },
        { placeholder: "Singer", value: singer, onChange: e => setSinger(e.target.value) },
      ].map((props, i) => (
        <input key={i} {...props}
          className="w-full text-sm px-3 py-2 rounded-lg outline-none transition-all"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)" }} />
      ))}
      <label className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <Upload size={12} className="text-white/40" />
        <span className="text-xs text-white/40 truncate">{file ? file.name : "Choose audio file"}</span>
        <input type="file" accept="audio/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
      </label>
      {error && <p className="text-xs text-rose-400">{error}</p>}
      <button onClick={handleUpload} disabled={loading}
        className="w-full py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
        {loading ? "Uploading..." : "Upload Song"}
      </button>
    </div>
  );
}