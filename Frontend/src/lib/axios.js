import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  // send/receive the httpOnly auth cookie on every request instead of
  // attaching a token read from localStorage (which any XSS payload could
  // otherwise read)
  withCredentials: true,
});

export default API;
