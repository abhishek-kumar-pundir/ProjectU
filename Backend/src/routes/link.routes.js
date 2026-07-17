import express from "express";
import {
  addLink,
  getLinks,
  commentOnLink,
} from "../controllers/link.controller.js";
import { protect, requirePartner } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, requirePartner, addLink);
router.get("/", protect, requirePartner, getLinks);
router.post("/:id/comment", protect, requirePartner, commentOnLink);

export default router;
