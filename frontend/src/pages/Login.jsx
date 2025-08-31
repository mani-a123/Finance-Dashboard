import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token); // update state here
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-2xl shadow-2xl w-96 space-y-6 border border-gray-700"
      >
        <h1 className="text-2xl font-bold text-center text-indigo-400 drop-shadow">
          Login
        </h1>
  
        <div>
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="you@example.com"
            required
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder=""
            required
          />
        </div>
  
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 hover:shadow-indigo-500/50 shadow-md transition transform hover:scale-105"
        >
          Sign In
        </button>
  
        <p className="text-sm text-center text-gray-400">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-indigo-400 font-semibold hover:underline hover:text-indigo-300"
          >
            Register
          </a>
        </p>
      </form>
    </div>
  );
  
}
