import Message from "../models/Message.js";

const onlineUsers = {};
const ROOM_ID = "private-room";
let syncMode = false; // track if both agreed to listen together

export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
  onlineUsers[userId] = socket.id;
  socket.join(ROOM_ID);
  io.emit("onlineUsers", Object.keys(onlineUsers));

  // ✅ only emit to the OTHER person, not back to self
  socket.to(ROOM_ID).emit("userCameOnline", { userId });
});


    // 💬 CHAT
    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      try {
        if (!text) return;
        const message = await Message.create({ senderId, receiverId, text });
        const receiverSocket = onlineUsers[receiverId];
        if (receiverSocket) io.to(receiverSocket).emit("receiveMessage", message);
        socket.emit("receiveMessage", message);
      } catch (error) {
        console.error("Message error:", error.message);
      }
    });

    // 🎵 SONG SYNC
    socket.on("songAction", (payload) => {
      if (syncMode) {
        socket.to(ROOM_ID).emit("songAction", payload);
      }
    });

    socket.on("uploadSong", (song) => {
      socket.to(ROOM_ID).emit("newSong", song);
    });

    socket.on("addLink", (link) => {
      socket.to(ROOM_ID).emit("newLink", link);
    });

    socket.on("commentLink", (link) => {
      socket.to(ROOM_ID).emit("updateLink", link);
    });

    // 🎧 LISTEN TOGETHER HANDSHAKE
    // User A sends invite to User B
    socket.on("listenRequest", ({ fromUserId, fromUsername }) => {
      socket.to(ROOM_ID).emit("listenRequest", { fromUserId, fromUsername });
    });

    // User B responds
    socket.on("listenResponse", ({ accepted }) => {
      if (accepted) {
        syncMode = true;
        // tell BOTH users sync is active
        io.to(ROOM_ID).emit("syncStarted");
      } else {
        io.to(ROOM_ID).emit("syncDeclined");
      }
    });

    // Either user can stop sync
    socket.on("stopSync", () => {
      syncMode = false;
      io.to(ROOM_ID).emit("syncStopped");
    });

    socket.on("requestSongState", () => {
      socket.to(ROOM_ID).emit("requestSongState");
    });

    socket.on("sendSongState", (state) => {
      socket.to(ROOM_ID).emit("receiveSongState", state);
    });

    socket.on("moodUpdated", (mood) => {
      socket.to(ROOM_ID).emit("moodUpdated", mood);
    });

    // ❌ DISCONNECT
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (let userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          // notify other user this person went offline
          socket.to(ROOM_ID).emit("userWentOffline", { userId });
        }
      }
      io.emit("onlineUsers", Object.keys(onlineUsers));
    });
  });
};