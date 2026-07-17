import { create } from "zustand";
import socket from "../lib/socket";
import API from "../lib/axios";
import toast from "react-hot-toast";
import { showUserOnlineToast, showListenRequestToast } from "../lib/toasts";
import useAuthStore from "./useAuthStore";

let hasNotifiedOnline = false;

const useChatStore = create((set, get) => ({
  messages: [],
  onlineUsers: [],
  syncMode: false,
  pendingRequest: false,
  lastAction: null,
  newMessageFrom: null,

  connectSocket: () => {
    // the server identifies this socket from the auth cookie and joins it
    // straight into its own pair's room — no client-sent userId anymore
    if (!socket.connected) socket.connect();

    socket.off("onlineUsers");
    socket.off("receiveMessage");
    socket.off("userCameOnline");
    socket.off("userWentOffline");
    socket.off("listenRequest");
    socket.off("syncStarted");
    socket.off("syncDeclined");
    socket.off("syncStopped");
    socket.off("songUploaded"); // ✅

    socket.on("onlineUsers", (users) => set({ onlineUsers: users }));

    socket.on("receiveMessage", (msg) => {
  const currentUser = useAuthStore.getState().user;
  const isFromOther = msg.senderId?.toString() !== currentUser?._id?.toString();

  set({ messages: [...get().messages, msg] });

  if (isFromOther) {
    set({ newMessageFrom: msg.senderId });
    setTimeout(() => set({ newMessageFrom: null }), 2000);
  }
});

    socket.on("userCameOnline", ({ userId }) => {
      if (hasNotifiedOnline) return;
      hasNotifiedOnline = true;

      if (Notification.permission === "granted") {
        new Notification("ProjectU", {
          body: "Your person is online! 💜",
          icon: "/favicon.ico",
        });
      }

      showUserOnlineToast(userId, set);
    });

    socket.on("userWentOffline", () => {
      hasNotifiedOnline = false;
      toast("Your person went offline 💔", { icon: "😔", duration: 4000 });
      set({ syncMode: false });
    });

    socket.on("listenRequest", () => {
      showListenRequestToast();
    });

    socket.on("syncStarted", () => {
      set({ syncMode: true, pendingRequest: false });
      toast.success("🎵 Listening together! Songs are now synced 💜", { duration: 4000 });
    });

    socket.on("syncDeclined", () => {
      set({ pendingRequest: false });
      toast("They're not ready yet 😅", { icon: "💔", duration: 3000 });
    });

    socket.on("syncStopped", () => {
      set({ syncMode: false });
      toast("Sync ended. Solo mode 🎧", { duration: 3000 });
    });

    // ✅ song upload notification
    socket.on("songUploaded", ({ songTitle, uploaderName }) => {
      const isMe = uploaderName === useAuthStore.getState().user?.username;

      if (!isMe && Notification.permission === "granted") {
        new Notification("ProjectU 🎵", {
          body: `${uploaderName} added "${songTitle}"`,
          icon: "/favicon.ico",
        });
      }

      toast(`${isMe ? "You" : uploaderName} added "${songTitle}" 🎵`, {
        duration: 4000,
        icon: "🎵",
      });
    });
  },

  stopSync: () => socket.emit("stopSync"),

  fetchMessages: async (otherUserId) => {
    try {
      const res = await API.get(`/messages/${otherUserId}`);
      set({ messages: res.data });
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  },

  sendMessage: (text) => {
    if (!text.trim()) return;
    // sender/receiver are derived server-side from the authenticated socket,
    // so the client only ever sends the message text itself
    socket.emit("sendMessage", { text });
  },
  setLastAction: (action) => {
  set({ lastAction: action });
  // auto clear after 3 seconds
  setTimeout(() => set({ lastAction: null }), 3000);
},
}));

export default useChatStore;