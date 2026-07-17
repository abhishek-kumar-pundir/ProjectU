import Mood from "../models/Mood.js";
import { getIO } from "../socket/index.js";
import { getPairId } from "../utils/pairId.js";

// set or update your mood (upsert — one mood per user per pair)
export const setMood = async (req, res) => {
  try {
    const { word, emoji, color } = req.body;
    const pairId = getPairId(req.user._id, req.user.partnerId);

    const mood = await Mood.findOneAndUpdate(
      { userId: req.user._id, pairId },
      { word, emoji, color, pairId },
      { upsert: true, new: true }
    ).populate("userId", "username");

    // broadcast only into this pair's private room — not every connected user
    const io = getIO();
    io.to(pairId).emit("moodUpdated", mood);

    res.json(mood);
  } catch (err) {
    res.status(500).json({ message: "Failed to set mood" });
  }
};

// get both partners' moods — scoped to the caller's own pair only
export const getMoods = async (req, res) => {
  try {
    const pairId = getPairId(req.user._id, req.user.partnerId);

    const moods = await Mood.find({ pairId })
      .populate("userId", "username")
      .sort({ updatedAt: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch moods" });
  }
};
