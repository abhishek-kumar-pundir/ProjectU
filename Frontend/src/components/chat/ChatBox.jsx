import { useEffect, useRef, useState } from "react";
import useChatStore from "../../stores/useChatStore";
import useAuthStore from "../../stores/useAuthStore";
import MusicBackground from "./MusicBackground";
import { SmartImage } from "react-fastload";

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};


export default function ChatBox() {
  const { messages, sendMessage, fetchMessages, connectSocket, onlineUsers, newMessageFrom } = useChatStore();
  const { user, partner, fetchPartner } = useAuthStore();
  const [text, setText] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    if (!user) return;
    connectSocket();
    fetchPartner();
  }, [user, connectSocket, fetchPartner]);

  useEffect(() => {
    if (partner?._id) fetchMessages(partner._id);
  }, [partner?._id, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || !partner) return;
    sendMessage(text.trim());
    setText("");
  };

  const isOtherOnline = partner && onlineUsers.includes(partner._id);

  const grouped = messages.reduce((acc, msg) => {
    const dateKey = formatDate(msg.createdAt);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});

  return (
    // ✅ this is the outer wrapper — border glows on new message
    <div className="h-full flex flex-col overflow-hidden rounded-2xl relative transition-all duration-500"
      style={{
        background: "linear-gradient(160deg, rgba(18,8,32,0.97) 0%, rgba(10,6,20,0.99) 100%)",
        border: newMessageFrom
          ? "1px solid rgba(139,92,246,0.55)"
          : "1px solid rgba(139,92,246,0.15)",
        boxShadow: newMessageFrom
          ? "0 0 32px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 0 40px rgba(139,92,246,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}>

      {/* ✅ music animated background */}
      <MusicBackground />

      {/* header */}
      <div className="flex items-center gap-3.5 px-5 py-4 shrink-0 relative z-10"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.25)" }}>
        <div className="relative">
          {partner?.avatar ? (
            <SmartImage
              src={partner.avatar}
              alt={partner.username}
              priority="HIGH"
              strategy="eager"
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover shrink-0"
              style={{ width: 44, height: 44 }}
            />
          ) : (
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-base font-semibold shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", boxShadow: "0 4px 16px rgba(124,58,237,0.5)" }}>
              {partner?.username?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0a0614] transition-colors duration-500"
            style={{ background: isOtherOnline ? "#34d399" : "#374151" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-white/90">{partner?.username || "..."}</p>
          {/* ✅ new message indicator sits here, under their name */}
          {newMessageFrom ? (
            <p className="text-[11px] mt-0.5 animate-fade-up"
              style={{ color: "rgba(192,160,255,0.9)" }}>
              ✦ just sent a message
            </p>
          ) : (
            <p className="text-xs mt-0.5 transition-colors duration-500"
              style={{ color: isOtherOnline ? "#34d399" : "rgba(255,255,255,0.25)" }}>
              {isOtherOnline ? "● online now" : "○ offline"}
            </p>
          )}
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 min-h-0 space-y-1 relative z-10">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 opacity-30">
            <div className="text-6xl" style={{ animation: "pulse-glow 3s ease-in-out infinite" }}>💬</div>
            <p className="text-base font-display text-white/50">say something</p>
            <p className="text-sm text-white/25">this is your private space</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, msgs]) => (
            <div key={date}>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
                <span className="text-[10px] tracking-widest uppercase px-2 py-1 rounded-full"
                  style={{ color: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {date}
                </span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>

              {msgs.map((msg, i) => {
                const isMe = msg.senderId === user?._id || msg.senderId?.toString() === user?._id?.toString();
                return (
                  <div key={msg._id || i}
                    className={`flex items-end gap-2.5 mb-4 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mb-1"
                      style={{
                        background: isMe ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "rgba(255,255,255,0.1)",
                        boxShadow: isMe ? "0 2px 8px rgba(124,58,237,0.4)" : "none",
                      }}>
                      {isMe ? user?.username?.[0]?.toUpperCase() : partner?.username?.[0]?.toUpperCase()}
                    </div>

                    <div className={`flex flex-col gap-1.5 max-w-[72%] ${isMe ? "items-end" : "items-start"}`}>
                      <div className="px-4 py-3 text-[15px] leading-relaxed"
                        style={isMe ? {
                          background: "linear-gradient(135deg, rgba(124,58,237,0.92), rgba(168,85,247,0.88))",
                          borderRadius: "20px 20px 5px 20px",
                          boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
                          color: "rgba(255,255,255,0.95)",
                        } : {
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.09)",
                          borderRadius: "20px 20px 20px 5px",
                          color: "rgba(255,255,255,0.88)",
                          backdropFilter: "blur(8px)",
                        }}>
                        {msg.text}
                      </div>
                      <span className="text-[11px] px-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="px-4 py-4 shrink-0 flex items-center gap-3 relative z-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.3)" }}>
        <input value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Type something..."
          className="flex-1 px-5 py-3 rounded-full outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.9)",
            fontSize: "15px",
          }} />
        <button onClick={handleSend} disabled={!text.trim()}
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-30"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            boxShadow: "0 4px 20px rgba(124,58,237,0.5)",
          }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
}