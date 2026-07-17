import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  getPartner,
  generateInviteCode,
  redeemInviteCode,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.get("/partner", protect, getPartner);
router.post("/invite/generate", protect, generateInviteCode);
router.post("/invite/redeem", protect, redeemInviteCode);

export default router;
