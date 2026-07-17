import { create } from "zustand";
import socket from "../lib/socket";
import API from "../lib/axios";
import useAuthStore from "./useAuthStore";

// ✅ import directly — no require()
import useChatStore from "./useChatStore";

const useMusicStore = create((set, get) => ({
  songs: [],
  currentSongIndex: null,
  isPlaying: false,
  currentTime: 0,
  lastAction: null,

  fetchSongs: async () => {
    const res = await API.get("/songs");
    set({ songs: res.data });
  },

  // ✅ fixed: read syncMode from useChatStore directly
  _emit: (payload) => {
    const syncMode = useChatStore.getState().syncMode;
    console.log("syncMode:", syncMode, "payload:", payload); // debug — remove later
    if (syncMode) {
      socket.emit("songAction", payload);
    }
  },

  playSongAtIndex: (index) => {
    set({ currentSongIndex: index, isPlaying: true, currentTime: 0 });
    get()._emit({ type: "PLAY", index, currentTime: 0 });
  },

  resumeSong: (currentTime = 0) => {
    set({ isPlaying: true, currentTime });
    get()._emit({ type: "PLAY", index: get().currentSongIndex, currentTime });
  },

  pauseSong: (currentTime = 0) => {
    set({ isPlaying: false, currentTime });
    get()._emit({ type: "PAUSE", currentTime });
  },

  seekTo: (currentTime) => {
    set({ currentTime });
    get()._emit({ type: "SEEK", index: get().currentSongIndex, currentTime });
  },

  nextSong: () => {
    const { currentSongIndex, songs } = get();
    get().playSongAtIndex((currentSongIndex + 1) % songs.length);
  },

  prevSong: () => {
    const { currentSongIndex, songs } = get();
    get().playSongAtIndex((currentSongIndex - 1 + songs.length) % songs.length);
  },

  addSongToList: (song) => {
    set((state) => ({
      songs: [song, ...state.songs],
      currentSongIndex:
        state.currentSongIndex !== null ? state.currentSongIndex + 1 : null,
    }));
  },

listenSocket: () => {
  socket.off("songAction");
  socket.off("newSong");

  socket.on("songAction", ({ type, index, currentTime }) => {
    // ✅ import here to avoid circular dep
    const { partner } = useAuthStore.getState();
    const name = partner?.username || "them";

    if (type === "PLAY") {
      set({ currentSongIndex: index, isPlaying: true, currentTime });
      useChatStore.getState().setLastAction({ type: "PLAYED", byName: name });
    }
    if (type === "PAUSE") {
      set({ isPlaying: false, currentTime });
      useChatStore.getState().setLastAction({ type: "PAUSED", byName: name });
    }
    if (type === "SEEK") {
      set({ currentTime });
      useChatStore.getState().setLastAction({ type: "SEEKED", byName: name });
    }
  });

  socket.on("newSong", (song) => {
    get().addSongToList(song);
  });
},
}));

export default useMusicStore;