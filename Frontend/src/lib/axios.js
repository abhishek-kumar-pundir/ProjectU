import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;