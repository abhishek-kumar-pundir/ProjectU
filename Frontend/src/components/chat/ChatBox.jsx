import { useEffect, useRef, useState } from "react";
import useChatStore from "../../stores/useChatStore";
import useAuthStore from "../../stores/useAuthStore";

// helper — initials from username
const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

// helper — format timestamp
const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Avatar component — shows image if available, else colored initials
function Avatar({ user, size = 7 }) {
  const colors = [
    "bg-purple-600", "bg-pink-600", "bg-blue-600",
    "bg-green-600", "bg-orange-500", "bg-red-500"
  ];
  // pick consistent color based on username
  const colorIndex = user?.username
    ? user.username.charCodeAt(0) % colors.length
    : 0;

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.username}
        className={`w-${size} h-${size} rounded-full object-cover shrink-0`}
      />
    );
  }

  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${colors[colorIndex]}`}
    >
      {getInitials(user?.username)}
    </div>
  );
}

export default function ChatBox() {
  const { messages, sendMessage, fetchMessages, connectSocket, onlineUsers } = useChatStore();
  const { user, otherUser, fetchOtherUser } = useAuthStore();

  const [text, setText] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    if (!user) return;

    connectSocket(user._id);
    fetchOtherUser().then(() => {
      // fetch history after we know who the other user is
    });
  }, [user]);

  // fetch history once otherUser is loaded
  useEffect(() => {
    if (otherUser?._id) {
      fetchMessages(otherUser._id);
    }
  }, [otherUser]);

  // auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || !otherUser) return;
    sendMessage(user._id, otherUser._id, text.trim());
    setText("");
  };

  const isOtherOnline = otherUser && onlineUsers.includes(otherUser._id);

  return (
  <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-white/5"
    style={{ background: "rgba(15,15,20,0.9)", backdropFilter: "blur(20px)" }}>

    {/* header */}
    <div className="flex items-center gap-3 px-5 py-4 shrink-0 border-b border-white/5">
      <div className="relative">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold shadow-lg">
          {otherUser?.username?.[0]?.toUpperCase() || "?"}
        </div>
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0f0f14] ${isOtherOnline ? "bg-emerald-400" : "bg-zinc-600"}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-100">{otherUser?.username || "..."}</p>
        <p className={`text-xs ${isOtherOnline ? "text-emerald-400" : "text-zinc-500"}`}>
          {isOtherOnline ? "● Online" : "○ Offline"}
        </p>
      </div>
    </div>

    {/* messages */}
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center gap-3 opacity-40">
          <span className="text-4xl">💬</span>
          <p className="text-sm text-zinc-400">No messages yet</p>
          <p className="text-xs text-zinc-600">Say something nice ♡</p>
        </div>
      )}

      {messages.map((msg, i) => {
        const isMe = msg.senderId === user?._id || msg.senderId?.toString() === user?._id?.toString();
        return (
          <div key={msg._id || i} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isMe ? "bg-gradient-to-br from-purple-500 to-pink-500" : "bg-zinc-700"}`}>
              {isMe ? user?.username?.[0]?.toUpperCase() : otherUser?.username?.[0]?.toUpperCase()}
            </div>
            <div className={`flex flex-col gap-1 max-w-[72%] ${isMe ? "items-end" : "items-start"}`}>
              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                isMe
                  ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-br-sm shadow-lg shadow-purple-900/30"
                  : "bg-zinc-800/80 text-zinc-100 rounded-bl-sm border border-white/5"
              }`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-zinc-600 px-1">
                {msg.createdAt ? formatTime(msg.createdAt) : ""}
              </span>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>

    {/* input */}
    <div className="px-4 py-3 border-t border-white/5 shrink-0 flex items-center gap-3">
      <input value={text} onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSend()}
        placeholder="Type something..."
        className="flex-1 bg-white/5 border border-white/8 rounded-full px-4 py-2.5 text-sm outline-none focus:border-purple-500/40 placeholder-zinc-600 transition-all" />
      <button onClick={handleSend} disabled={!text.trim()}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-30 flex items-center justify-center shadow-lg shadow-purple-900/40 transition-all shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 rotate-90">
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </button>
    </div>
  </div>
);
}