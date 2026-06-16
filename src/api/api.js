import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
});

// ── REQUEST INTERCEPTOR ──
// Automatically attach JWT token to every outgoing request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR ──
// If token is expired or invalid (401/403), clear session and redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      window.location.href = "/"; // redirect to landing/login
    }
    return Promise.reject(error);
  }
);

export default API;