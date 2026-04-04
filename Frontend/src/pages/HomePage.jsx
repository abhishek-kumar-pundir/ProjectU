import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import useAuthStore from "../stores/useAuthStore";
import useChatStore from "../stores/useChatStore";
import useMusicStore from "../stores/useMusicStore";
import ChatBox from "../components/chat/ChatBox";
import MusicPanel from "../components/music/MusicPanel";
import LinkPanel from "../components/links/LinkPanel";
import MoodBoard from "../components/mood/MoodBoard";
import Navbar from "../components/shared/Navbar";

export default function HomePage() {
  const { user, checkAuth } = useAuthStore();
  const { connectSocket } = useChatStore();
  const { listenSocket: listenMusicSocket, fetchSongs } = useMusicStore();

  useEffect(() => {
    checkAuth();
    if (Notification.permission === "default") Notification.requestPermission();
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    connectSocket(user._id);
    listenMusicSocket();
    fetchSongs();
  }, [user?._id]);

  return (
    <div className="h-screen bg-[#0a0a0f] text-white flex flex-col overflow-hidden">
      {/* ambient background glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-pink-900/10 rounded-full blur-[100px]" />
      </div>

      <Navbar />

      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: "transparent", boxShadow: "none", padding: 0 },
        }}
      />

      <div className="flex-1 overflow-hidden pt-16 p-3">
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