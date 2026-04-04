import useAuthStore from "./stores/useAuthStore";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";


function App() {
  const { token,checkAuth } = useAuthStore();

  useEffect(() => {
    if (token) checkAuth(); // 🔥 restore user
  }, [token]);

  return token ? <HomePage /> : <LoginPage />;
}

export default App;