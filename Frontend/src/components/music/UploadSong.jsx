import { useState } from "react";
import API from "../../lib/axios";

export default function UploadSong({ onDone }) {
  const [title, setTitle] = useState("");
  const [singer, setSinger] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!title || !singer || !file) {
      setMessage("Fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("singer", singer);
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");

      await API.post("/songs/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ close the panel automatically after success
      onDone?.();
    } catch (err) {
      console.error(err);
      setMessage("Upload failed.");
      setLoading(false);
    }
  };

  return (
    <div className="mb-3 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
      <input
        type="text"
        placeholder="Song title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-zinc-700 rounded px-3 py-2 text-sm mb-2 outline-none focus:ring-1 focus:ring-purple-500"
      />
      <input
        type="text"
        placeholder="Singer name"
        value={singer}
        onChange={(e) => setSinger(e.target.value)}
        className="w-full bg-zinc-700 rounded px-3 py-2 text-sm mb-2 outline-none focus:ring-1 focus:ring-purple-500"
      />
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full text-xs text-gray-400 mb-2"
      />
      {message && <p className="text-xs text-red-400 mb-2">{message}</p>}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-2 rounded text-sm font-medium transition"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}