import axios, { type AxiosInstance } from 'axios';

// Tạo instance axios dùng chung cho client
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export default api;
