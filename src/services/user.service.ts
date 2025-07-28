// User service: handles all API calls related to user
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import type { ApiResponse } from '@/types/api-response';

// Lấy thông tin user hiện tại (đã xác thực)
// Sử dụng callApi từ useApiWithRefresh để tự động refresh token khi cần
export const getProfile = async (
  callApi: (config: AxiosRequestConfig) => Promise<AxiosResponse>
): Promise<ApiResponse> => {
  // Gọi API qua callApi để tự động refresh token nếu cần
  const response = await callApi({
    url: '/api/user/me',
    method: 'GET',
    withCredentials: true,
  });
  return response.data;
};
