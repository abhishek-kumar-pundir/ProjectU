import Mood from "../models/Mood.js";
import { getIO } from "../socket/index.js";

// set or update your mood (upsert — one mood per user)
export const setMood = async (req, res) => {
  try {
    const { word, emoji, color } = req.body;

    const mood = await Mood.findOneAndUpdate(
      { userId: req.user },
      { word, emoji, color },
      { upsert: true, new: true }
    ).populate("userId", "username");

    // broadcast to other person
    const io = getIO();
    io.emit("moodUpdated", mood);

    res.json(mood);
  } catch (err) {
    res.status(500).json({ message: "Failed to set mood" });
  }
};

// get both users' moods
export const getMoods = async (req, res) => {
  try {
    const moods = await Mood.find()
      .populate("userId", "username")
      .sort({ updatedAt: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch moods" });
  }
};