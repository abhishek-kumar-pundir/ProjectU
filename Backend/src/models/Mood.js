import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // scopes this mood entry to one pair, same as Message/Link
    pairId: { type: String, index: true },
    word: String,    // "cozy", "missing you", "happy"
    emoji: String,   // "🍂", "💙", "✨"
    color: String,   // hex like "#7c3aed"
  },
  { timestamps: true }
);

export default mongoose.model("Mood", moodSchema);
