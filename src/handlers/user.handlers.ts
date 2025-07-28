import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { getProfileThunk } from '@/features/user/userSlice';
import { useApiWithRefresh } from '@/hooks/useApiWithRefresh';
import { getProfile } from '@/services/user.service';

import { AppDispatch } from '../store';

/**
 * Custom hook: Lấy thông tin user hiện tại, tự động refresh token nếu cần
 * @returns Hàm handleGetProfile để gọi trong component
 */
export const useHandleGetProfile = () => {
  const callApi = useApiWithRefresh();

  // Hàm lấy thông tin người dùng
  const handleGetProfile = async () => {
    // Gọi service với callApi để tự động refresh token
    const data = await getProfile(callApi);
    // Xử lý data ở đây nếu cần (dispatch, setState, ...)
    return data;
  };

  return handleGetProfile;
};

// Lấy thông tin người dùng
export const handleGetProfile = async (
  dispatch: AppDispatch,
  callApi: (config: AxiosRequestConfig) => Promise<AxiosResponse>
) => {
  // Gọi thunk lấy thông tin người dùng với callApi
  await dispatch(getProfileThunk(callApi));
};
