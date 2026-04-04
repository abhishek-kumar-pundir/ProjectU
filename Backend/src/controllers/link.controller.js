import Link from "../models/Link.js";
import { getIO } from "../socket/index.js";

// ADD LINK
export const addLink = async (req, res) => {
  try {
    const { url, comment } = req.body; // ✅ accept optional comment

    const link = await Link.create({
      url,
      comment,
      sharedBy: req.user,
    });

    // populate username before sending
    const populated = await link.populate("sharedBy", "username");

    // ✅ broadcast to other user in real time
    const io = getIO();
    io.emit("newLink", populated);

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add link" });
  }
};

// GET LINKS
export const getLinks = async (req, res) => {
  try {
    const links = await Link.find()
      .sort({ createdAt: -1 })
      .populate("sharedBy", "username"); // ✅ include username

    res.json(links);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch links" });
  }
};

// ADD COMMENT TO LINK
export const commentOnLink = async (req, res) => {
  try {
    const { text } = req.body;

    const link = await Link.findById(req.params.id);
    link.comments.push({ userId: req.user, text });
    await link.save();

    const populated = await link.populate("sharedBy", "username");

    // ✅ broadcast updated link so other user sees new comment live
    const io = getIO();
    io.emit("updateLink", populated);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};