import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
// This runs BEFORE every request
api.interceptors.request.use(
  (config) => {
    // Get the token from our Zustand store
    const token = useAuthStore.getState().token;

    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;