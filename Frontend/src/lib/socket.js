import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const socket = io(BASE_URL, {
  autoConnect: false,
  withCredentials: true, // sends the httpOnly auth cookie so the server can identify + pair-scope this socket
});

export default socket;
