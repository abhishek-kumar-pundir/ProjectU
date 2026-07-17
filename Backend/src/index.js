import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
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
const allowedOrigin = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true, // required so the browser sends/receives the httpOnly auth cookie
  })
);
app.use(express.json());
app.use(cookieParser());

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/mood", moodRoutes);

// error handler must come AFTER routes — Express only reaches it when a
// route calls next(err) or throws; mounted before routes (as it was) it
// never actually caught anything.
app.use(errorHandler);

// connect DB + start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
