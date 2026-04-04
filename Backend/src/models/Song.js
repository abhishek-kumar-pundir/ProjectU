import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: String,
    singer: String,
    fileUrl: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Song", songSchema);