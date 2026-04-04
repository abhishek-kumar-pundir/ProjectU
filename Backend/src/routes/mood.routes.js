import express from "express";
import { setMood, getMoods } from "../controllers/mood.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, setMood);
router.get("/", protect, getMoods);

export default router;