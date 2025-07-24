// User service: handles all API calls related to user
import axios from 'axios';
import type { ApiResponse } from '@/types/api-response';

const API_URL = '/api/user';

// Lấy thông tin user hiện tại (đã xác thực)
export const getProfile = async (): Promise<ApiResponse> => {
  // Gọi API đúng với backend: /user/me
  const response = await axios.get<ApiResponse>(`${API_URL}/me`, {
    withCredentials: true,
  });
  return response.data;
};
