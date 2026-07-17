import Message from "../models/Message.js";
import { getPairId } from "../utils/pairId.js";

// SEND MESSAGE (REST fallback — live chat mostly goes through sockets)
export const sendMessage = async (req, res) => {
  const { text } = req.body;

  // The only valid recipient is this user's linked partner. We deliberately
  // ignore any receiverId the client tries to send — otherwise A could type
  // C's id into the request body and message into a pair they're not in.
  const receiverId = req.user.partnerId;
  if (!receiverId) {
    return res.status(403).json({ message: "Pair with your partner first" });
  }
  if (!text?.trim()) {
    return res.status(400).json({ message: "Message text is required" });
  }

  const message = await Message.create({
    senderId: req.user._id,
    receiverId,
    pairId: getPairId(req.user._id, receiverId),
    text: text.trim(),
  });

  res.json(message);
};

// GET CHAT HISTORY — always the caller's own pair. The :userId route param
// is only used to confirm the caller is asking about their actual partner;
// it can no longer be used to read someone else's conversation.
export const getMessages = async (req, res) => {
  const { userId } = req.params;

  if (!req.user.partnerId || req.user.partnerId.toString() !== userId) {
    return res.status(403).json({ message: "Not authorized to view this conversation" });
  }

  const messages = await Message.find({
    pairId: getPairId(req.user._id, req.user.partnerId),
  }).sort({ createdAt: 1 });

  res.json(messages);
};
