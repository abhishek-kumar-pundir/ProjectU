import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import songRoutes from "./routes/song.routes.js";
import linkRoutes from "./routes/link.routes.js";
import moodRoutes from "./routes/mood.routes.js";
import { initSocket } from "./socket/index.js";
import { errorHandler } from "./middleware/error.middleware.js";


dotenv.config();

const app = express();
const server = http.createServer(app);

initSocket(server);

// middleware
app.use(cors());
app.use(express.json());
app.use(errorHandler);
// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth",authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/mood", moodRoutes);

// connect DB + start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
