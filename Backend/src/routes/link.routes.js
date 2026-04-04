import express from "express";
import {
  addLink,
  getLinks,
  commentOnLink,
} from "../controllers/link.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, addLink);
router.get("/", protect, getLinks);
router.post("/:id/comment", protect, commentOnLink);

export default router;