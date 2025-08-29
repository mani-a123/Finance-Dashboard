import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 backdrop-blur-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-300 drop-shadow-md">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg shadow-lg transition transform hover:scale-105"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:text-indigo-600 hover:underline transition">
            Login
          </a>
        </p>
      </div>
    </div>
  );
  
}
