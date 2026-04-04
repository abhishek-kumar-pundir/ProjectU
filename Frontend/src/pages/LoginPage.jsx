import { useState } from "react";
import useAuthStore from "../stores/useAuthStore";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuthStore();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      await login({
        email: form.email,
        password: form.password,
      });
    } else {
      await register(form);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 bg-zinc-800 rounded"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 bg-zinc-800 rounded"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-zinc-800 rounded"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-purple-600 py-2 rounded">
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          className="text-sm text-center cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Create account"
            : "Already have an account?"}
        </p>
      </form>
    </div>
  );
}