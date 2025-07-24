// Auth service: handles all API calls related to authentication
import { ApiResponse } from '@/types/api-response';
import axios from 'axios';

const API_URL = '/api/auth';

// Login API call
export const login = async (data: {
  username: string;
  password: string;
}): Promise<ApiResponse> => {
  // Gửi yêu cầu đăng nhập
  const response = await axios.post<ApiResponse>(`${API_URL}/login`, data, {
    withCredentials: true,
  });
  return response.data;
};

// Register API call
export const register = async (data: {
  username: string;
  password: string;
  email: string;
}): Promise<ApiResponse> => {
  // Gửi yêu cầu đăng ký
  const response = await axios.post<ApiResponse>(`${API_URL}/register`, data, {
    withCredentials: true,
  });
  return response.data;
};

// Logout API call
export const logout = async (): Promise<ApiResponse> => {
  // Gửi yêu cầu đăng xuất
  const response = await axios.post<ApiResponse>(
    `${API_URL}/logout`,
    {},
    { withCredentials: true },
  );
  return response.data;
};
