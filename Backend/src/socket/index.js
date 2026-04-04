import { Server } from "socket.io";
import { registerSocketHandlers } from "./handlers.js";

let io;

export const initSocket = (server) => {
  const allowedOrigin = process.env.FRONTEND_URL;

io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

  registerSocketHandlers(io);
  return io;
};

// ✅ export so controller can use it
export const getIO = () => io;