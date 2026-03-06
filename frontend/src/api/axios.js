import axios from "axios";

let baseURL = import.meta.env.VITE_API_URL || 'https://taskmanger-dv14.onrender.com/api';
if (!baseURL.endsWith('/api')) {
  baseURL += '/api';
}

const API = axios.create({
  baseURL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;