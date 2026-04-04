import express from "express";
import { register, login, getMe, getOtherUser } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js"

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/other-user", protect, getOtherUser);

export default router;