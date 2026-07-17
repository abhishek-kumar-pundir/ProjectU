import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // canonical id of the (sender, receiver) pair — every read is scoped to
    // exactly one pairId, so pair A/B's messages can never surface in C/D's chat
    pairId: { type: String, index: true },
    text: String,
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
