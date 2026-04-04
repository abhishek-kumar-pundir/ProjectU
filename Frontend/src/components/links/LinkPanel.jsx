import { useEffect, useState } from "react";
import useLinkStore from "../../stores/useLinkStore";
import useAuthStore from "../../stores/useAuthStore";
import { Link2 } from "lucide-react";

export default function LinkPanel() {
  const { links, fetchLinks, addLink, addComment, listenSocket } = useLinkStore();
  const { user } = useAuthStore();
  const [url, setUrl] = useState("");
  const [comment, setComment] = useState("");
  const [openCommentId, setOpenCommentId] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => { fetchLinks(); listenSocket(); }, []);

  const handleAdd = () => {
    if (!url.trim()) return;
    addLink(url.trim(), comment.trim());
    setUrl(""); setComment("");
  };

  const handleComment = (linkId) => {
    if (!commentText.trim()) return;
    addComment(linkId, commentText.trim());
    setCommentText(""); setOpenCommentId(null);
  };

  const truncateUrl = (url) => {
    try {
      const u = new URL(url);
      return u.hostname + (u.pathname !== "/" ? u.pathname.slice(0, 25) + "..." : "");
    } catch { return url.slice(0, 40) + "..."; }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(160deg, rgba(16,8,30,0.97) 0%, rgba(10,6,20,0.99) 100%)",
        border: "1px solid rgba(139,92,246,0.15)",
        boxShadow: "0 0 40px rgba(139,92,246,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}>

      {/* header + form */}
      <div className="px-5 pt-4 pb-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>

        <div className="flex items-center gap-2 mb-3">
          <Link2 size={14} className="text-purple-400/70" />
          <h2 className="text-base font-semibold text-white/90 tracking-wide">Shared Links</h2>
        </div>

        <div className="space-y-2">
          <input value={url} onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="Paste a link..."
            className="w-full text-sm px-4 py-2.5 rounded-xl outline-none transition-all placeholder-white/25"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.9)",
            }} />
          <div className="flex gap-2">
            <input value={comment} onChange={e => setComment(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
              placeholder="Add a note... (optional)"
              className="flex-1 text-sm px-4 py-2.5 rounded-xl outline-none transition-all placeholder-white/20"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.85)",
              }} />
            <button onClick={handleAdd}
              className="px-5 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95 whitespace-nowrap text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
              }}>
              Share
            </button>
          </div>
        </div>
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0 space-y-2">
        {links.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 opacity-30">
            <Link2 size={28} className="text-white/50" />
            <p className="text-sm font-medium text-white/60">No links yet</p>
            <p className="text-xs text-white/35">Share something you love</p>
          </div>
        ) : links.map(l => (
          <div key={l._id} className="rounded-xl p-3.5 transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>

            {/* who shared */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
                {(l.sharedBy?.username?.[0] || "?").toUpperCase()}
              </div>
              <span className="text-[11px] font-medium tracking-widest uppercase"
                style={{ color: "rgba(192,160,255,0.8)" }}>
                {l.sharedBy?.username === user?.username ? "You" : l.sharedBy?.username}
              </span>
            </div>

            {/* link */}
            <a href={l.url} target="_blank" rel="noopener noreferrer"
              className="block text-[13px] font-medium mb-1.5 transition-colors hover:text-blue-300 break-all leading-snug"
              style={{ color: "rgba(147,197,253,0.9)" }}>
              {truncateUrl(l.url)}
            </a>

            {/* note */}
            {l.comment && (
              <p className="text-[12px] mb-2 italic leading-snug"
                style={{ color: "rgba(255,255,255,0.5)" }}>
                "{l.comment}"
              </p>
            )}

            {/* comments */}
            {l.comments?.length > 0 && (
              <div className="mb-2 space-y-1.5 pt-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {l.comments.map((c, i) => (
                  <p key={i} className="text-[12px] leading-snug"
                    style={{ color: "rgba(255,255,255,0.5)" }}>
                    <span style={{ color: "rgba(167,139,250,0.6)" }}>↩ </span>
                    {c.text}
                  </p>
                ))}
              </div>
            )}

            {/* comment toggle */}
            {openCommentId === l._id ? (
              <div className="flex gap-1.5 mt-2">
                <input value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleComment(l._id)}
                  placeholder="Say something..."
                  autoFocus
                  className="flex-1 text-[13px] px-3 py-1.5 rounded-lg outline-none placeholder-white/25"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.85)",
                  }} />
                <button onClick={() => handleComment(l._id)}
                  className="px-3 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: "rgba(139,92,246,0.35)",
                    color: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(139,92,246,0.3)",
                  }}>
                  ↩
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setOpenCommentId(l._id); setCommentText(""); }}
                className="text-[12px] font-medium mt-1.5 transition-all"
                style={{ color: "rgba(255,255,255,0.3)" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(192,160,255,0.7)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
                + comment
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}