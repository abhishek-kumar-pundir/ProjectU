import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    url: String,
    comment: String, // ✅ optional description when sharing
    sharedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Link", linkSchema);