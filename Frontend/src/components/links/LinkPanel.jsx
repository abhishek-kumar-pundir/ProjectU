import { useEffect, useState } from "react";
import useLinkStore from "../../stores/useLinkStore";
import useAuthStore from "../../stores/useAuthStore";
import { Link2, ExternalLink } from "lucide-react";
import { SmartImage } from "react-fastload";

export default function LinkPanel() {
  const { links, fetchLinks, addLink, addComment, listenSocket } = useLinkStore();
  const { user } = useAuthStore();
  const [url, setUrl] = useState("");
  const [comment, setComment] = useState("");
  const [openCommentId, setOpenCommentId] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => { fetchLinks(); listenSocket(); }, [fetchLinks, listenSocket]);

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
      return u.hostname + (u.pathname !== "/" ? u.pathname.slice(0, 22) + "…" : "");
    } catch { return url.slice(0, 38) + "…"; }
  };

  const getDomain = (rawUrl) => {
    try {
      return new URL(rawUrl).hostname;
    } catch {
      return "";
    }
  };

  const isMe = (sharedBy) => sharedBy?.username === user?.username;

  return (
    <div className="h-full flex flex-col overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(160deg, rgba(16,8,30,0.97) 0%, rgba(10,6,20,0.99) 100%)",
        border: "1px solid rgba(139,92,246,0.15)",
        boxShadow: "0 0 40px rgba(139,92,246,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}>

      {/* header */}
      <div className="px-5 pt-4 pb-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Link2 size={13} className="text-purple-400/60" />
          <h2 className="text-sm font-semibold text-white/80 tracking-wide">Shared Links</h2>
        </div>

        <div className="space-y-2">
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="drop a link here..."
            className="w-full text-sm px-4 py-2.5 rounded-xl outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.85)",
            }} />

          <div className="flex gap-2">
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
              placeholder="what's this about? (optional)"
              className="flex-1 text-sm px-4 py-2.5 rounded-xl outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.8)",
              }} />
            <button onClick={handleAdd}
              className="px-5 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95 whitespace-nowrap text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
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
            <Link2 size={24} className="text-white/40" />
            <p className="text-sm text-white/50">nothing shared yet</p>
            <p className="text-xs text-white/30">drop something worth seeing</p>
          </div>
        ) : links.map(l => (
          <div key={l._id}
            className="rounded-xl p-4 transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>

            {/* who + link on same row */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
                  {(l.sharedBy?.username?.[0] || "?").toUpperCase()}
                </div>
                <span className="text-[11px] font-medium"
                  style={{ color: "rgba(192,160,255,0.75)" }}>
                  {isMe(l.sharedBy) ? "you shared" : `${l.sharedBy?.username} shared`}
                </span>
              </div>
              <a href={l.url} target="_blank" rel="noopener noreferrer"
                className="shrink-0 opacity-30 hover:opacity-70 transition-opacity">
                <ExternalLink size={12} className="text-white" />
              </a>
            </div>

            {/* link */}
            <div className="flex items-center gap-2 mb-2">
              {getDomain(l.url) && (
                <SmartImage
                  src={`https://www.google.com/s2/favicons?domain=${getDomain(l.url)}&sz=64`}
                  alt=""
                  priority="LOW"
                  strategy="lazy"
                  width={15}
                  height={15}
                  className="w-3.5 h-3.5 rounded-sm shrink-0 opacity-75"
                  style={{ width: 15, height: 15 }}
                />
              )}
              <a href={l.url} target="_blank" rel="noopener noreferrer"
                className="block text-[13px] font-medium transition-colors hover:text-blue-300 break-all leading-snug"
                style={{ color: "rgba(147,197,253,0.9)" }}>
                {truncateUrl(l.url)}
              </a>
            </div>

            {/* note — not italic, warm and readable */}
            {l.comment && (
              <div className="mb-2.5 px-3 py-2 rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                <p className="text-[12px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.6)" }}>
                  {l.comment}
                </p>
              </div>
            )}

            {/* comments */}
            {l.comments?.length > 0 && (
              <div className="mb-2 space-y-1.5 pt-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {l.comments.map((c, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-purple-400/50 text-[11px] mt-0.5">↩</span>
                    <p className="text-[12px] leading-snug"
                      style={{ color: "rgba(255,255,255,0.55)" }}>
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* comment toggle */}
            {openCommentId === l._id ? (
              <div className="flex gap-1.5 mt-2">
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleComment(l._id)}
                  placeholder="say something..."
                  autoFocus
                  className="flex-1 text-[13px] px-3 py-1.5 rounded-lg outline-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.85)",
                  }} />
                <button onClick={() => handleComment(l._id)}
                  className="px-3 rounded-lg text-sm transition-all"
                  style={{
                    background: "rgba(139,92,246,0.3)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    color: "rgba(255,255,255,0.9)",
                  }}>
                  ↩
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setOpenCommentId(l._id); setCommentText(""); }}
                className="text-[12px] font-medium mt-1 transition-all"
                style={{ color: "rgba(255,255,255,0.28)" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(192,160,255,0.65)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.28)"}>
                + say something
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}