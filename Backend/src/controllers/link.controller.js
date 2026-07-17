import Link from "../models/Link.js";
import { getIO } from "../socket/index.js";
import { getPairId } from "../utils/pairId.js";

// ADD LINK
export const addLink = async (req, res) => {
  try {
    const { url, comment } = req.body; // optional comment
    const pairId = getPairId(req.user._id, req.user.partnerId);

    const link = await Link.create({
      url,
      comment,
      pairId,
      sharedBy: req.user._id,
    });

    const populated = await link.populate("sharedBy", "username");

    // broadcast only to this pair's private room
    const io = getIO();
    io.to(pairId).emit("newLink", populated);

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add link" });
  }
};

// GET LINKS — scoped to the caller's own pair only
export const getLinks = async (req, res) => {
  try {
    const pairId = getPairId(req.user._id, req.user.partnerId);

    const links = await Link.find({ pairId })
      .sort({ createdAt: -1 })
      .populate("sharedBy", "username");

    res.json(links);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch links" });
  }
};

// ADD COMMENT TO LINK
export const commentOnLink = async (req, res) => {
  try {
    const { text } = req.body;
    const pairId = getPairId(req.user._id, req.user.partnerId);

    // scoping the lookup by pairId too means a user can't comment on (or even
    // confirm the existence of) another pair's link by guessing its id
    const link = await Link.findOne({ _id: req.params.id, pairId });
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    link.comments.push({ userId: req.user._id, text });
    await link.save();

    const populated = await link.populate("sharedBy", "username");

    const io = getIO();
    io.to(pairId).emit("updateLink", populated);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};
