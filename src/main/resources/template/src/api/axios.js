import axios from "axios";

const api = axios.create({
  // This looks for the VITE_API_URL you set in Render. 
  // It falls back to localhost ONLY during local development.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add an interceptor to include the JWT token in every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;