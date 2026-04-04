import { Server } from "socket.io";
import { registerSocketHandlers } from "./handlers.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  registerSocketHandlers(io);
  return io;
};

// ✅ export so controller can use it
export const getIO = () => io;