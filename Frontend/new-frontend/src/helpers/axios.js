import axios from "axios";

// --- SMART URL SWITCH ---
// If on Localhost, use Localhost. If on Vercel/Mobile, use Render.
const api = window.location.hostname === "localhost" 
  ? "http://localhost:3000" 
  : "https://scarlett-marque.onrender.com";

const axiosInstance = axios.create({
  baseURL: api,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;