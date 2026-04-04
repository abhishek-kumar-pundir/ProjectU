import Song from "../models/Song.js";
import cloudinary from "../lib/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getIO } from "../socket/index.js";

export const addSong = async (req, res) => {
  const { title, singer, fileUrl } = req.body;
  const song = await Song.create({ title, singer, fileUrl, uploadedBy: req.user });
  res.json(song);
};

export const getSongs = asyncHandler(async (req, res) => {
  const songs = await Song.find().sort({ createdAt: -1 });
  res.json(songs);
});

export const uploadSong = async (req, res) => {
  try {
    const { title, singer } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const uploaded = await cloudinary.uploader.upload(fileStr, {
      resource_type: "video",
      folder: "songs",
    });

    const song = await Song.create({
      title,
      singer,
      fileUrl: uploaded.secure_url,
      uploadedBy: req.user,
    });

    // ✅ populate uploader username before broadcasting
    const populated = await song.populate("uploadedBy", "username");

    const io = getIO();

    // existing event — sends song data to update lists
    io.emit("newSong", populated);

    // ✅ new event — sends notification to both users
    io.emit("songUploaded", {
      songTitle: populated.title,
      uploaderName: populated.uploadedBy?.username,
    });

    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};