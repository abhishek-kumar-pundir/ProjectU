import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import User from "../models/User.js";
import { registerSocketHandlers } from "./handlers.js";

let io;

// Authenticate every socket connection off the same httpOnly cookie the
// REST API uses — never off anything the client claims in payloads. This is
// what stops a socket from just emitting { userId: "someoneElse" } and
// joining another pair's private room.
const authenticateSocket = async (socket, next) => {
  try {
    const rawCookie = socket.handshake.headers?.cookie;
    const parsed = rawCookie ? cookie.parse(rawCookie) : {};
    const token = parsed.token;

    if (!token) return next(new Error("Not authorized"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return next(new Error("Not authorized"));

    // trust only what the server looked up, never anything from the client
    socket.data.userId = user._id.toString();
    socket.data.partnerId = user.partnerId ? user.partnerId.toString() : null;
    socket.data.username = user.username;

    next();
  } catch (error) {
    next(new Error("Not authorized"));
  }
};

export const initSocket = (server) => {
  const allowedOrigin = process.env.FRONTEND_URL;

  io = new Server(server, {
    cors: {
      origin: allowedOrigin,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(authenticateSocket);
  registerSocketHandlers(io);
  return io;
};

// export so controllers can broadcast into a specific pair's room
export const getIO = () => io;
