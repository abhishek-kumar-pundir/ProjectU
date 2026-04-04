import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    word: String,    // "cozy", "missing you", "happy"
    emoji: String,   // "🍂", "💙", "✨"
    color: String,   // hex like "#7c3aed"
  },
  { timestamps: true }
);

export default mongoose.model("Mood", moodSchema);