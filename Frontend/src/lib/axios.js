import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://ducklingchat-app-backend.onrender.com/api",
  withCredentials: true,
});