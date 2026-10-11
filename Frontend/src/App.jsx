import { useEffect, useState } from "react";
import useAuthStore from "./stores/useAuthStore";
import LoadingScreen from "./components/shared/LoadingScreen";
import { lazyComponent } from "react-fastload";

const HomePage = lazyComponent(() => import("./pages/HomePage"), {
  priority: "CRITICAL",
  strategy: "eager",
  fallback: <LoadingScreen />,
});

const LoginPage = lazyComponent(() => import("./pages/LoginPage"), {
  priority: "CRITICAL",
  strategy: "eager",
  fallback: <LoadingScreen />,
});

function App() {
  const { user, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // the auth cookie is httpOnly (invisible to JS), so we always ask the
      // server whether we're logged in rather than checking a stored token
      await checkAuth();
      // minimum 2.5s feel, but also waits for auth
      setTimeout(() => setLoading(false), 2500);
    };

    init();
  }, [checkAuth]);

  if (loading) return <LoadingScreen />;

  return user ? <HomePage /> : <LoginPage />;
}

export default App;
