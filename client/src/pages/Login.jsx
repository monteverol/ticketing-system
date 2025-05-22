import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5002/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const user = await res.json();
      login(user.user_id, user.username, user.role, user.department);
      navigate("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md space-y-4 w-80"
      >
        <h2 className="text-xl font-bold text-center">Login</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input
          className="border p-2 w-full"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="text-white w-full p-2 rounded bg-slate-500 hover:bg-slate-600 cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  );
}
