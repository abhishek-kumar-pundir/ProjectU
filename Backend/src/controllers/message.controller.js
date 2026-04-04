import Message from "../models/Message.js";

// SEND MESSAGE (store in DB)
export const sendMessage = async (req, res) => {
  const { receiverId, text } = req.body;

  const message = await Message.create({
    senderId: req.user,
    receiverId,
    text,
  });

  res.json(message);
};

// GET CHAT HISTORY
export const getMessages = async (req, res) => {
  const { userId } = req.params;

  const messages = await Message.find({
    $or: [
      { senderId: req.user, receiverId: userId },
      { senderId: userId, receiverId: req.user },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
};