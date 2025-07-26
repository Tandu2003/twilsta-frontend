import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { logoutThunk } from '../features/auth/authSlice';
import store from '../store';

// Hàm lấy accessToken từ user trong redux
function getAccessToken() {
  const state = store.getState();
  // Giả sử accessToken nằm trong state.auth.user.accessToken
  return state.auth?.accessToken || '';
}

// Hàm gọi refresh token
async function refreshToken() {
  // Gọi API refresh token trực tiếp qua axios (hoặc tạo service riêng)
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {},
      { withCredentials: true }
    );
    return response.data?.data?.accessToken;
  } catch (error) {
    return null;
  }
}

// Tạo instance axios
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Đảm bảo gửi cookie HttpOnly
});

// Thêm accessToken vào mỗi request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Tự động refresh-token khi lỗi 401, nhưng loại trừ các request thuộc /auth/*
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const url = originalRequest.url || '';
    // Nếu lỗi 401 và không phải các endpoint auth, và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry && !url.includes('/auth/')) {
      originalRequest._retry = true;
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        // Cập nhật accessToken vào redux
        const state = store.getState();
        if (state.auth) {
          state.auth.accessToken = newAccessToken;
        }
        // Gán accessToken mới vào header và retry request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } else {
        // Nếu refresh thất bại, có thể dispatch logout
        store.dispatch(logoutThunk());
      }
    }
    return Promise.reject(error);
  }
);

export default api;
