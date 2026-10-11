import { create } from "zustand";
import API from "../lib/axios";
import socket from "../lib/socket";

const useLinkStore = create((set) => ({
  links: [],

  fetchLinks: async () => {
    try {
      const res = await API.get("/links");
      set({ links: res.data });
    } catch (err) {
      console.error("Links fetch error:", err);
    }
  },

  addLink: async (url, comment = "") => {
    try {
      // optimistic update happens via socket newLink event
      await API.post("/links", { url, comment });
      // don't manually push — socket newLink will add it for both users
    } catch (err) {
      console.error("Add link error:", err);
    }
  },

  addComment: async (linkId, text) => {
    try {
      await API.post(`/links/${linkId}/comment`, { text });
      // socket updateLink will refresh it for both users
    } catch (err) {
      console.error("Comment error:", err);
    }
  },

  // ✅ call once on mount
  listenSocket: () => {
    socket.off("newLink");
    socket.off("updateLink");

    // new link added by either user
    socket.on("newLink", (link) => {
      set((state) => ({
        links: [link, ...state.links],
      }));
    });

    // link updated (new comment added)
    socket.on("updateLink", (updatedLink) => {
      set((state) => ({
        links: state.links.map((l) =>
          l._id === updatedLink._id ? updatedLink : l
        ),
      }));
    });
  },
}));

export default useLinkStore;