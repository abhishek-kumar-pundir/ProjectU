import express from "express";
import {
  uploadSong,
  getSongs,
} from "../controllers/song.controller.js";

import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// MP3 upload
router.post("/upload", protect, upload.single("file"), uploadSong);

// get all songs
router.get("/", protect, getSongs);

export default router;