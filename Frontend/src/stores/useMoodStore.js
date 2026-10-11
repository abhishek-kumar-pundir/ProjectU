import { create } from "zustand";
import API from "../lib/axios";
import socket from "../lib/socket";

const useMoodStore = create((set) => ({
  myMood: null,      // { word, emoji, color, userId }
  theirMood: null,   // same shape

  fetchMoods: async (currentUserId) => {
    try {
      const res = await API.get("/mood");
      const moods = res.data;

      const mine = moods.find(
        (m) => m.userId?._id === currentUserId || m.userId === currentUserId
      );
      const theirs = moods.find(
        (m) => m.userId?._id !== currentUserId && m.userId !== currentUserId
      );

      set({ myMood: mine || null, theirMood: theirs || null });
    } catch (err) {
      console.error("Fetch moods error:", err);
    }
  },

  setMood: async (word, emoji, color) => {
    try {
      const res = await API.post("/mood", { word, emoji, color });
      set({ myMood: res.data });
      // socket broadcast handled by server via io.emit
    } catch (err) {
      console.error("Set mood error:", err);
    }
  },

  listenSocket: (currentUserId) => {
    socket.off("moodUpdated");

    socket.on("moodUpdated", (mood) => {
      const isMe =
        mood.userId?._id === currentUserId ||
        mood.userId === currentUserId;

      if (isMe) {
        set({ myMood: mood });
      } else {
        set({ theirMood: mood });
      }
    });
  },
}));

export default useMoodStore;