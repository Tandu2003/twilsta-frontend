// Custom hook: Tự động refresh token khi gặp lỗi 401
// Dùng cho mọi API call cần bảo vệ bằng accessToken
import { useCallback } from 'react';

import { AxiosError, AxiosRequestConfig } from 'axios';

import { logoutThunk, setAccessToken } from '@/features/auth/authSlice';
import { handleForceLogoutWithApi } from '@/handlers/auth.handlers';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import api from '@/lib/axios';

/**
 * Gọi API với accessToken, tự động refresh token nếu hết hạn
 * @param config - Axios request config
 * @returns Axios response
 */
export function useApiWithRefresh() {
  const accessToken = useAppSelector(state => state.auth.accessToken);
  const dispatch = useAppDispatch();

  // Hàm gọi API, tự động refresh token nếu lỗi 401
  const callApi = useCallback(
    async (config: AxiosRequestConfig) => {
      try {
        // Gọi API với accessToken hiện tại
        const response = await api.request({
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return response;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        // Nếu lỗi 401, thử refresh token
        if (axiosError.response?.status === 401 && !config.url?.includes('/auth/')) {
          try {
            // Gọi API refresh token
            const refreshRes = await api.post(
              '/api/auth/refresh-token',
              {},
              { withCredentials: true }
            );
            const newToken = refreshRes.data?.data?.accessToken;
            if (newToken) {
              // Lưu accessToken mới vào Redux
              dispatch(setAccessToken(newToken));
              // Retry request với token mới
              const retryRes = await api.request({
                ...config,
                headers: {
                  ...config.headers,
                  Authorization: `Bearer ${newToken}`,
                },
              });
              return retryRes;
            } else {
              // Refresh token thất bại, force logout
              handleForceLogoutWithApi(dispatch);
              throw error;
            }
          } catch {
            // Refresh token thất bại, force logout
            handleForceLogoutWithApi(dispatch);
            throw error;
          }
        }
        throw error;
      }
    },
    [accessToken, dispatch]
  );

  return callApi;
}
