import useAuthStore from "./stores/useAuthStore";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/shared/LoadingScreen";

function App() {
  const { token, user, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (token) {
        await checkAuth(); // ✅ wait for user to be restored
      }
      // minimum 2.5s feel, but also waits for auth
      setTimeout(() => setLoading(false), 2500);
    };

    init();
  }, []);

  if (loading) return <LoadingScreen />;

  return token && user ? <HomePage /> : <LoginPage />;
}

export default App;