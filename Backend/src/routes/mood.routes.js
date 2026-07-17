import express from "express";
import { setMood, getMoods } from "../controllers/mood.controller.js";
import { protect, requirePartner } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, requirePartner, setMood);
router.get("/", protect, requirePartner, getMoods);

export default router;
