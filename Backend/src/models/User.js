import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String },

    // the one partner this user is linked with — null until paired.
    // every private feature (chat, mood, links, listen-together) is scoped
    // off this field, never off "whoever else happens to be in the DB".
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // one-time invite code this user generated, waiting to be redeemed
    pairingCode: { type: String, default: null, index: true, sparse: true },
    pairingCodeExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
