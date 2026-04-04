import { useEffect, useState } from "react";
import useLinkStore from "../../stores/useLinkStore";
import useAuthStore from "../../stores/useAuthStore";

export default function LinkPanel() {
  const { links, fetchLinks, addLink, addComment, listenSocket } = useLinkStore();
  const { user } = useAuthStore();

  const [url, setUrl] = useState("");
  const [comment, setComment] = useState("");
  const [openCommentId, setOpenCommentId] = useState(null); // which link has comment box open
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetchLinks();
    listenSocket();
  }, []);

  const handleAdd = () => {
    if (!url.trim()) return;
    addLink(url.trim(), comment.trim());
    setUrl("");
    setComment("");
  };

  const handleComment = (linkId) => {
    if (!commentText.trim()) return;
    addComment(linkId, commentText.trim());
    setCommentText("");
    setOpenCommentId(null);
  };

  return (
  <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-white/5"
    style={{ background: "rgba(15,15,20,0.9)", backdropFilter: "blur(20px)" }}>

    <div className="px-4 pt-4 pb-3 shrink-0">
      <h2 className="text-sm font-semibold text-zinc-200 mb-3">Shared Links</h2>

      <div className="space-y-2">
        <input value={url} onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          placeholder="Paste a URL..."
          className="w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500/40 placeholder-zinc-600 transition-all" />
        <input value={comment} onChange={e => setComment(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          placeholder="Add a note (optional)"
          className="w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500/40 placeholder-zinc-600 transition-all" />
        <button onClick={handleAdd}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-purple-900/30">
          Share Link
        </button>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 min-h-0">
      {links.map(l => (
        <div key={l._id} className="bg-white/3 hover:bg-white/5 border border-white/6 rounded-xl p-3 transition-all">
          <p className="text-[11px] text-purple-400 mb-1 font-medium">
            {l.sharedBy?.username === user?.username ? "You" : l.sharedBy?.username}
          </p>
          <a href={l.url} target="_blank" rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 break-all transition-colors leading-relaxed">
            {l.url}
          </a>
          {l.comment && (
            <p className="text-xs text-zinc-500 mt-1.5 italic">"{l.comment}"</p>
          )}
          {l.comments?.length > 0 && (
            <div className="mt-2 space-y-1 border-t border-white/5 pt-2">
              {l.comments.map((c, i) => (
                <p key={i} className="text-xs text-zinc-500">💬 {c.text}</p>
              ))}
            </div>
          )}
          {openCommentId === l._id ? (
            <div className="mt-2 flex gap-1">
              <input value={commentText} onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleComment(l._id)}
                placeholder="Write a comment..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs outline-none" autoFocus />
              <button onClick={() => handleComment(l._id)}
                className="text-xs bg-purple-600/80 px-2.5 rounded-lg hover:bg-purple-600 transition">
                Send
              </button>
            </div>
          ) : (
            <button onClick={() => { setOpenCommentId(l._id); setCommentText(""); }}
              className="mt-2 text-[11px] text-zinc-600 hover:text-zinc-400 transition">
              + comment
            </button>
          )}
        </div>
      ))}
      {links.length === 0 && (
        <div className="flex flex-col items-center justify-center h-32 gap-2 opacity-40">
          <span className="text-3xl">🔗</span>
          <p className="text-xs text-zinc-500">No links shared yet</p>
        </div>
      )}
    </div>
  </div>
);
}