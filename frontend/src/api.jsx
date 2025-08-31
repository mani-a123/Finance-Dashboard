import axios from "axios";

// Pick base URL from .env or fallback
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  // baseURL: "http://localhost:5000",
});

// Attach JWT token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

console.log("API Base URL 👉", API.defaults.baseURL);

export default API;
