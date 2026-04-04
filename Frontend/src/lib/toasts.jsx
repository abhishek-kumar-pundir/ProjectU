import toast from "react-hot-toast";
import socket from "./socket";

export const showUserOnlineToast = (userId, setStore) => {
  toast.custom(
    (t) => (
      <div className={`bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl shadow-lg flex flex-col gap-2 ${t.visible ? "opacity-100" : "opacity-0"} transition-opacity`}>
        <p className="text-sm font-semibold">💜 Your person is online!</p>
        <p className="text-xs text-gray-400">Wanna listen to songs together?</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => {
              socket.emit("listenRequest", { fromUserId: userId });
              setStore({ pendingRequest: true });
              toast.dismiss(t.id);
              toast("Request sent! Waiting... 🎵", { icon: "⏳" });
            }}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs py-1.5 rounded-lg transition"
          >
            Yes, let's go! 🎵
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-xs py-1.5 rounded-lg transition"
          >
            Maybe later
          </button>
        </div>
      </div>
    ),
    { duration: 15000 }
  );
};

export const showListenRequestToast = () => {
  toast.custom(
    (t) => (
      <div className={`bg-zinc-800 border border-purple-600 text-white px-4 py-3 rounded-xl shadow-lg flex flex-col gap-2 ${t.visible ? "opacity-100" : "opacity-0"} transition-opacity`}>
        <p className="text-sm font-semibold">🎵 Listen together request!</p>
        <p className="text-xs text-gray-400">Your person wants to listen to songs with you</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => {
              socket.emit("listenResponse", { accepted: true });
              toast.dismiss(t.id);
            }}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs py-1.5 rounded-lg transition"
          >
            Accept 💜
          </button>
          <button
            onClick={() => {
              socket.emit("listenResponse", { accepted: false });
              toast.dismiss(t.id);
            }}
            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-xs py-1.5 rounded-lg transition"
          >
            Not now
          </button>
        </div>
      </div>
    ),
    { duration: 20000 }
  );
};