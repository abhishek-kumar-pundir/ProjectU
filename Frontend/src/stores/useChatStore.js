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

  connectSocket: (userId) => {
    if (!socket.connected) socket.connect();
    socket.emit("join", userId);

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
      set({ messages: [...get().messages, msg] });
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

  sendMessage: (senderId, receiverId, text) => {
    if (!text.trim()) return;
    socket.emit("sendMessage", { senderId, receiverId, text });
  },
}));

export default useChatStore;