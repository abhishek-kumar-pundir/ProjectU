import { create } from "zustand";
import API from "../lib/axios";

const useAuthStore = create((set) => ({
  user: null,
  otherUser: null,
  token: localStorage.getItem("token") || null,

  checkAuth: async () => {
    try {
      const res = await API.get("/auth/me");
      set({ user: res.data });
    } catch {
      set({ user: null });
    }
  },

  fetchOtherUser: async () => {
    try {
      const res = await API.get("/auth/other-user");
      set({ otherUser: res.data });
    } catch {
      console.error("Could not fetch other user");
    }
  },

  login: async (data) => {
    const res = await API.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    set({ user: res.data, token: res.data.token });
  },

  register: async (data) => {
    const res = await API.post("/auth/register", data);
    localStorage.setItem("token", res.data.token);
    set({ user: res.data, token: res.data.token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;