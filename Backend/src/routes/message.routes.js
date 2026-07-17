import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import { protect, requirePartner } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, requirePartner, sendMessage);
router.get("/:userId", protect, requirePartner, getMessages);

export default router;
