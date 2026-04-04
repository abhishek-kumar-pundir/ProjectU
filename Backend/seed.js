import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./src/lib/db.js";
import cloudinary from "./src/lib/cloudinary.js";

import User from "./src/models/User.js";
import Song from "./src/models/Song.js";
import Link from "./src/models/Link.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// helper: upload local file → cloudinary
const uploadToCloudinary = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);

  const base64 = `data:audio/mp3;base64,${fileBuffer.toString("base64")}`;

  const res = await cloudinary.uploader.upload(base64, {
    resource_type: "video", // IMPORTANT
    folder: "songs",
  });

  return res.secure_url;
};

const seed = async () => {
  try {
    await connectDB();

    console.log("Seeding started...");

    // find user
    const user = await User.findOne({ email: "abhishek@email.com" });

    if (!user) {
      console.log("User not found ❌");
      process.exit();
    }

    // clear old data (optional)
    await Song.deleteMany();
    await Link.deleteMany();

    // 📁 paths
    const song1Path = path.join(__dirname, "upload/song1.mp3");
    const song2Path = path.join(__dirname, "upload/song2.mp3");

    // 🎵 upload songs
    console.log("Uploading songs to Cloudinary...");

    const url1 = await uploadToCloudinary(song1Path);
    const url2 = await uploadToCloudinary(song2Path);

    // save songs
    const songs = await Song.insertMany([
      {
        title: "Bairan",
        singer: "Unknown",
        fileUrl: url1,
        uploadedBy: user._id,
      },
      {
        title: "Zulfein",
        singer: "Unknown",
        fileUrl: url2,
        uploadedBy: user._id,
      },
    ]);

    // 🔗 add links
    const links = await Link.insertMany([
      {
        url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
        sharedBy: user._id,
      },
      {
        url: "https://open.spotify.com",
        sharedBy: user._id,
      },
    ]);

    console.log("✅ Songs inserted:", songs.length);
    console.log("✅ Links inserted:", links.length);

    console.log("🎉 SEED COMPLETE");

    process.exit();
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seed();