import { create } from "zustand";
import API from "../lib/axios";

const useAuthStore = create((set) => ({
  user: null,
  partner: null,

  checkAuth: async () => {
    try {
      const res = await API.get("/auth/me");
      set({ user: res.data });
    } catch {
      set({ user: null });
    }
  },

  // fetches THIS user's linked partner only — replaces the old
  // fetchOtherUser, which used to grab whichever other user happened to
  // exist in the DB
  fetchPartner: async () => {
    try {
      const res = await API.get("/auth/partner");
      set({ partner: res.data });
    } catch {
      console.error("Could not fetch partner");
    }
  },

  generateInviteCode: async () => {
    const res = await API.post("/auth/invite/generate");
    return res.data; // { code, expiresAt }
  },

  redeemInviteCode: async (code) => {
    const res = await API.post("/auth/invite/redeem", { code });
    set({ user: res.data });
    return res.data;
  },

  login: async (data) => {
    // the server sets an httpOnly auth cookie on success — nothing to store client-side
    const res = await API.post("/auth/login", data);
    set({ user: res.data });
  },

  register: async (data) => {
    const res = await API.post("/auth/register", data);
    set({ user: res.data });
  },

  logout: async () => {
    try {
      await API.post("/auth/logout");
    } finally {
      set({ user: null, partner: null });
    }
  },
}));

export default useAuthStore;
