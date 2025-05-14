// /services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

// Attach token & API key to every request
API.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' && localStorage.getItem('token');
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (apiKey) config.headers['x-api-key'] = apiKey;

  return config;
});

export default API;
