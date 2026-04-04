import toast from "react-hot-toast";
import socket from "./socket";

const toastStyle = {
  background: "rgba(20,12,36,0.98)",
  border: "1px solid rgba(139,92,246,0.4)",
  borderRadius: "20px",
  padding: "24px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)",
  backdropFilter: "blur(20px)",
};

export const showUserOnlineToast = (userId, setStore) => {
  toast.custom(
    (t) => (
      <div style={toastStyle}
        className={`px-6 py-5 flex flex-col gap-4 min-w-[340px] transition-all duration-300 ${t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
            style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)" }}>
            💜
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Your person is online!</p>
            <p className="text-xs text-zinc-400 mt-1">Wanna listen to songs together?</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              socket.emit("listenRequest", { fromUserId: userId });
              setStore({ pendingRequest: true });
              toast.dismiss(t.id);
              toast("Request sent! Waiting... 🎵", {
                duration: 3000,
                style: {
                  background: "rgba(20,12,36,0.98)",
                  border: "1px solid rgba(139,92,246,0.4)",
                  color: "#e2e8f0",
                  borderRadius: "12px",
                  fontSize: "14px",
                }
              });
            }}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
            Yes, let's go 🎵
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 py-2.5 rounded-xl text-sm text-zinc-300 transition-all hover:text-white"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
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
      <div style={{ ...toastStyle, borderColor: "rgba(236,72,153,0.4)" }}
        className={`px-6 py-5 flex flex-col gap-4 min-w-[340px] transition-all duration-300 ${t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
            style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.3)" }}>
            🎵
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Listen together?</p>
            <p className="text-xs text-zinc-400 mt-1">Your person wants to sync songs with you</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              socket.emit("listenResponse", { accepted: true });
              toast.dismiss(t.id);
            }}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
            Accept 💜
          </button>
          <button
            onClick={() => {
              socket.emit("listenResponse", { accepted: false });
              toast.dismiss(t.id);
            }}
            className="flex-1 py-2.5 rounded-xl text-sm text-zinc-300 transition-all hover:text-white"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
            Not now
          </button>
        </div>
      </div>
    ),
    { duration: 20000 }
  );
};