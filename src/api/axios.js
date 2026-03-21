import axios from "axios";

// FIX: Use environment variable for base URL so it works in dev, staging, and production
// Set REACT_APP_API_URL in your .env file for each environment
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
