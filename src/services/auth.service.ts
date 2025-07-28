// Auth service: handles all API calls related to authentication
import api from '@/lib/axios';
import { ApiResponse } from '@/types/api-response';
import { LoginDto, RegisterDto } from '@/types/auth.type';

const API_URL = '/api/auth';

// Login API call
export const login = async (data: LoginDto): Promise<ApiResponse> => {
  // Gửi yêu cầu đăng nhập
  const response = await api.post<ApiResponse>(`${API_URL}/login`, data, {
    withCredentials: true,
  });
  return response.data;
};

// Register API call
export const register = async (data: RegisterDto): Promise<ApiResponse> => {
  // Gửi yêu cầu đăng ký
  const response = await api.post<ApiResponse>(`${API_URL}/register`, data, {
    withCredentials: true,
  });
  return response.data;
};

// Logout API call
export const logout = async (): Promise<ApiResponse> => {
  // Gửi yêu cầu đăng xuất
  const response = await api.post<ApiResponse>(`${API_URL}/logout`, {}, { withCredentials: true });
  return response.data;
};

// Force logout API call (không cần accessToken)
export const forceLogout = async (): Promise<ApiResponse> => {
  // Gửi yêu cầu force logout
  const response = await api.post<ApiResponse>(
    `${API_URL}/force-logout`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

// Verify email API call
export const verifyEmail = async (token: string): Promise<ApiResponse> => {
  // Gửi yêu cầu xác thực email
  const response = await api.post<ApiResponse>(
    `${API_URL}/verify-email`,
    { token },
    {
      withCredentials: true,
    }
  );
  return response.data;
};
