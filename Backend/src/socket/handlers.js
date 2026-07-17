import Message from "../models/Message.js";
import { getPairId } from "../utils/pairId.js";

// userId -> { socketId, pairId }
const onlineUsers = {};

// pairId -> boolean — whether THAT pair currently has "listen together"
// active. Keyed by pair instead of a single global flag, so pair A/B
// starting a sync session no longer flips sync on for pair C/D too.
const syncModeByPair = {};

export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    // identity comes entirely from the authenticated handshake (see
    // socket/index.js) — there is no client-sent "join" event with an
    // arbitrary userId anymore, so a socket can only ever land in its own
    // pair's room.
    const { userId, partnerId, username } = socket.data;
    const pairId = partnerId ? getPairId(userId, partnerId) : null;

    console.log("User connected:", socket.id, userId);

    if (pairId) {
      socket.join(pairId);
      onlineUsers[userId] = { socketId: socket.id, pairId };

      const partnerEntry = onlineUsers[partnerId];
      const onlineIds = partnerEntry ? [userId, partnerId] : [userId];
      // only tell this pair's room who's online, not the whole server
      io.to(pairId).emit("onlineUsers", onlineIds);

      socket.to(pairId).emit("userCameOnline", { userId });
    }

    // 💬 CHAT — text only; sender/receiver are derived server-side from the
    // authenticated socket, so a client can no longer pass an arbitrary
    // receiverId to message into someone else's pair
    socket.on("sendMessage", async ({ text }) => {
      try {
        if (!text?.trim() || !pairId) return;

        const message = await Message.create({
          senderId: userId,
          receiverId: partnerId,
          pairId,
          text: text.trim(),
        });

        io.to(pairId).emit("receiveMessage", message);
      } catch (error) {
        console.error("Message error:", error.message);
      }
    });

    // 🎵 SONG SYNC — private to this pair's room only
    socket.on("songAction", (payload) => {
      if (pairId && syncModeByPair[pairId]) {
        socket.to(pairId).emit("songAction", payload);
      }
    });

    socket.on("requestSongState", () => {
      if (pairId) socket.to(pairId).emit("requestSongState");
    });

    socket.on("sendSongState", (state) => {
      if (pairId) socket.to(pairId).emit("receiveSongState", state);
    });

    // 🎧 LISTEN TOGETHER HANDSHAKE — scoped to this pair's room
    socket.on("listenRequest", () => {
      if (!pairId) return;
      socket.to(pairId).emit("listenRequest", { fromUserId: userId, fromUsername: username });
    });

    socket.on("listenResponse", ({ accepted }) => {
      if (!pairId) return;
      if (accepted) {
        syncModeByPair[pairId] = true;
        io.to(pairId).emit("syncStarted");
      } else {
        io.to(pairId).emit("syncDeclined");
      }
    });

    socket.on("stopSync", () => {
      if (!pairId) return;
      syncModeByPair[pairId] = false;
      io.to(pairId).emit("syncStopped");
    });

    // ❌ DISCONNECT
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (onlineUsers[userId]?.socketId === socket.id) {
        delete onlineUsers[userId];
        if (pairId) socket.to(pairId).emit("userWentOffline", { userId });
      }
    });
  });
};
