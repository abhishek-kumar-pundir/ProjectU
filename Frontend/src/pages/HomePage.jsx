import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import useAuthStore from "../stores/useAuthStore";
import useChatStore from "../stores/useChatStore";
import useMusicStore from "../stores/useMusicStore";
import ChatBox from "../components/chat/ChatBox";
import Navbar from "../components/shared/Navbar";
import Background from "../components/shared/Background";
import PairingGate from "../components/shared/PairingGate";
import { lazyComponent } from "react-fastload";

const MusicPanel = lazyComponent(() => import("../components/music/MusicPanel"), {
  priority: "HIGH",
  fallback: <div className="h-full rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse" />,
});

const MoodBoard = lazyComponent(() => import("../components/mood/MoodBoard"), {
  priority: "NORMAL",
  fallback: <div className="h-44 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse" />,
});

const LinkPanel = lazyComponent(() => import("../components/links/LinkPanel"), {
  priority: "NORMAL",
  fallback: <div className="h-full rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse" />,
});

export default function HomePage() {
  const { user, fetchPartner } = useAuthStore();
  const { connectSocket } = useChatStore();
  const { listenSocket: listenMusicSocket, fetchSongs } = useMusicStore();

  useEffect(() => {
    if (Notification.permission === "default") Notification.requestPermission();
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    // socket identity/room now comes from the auth cookie server-side, so no
    // userId needs to be passed here anymore
    connectSocket();
    listenMusicSocket();
    fetchSongs();
    fetchPartner();
  }, [user?._id, connectSocket, listenMusicSocket, fetchSongs, fetchPartner]);

  // no partner linked yet — show the pairing screen instead of a shared
  // space that (before this change) any other signed-up user could see into
  if (!user?.partnerId) {
    return <PairingGate />;
  }

  return (
    <div className="h-screen bg-[#0a0a0f] text-white flex flex-col overflow-hidden">
      {/* ambient background glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-pink-900/10 rounded-full blur-[100px]" />
      </div>
        <Background/>
      <Navbar />

      <Toaster
  position="top-center"
  toastOptions={{
    style: {
      background: "rgba(20,12,36,0.98)",
      border: "1px solid rgba(139,92,246,0.35)",
      color: "#e2e8f0",
      borderRadius: "12px",
      fontSize: "14px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      backdropFilter: "blur(20px)",
    },
  }}
/>

      <div className="flex-1 overflow-hidden pt-14 p-3">
        <PanelGroup direction="horizontal" className="h-full gap-0">

          {/* LEFT — Music + Vibe */}
          <Panel defaultSize={23} minSize={18} maxSize={35}>
            <div className="h-full flex flex-col gap-3 pr-1.5">
              <div className="flex-1 min-h-0">
                <MusicPanel />
              </div>
              <div className="shrink-0">
                <MoodBoard />
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-3 flex items-center justify-center cursor-col-resize group">
            <div className="h-16 w-[3px] bg-zinc-800 rounded-full group-hover:bg-purple-500/60 transition-all duration-200" />
          </PanelResizeHandle>

          {/* CENTER — Chat (main feature) */}
          <Panel defaultSize={40} minSize={28}>
            <div className="h-full px-1.5">
              <ChatBox />
            </div>
          </Panel>

          <PanelResizeHandle className="w-3 flex items-center justify-center cursor-col-resize group">
            <div className="h-16 w-[3px] bg-zinc-800 rounded-full group-hover:bg-purple-500/60 transition-all duration-200" />
          </PanelResizeHandle>

          {/* RIGHT — Links */}
          <Panel defaultSize={37} minSize={22} maxSize={45}>
            <div className="h-full pl-1.5">
              <LinkPanel />
            </div>
          </Panel>

        </PanelGroup>
      </div>
    </div>
  );
}